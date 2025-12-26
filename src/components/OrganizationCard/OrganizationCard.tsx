import { useWallet } from '@txnlab/use-wallet-react'
import { OrganizationData } from '../../types'
import './OrganizationCard.css'

interface OrganizationCardProps {
  data: OrganizationData
  onAccessData?: () => void
  onConnectWallet?: () => void
}

const OrganizationCard = ({ data, onAccessData, onConnectWallet }: OrganizationCardProps) => {
  const { activeAccount } = useWallet()
  const { type, name, subtitle, reports, datasets, latestReport, status } = data
  const sectionClass = type === 'foundation' ? 'foundation-section' : 'technologies-section'
  const isConnected = !!activeAccount

  const handleButtonClick = () => {
    if (isConnected) {
      onAccessData?.()
    } else {
      onConnectWallet?.()
    }
  }

  return (
    <section className={`org-section ${sectionClass}`}>
      <div className="section-header">
        <div className="header-bar" />
        <h3 className="org-title">{name}</h3>
        <div className="header-bar" />
      </div>
      
      {subtitle && (
        <div className="section-subheader">
          <span className="fka-label">{subtitle}</span>
        </div>
      )}
      
      <div className="section-content">
        <div className="status-indicator">
          <span className={`status-dot ${status === 'online' ? 'active' : ''}`} />
          <span className="status-text">
            {status.toUpperCase()}
          </span>
        </div>
        
        <div className="data-preview">
          <div className="data-card">
            <span className="card-label">REPORTS</span>
            <span className="card-value">{reports > 0 ? reports : '--'}</span>
          </div>
          <div className="data-card">
            <span className="card-label">DATASETS</span>
            <span className="card-value">{datasets > 0 ? datasets : '--'}</span>
          </div>
          <div className="data-card">
            <span className="card-label">LATEST</span>
            <span className="card-value">{latestReport || '--'}</span>
          </div>
        </div>
        
        <button 
          className={`retro-btn ${!isConnected ? 'requires-wallet' : ''}`} 
          onClick={handleButtonClick}
        >
          <span className="btn-text">
            {isConnected ? 'ACCESS DATA' : 'CONNECT WALLET'}
          </span>
          <span className="btn-icon">{isConnected ? '▶' : '⬡'}</span>
        </button>
      </div>
      
      <div className="corner-decoration top-left" />
      <div className="corner-decoration top-right" />
      <div className="corner-decoration bottom-left" />
      <div className="corner-decoration bottom-right" />
    </section>
  )
}

export default OrganizationCard
