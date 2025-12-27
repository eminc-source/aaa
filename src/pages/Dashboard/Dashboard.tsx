import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWallet } from '@txnlab/use-wallet-react'
import OrganizationCard from '../../components/OrganizationCard/OrganizationCard'
import MusicPlayer from '../../components/MusicPlayer/MusicPlayer'
import { OrganizationData } from '../../types'
import { getTotalDataSeriesCount } from '../../data/chartDataSources'
import './Dashboard.css'

const Dashboard = () => {
  const [currentDate, setCurrentDate] = useState('')
  const [showWalletPrompt, setShowWalletPrompt] = useState(false)
  const navigate = useNavigate()
  const { wallets } = useWallet()

  // Get actual datasets count
  const datasetsCount = getTotalDataSeriesCount();

  // Organization data - will be dynamic in the future
  const foundationData: OrganizationData = {
    type: 'foundation',
    name: 'ALGORAND FOUNDATION',
    reports: 18,
    datasets: datasetsCount,
    latestReport: 'Oct 2025',
    status: 'online'
  }

  const technologiesData: OrganizationData = {
    type: 'technologies',
    name: 'ALGORAND TECHNOLOGIES',
    subtitle: '',
    reports: 7,
    datasets: 0,
    latestReport: 'Jul 2021',
    status: 'online'
  }

  useEffect(() => {
    const updateDate = () => {
      const now = new Date()
      const formatted = now.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: '2-digit',
        year: 'numeric'
      }).toUpperCase() + ' :: ' + 
      now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })
      setCurrentDate(formatted)
    }

    updateDate()
    const interval = setInterval(updateDate, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleAccessData = (org: 'foundation' | 'technologies') => {
    if (org === 'foundation') {
      navigate('/foundation')
    } else {
      navigate('/technologies')
    }
  }

  const handleConnectWallet = () => {
    setShowWalletPrompt(true)
  }

  const handleWalletSelect = async (walletId: string) => {
    console.log('Attempting to connect wallet:', walletId)
    console.log('Available wallets:', wallets.map(w => ({ id: w.id, name: w.metadata.name })))
    const wallet = wallets.find(w => w.id === walletId)
    console.log('Found wallet:', wallet?.id, wallet?.metadata.name)
    if (wallet) {
      // Close our modal immediately so the wallet's QR modal is visible
      setShowWalletPrompt(false)
      try {
        console.log('Calling wallet.connect()...')
        await wallet.connect()
        console.log('Wallet connected successfully!')
      } catch (error) {
        console.error('Failed to connect wallet:', error)
      }
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2 className="section-title">
          <span className="title-decoration">◆</span>
          TRANSPARENCY DASHBOARD
          <span className="title-decoration">◆</span>
        </h2>
        <div className="date-display">
          <span className="date-label">SYSTEM DATE:</span>
          <span className="date-value">{currentDate}</span>
        </div>
      </div>

      <div className="dashboard-grid">
        <OrganizationCard 
          data={foundationData} 
          onAccessData={() => handleAccessData('foundation')}
          onConnectWallet={handleConnectWallet}
        />
        <OrganizationCard 
          data={technologiesData} 
          onAccessData={() => handleAccessData('technologies')}
          onConnectWallet={handleConnectWallet}
        />
      </div>

      {showWalletPrompt && (
        <div className="wallet-modal-overlay" onClick={() => setShowWalletPrompt(false)}>
          <div className="wallet-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">CONNECT TO ACCESS</h2>
              <button className="modal-close" onClick={() => setShowWalletPrompt(false)}>✕</button>
            </div>
            <p className="modal-message">Connect your Algorand wallet to access the data.</p>
            <div className="wallet-list">
              {wallets.map((wallet) => (
                <button
                  key={wallet.id}
                  className="wallet-option"
                  onClick={() => handleWalletSelect(wallet.id)}
                >
                  <span className="wallet-name">{wallet.metadata.name.toUpperCase()}</span>
                  <span className="wallet-arrow">▶</span>
                </button>
              ))}
            </div>
            <div className="wallet-help">
              <p>Don't have a wallet? Create an Algorand Wallet at:</p>
              <a href="https://www.igetalgo.com/algorand/ecosystem" target="_blank" rel="noopener noreferrer" className="wallet-help-link">
                iGetAlgo.com
              </a>
            </div>
          </div>
        </div>
      )}

      <MusicPlayer />
    </div>
  )
}

export default Dashboard
