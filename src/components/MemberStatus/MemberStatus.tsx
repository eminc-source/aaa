import { useWallet } from '@txnlab/use-wallet-react'
import { useEffect, useState } from 'react'
import algosdk from 'algosdk'
import './MemberStatus.css'

const IGA_ASA_ID = 2635992378

// Member tiers based on $iGA balance (in micro units, 6 decimals)
// 1 iGA = 1,000,000 micro units
const getMemberTier = (igaBalance: number): { tier: string; color: string } => {
  const iGA = igaBalance / 1000000 // Convert to whole iGA
  
  if (iGA >= 1) return { tier: 'iGA BOARD', color: '#39ff14' }      // 1+ iGA - Green
  if (iGA >= 0.333) return { tier: 'iGA 333', color: '#00ff00' }    // 0.333+ iGA - Green
  if (iGA > 0) return { tier: 'iGA MEMBER', color: '#ff4444' }      // Any iGA - Red
  return { tier: 'ALGOFAM', color: '#ffff00' }                       // No iGA - Yellow
}

const formatBalance = (microAmount: number, decimals: number = 6): string => {
  const amount = microAmount / Math.pow(10, decimals)
  return amount.toFixed(6)
}

const MemberStatus = () => {
  const { activeAccount } = useWallet()
  const [algoBalance, setAlgoBalance] = useState<number>(0)
  const [igaBalance, setIgaBalance] = useState<number>(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchBalances = async () => {
      if (!activeAccount?.address) {
        setAlgoBalance(0)
        setIgaBalance(0)
        return
      }

      setLoading(true)
      try {
        // Use Nodely public API for mainnet
        const algodClient = new algosdk.Algodv2('', 'https://mainnet-api.algonode.cloud', '')
        
        const accountInfo = await algodClient.accountInformation(activeAccount.address).do()
        
        console.log('Account info:', accountInfo)
        console.log('Looking for ASA ID:', IGA_ASA_ID)
        
        // Get ALGO balance (in microAlgos) - handle both old and new algosdk formats
        const algoAmount = accountInfo.amount ?? accountInfo['amount']
        setAlgoBalance(Number(algoAmount))
        
        // Find $iGA asset balance - handle both old and new algosdk formats
        const assets = accountInfo.assets ?? accountInfo['assets'] ?? []
        console.log('Assets found:', assets)
        
        // The property might be 'asset-id' or 'assetId' depending on algosdk version
        const igaAsset = assets.find((asset: Record<string, unknown>) => {
          const assetId = asset['asset-id'] ?? asset['assetId'] ?? asset.assetId
          console.log('Checking asset:', assetId, 'against', IGA_ASA_ID)
          return Number(assetId) === IGA_ASA_ID
        })
        
        console.log('Found iGA asset:', igaAsset)
        const igaAmount = igaAsset ? (igaAsset.amount ?? igaAsset['amount']) : 0
        setIgaBalance(Number(igaAmount))
      } catch (error) {
        console.error('Failed to fetch balances:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBalances()
    
    // Refresh balances every 30 seconds
    const interval = setInterval(fetchBalances, 30000)
    return () => clearInterval(interval)
  }, [activeAccount?.address])

  if (!activeAccount) {
    return null
  }

  const memberTier = getMemberTier(igaBalance)

  return (
    <div className="member-status">
      <div className="member-tier" style={{ '--tier-color': memberTier.color } as React.CSSProperties}>
        <span className="tier-label">STATUS</span>
        <span className="tier-value">{loading ? '...' : memberTier.tier}</span>
      </div>
      <div className="balances-stack">
        <div className="balance-item iga-balance">
          <span className="balance-label">$iGA</span>
          <span className="balance-value">{loading ? '...' : formatBalance(igaBalance, 6)}</span>
        </div>
        <div className="balance-item algo-balance">
          <span className="balance-label">$ALGO</span>
          <span className="balance-value">{loading ? '...' : formatBalance(algoBalance, 6)}</span>
        </div>
      </div>
    </div>
  )
}

export default MemberStatus
