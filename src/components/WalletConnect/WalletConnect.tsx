import { useWallet } from '@txnlab/use-wallet-react'
import { useState } from 'react'
import './WalletConnect.css'

const WalletConnect = () => {
  const { wallets, activeWallet, activeAccount } = useWallet()
  const [showModal, setShowModal] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async (walletId: string) => {
    const wallet = wallets.find(w => w.id === walletId)
    if (wallet) {
      setIsConnecting(true)
      try {
        await wallet.connect()
        setShowModal(false)
      } catch (error) {
        console.error('Failed to connect wallet:', error)
      } finally {
        setIsConnecting(false)
      }
    }
  }

  const handleDisconnect = async () => {
    if (activeWallet) {
      await activeWallet.disconnect()
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // If connected, show address and disconnect button
  if (activeAccount) {
    return (
      <div className="wallet-connected">
        <div className="wallet-boxes">
          <div className="wallet-address-box">
            <span className="wallet-label">CONNECTED</span>
            <span className="wallet-address">{formatAddress(activeAccount.address)}</span>
          </div>
          <button className="disconnect-btn" onClick={handleDisconnect}>
            DISCONNECT
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <button className="connect-wallet-btn" onClick={() => setShowModal(true)}>
        <span className="wallet-icon">⬡</span>
        CONNECT WALLET
      </button>

      {showModal && (
        <div className="wallet-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="wallet-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">SELECT WALLET</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            
            <div className="wallet-list">
              {wallets.map((wallet) => (
                <button
                  key={wallet.id}
                  className="wallet-option"
                  onClick={() => handleConnect(wallet.id)}
                  disabled={isConnecting}
                >
                  <span className="wallet-name">{wallet.metadata.name.toUpperCase()}</span>
                  <span className="wallet-arrow">▶</span>
                </button>
              ))}
            </div>

            {isConnecting && (
              <div className="connecting-status">
                <span className="connecting-text">CONNECTING</span>
                <span className="connecting-dots">...</span>
              </div>
            )}

            <div className="wallet-help">
              <p>Don't have a wallet? Create an Algorand Wallet at:</p>
              <a href="https://www.igetalgo.com/algorand/ecosystem" target="_blank" rel="noopener noreferrer" className="wallet-help-link">
                iGetAlgo.com
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default WalletConnect
