import { OrganizationData } from '../../types'
import './OrganizationCard.css'

interface OrganizationCardProps {
  data: OrganizationData
  onAccessData?: () => void
}

const OrganizationCard = ({ data, onAccessData }: OrganizationCardProps) => {
  const { type, name, subtitle, reports, datasets, latestReport, status } = data
  const sectionClass = type === 'foundation' ? 'foundation-section' : 'technologies-section'

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
        
        <button className="retro-btn" onClick={onAccessData}>
          <span className="btn-text">ACCESS DATA</span>
          <span className="btn-icon">▶</span>
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
