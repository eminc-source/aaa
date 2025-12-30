import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import OrganizationCard from '../../components/OrganizationCard/OrganizationCard'
import MusicPlayer from '../../components/MusicPlayer/MusicPlayer'
import SEO from '../../components/SEO/SEO'
import { OrganizationData } from '../../types'
import { getTotalDataSeriesCount } from '../../data/chartDataSources'
import { getTechTotalDataSeriesCount } from '../../data/techChartDataSources'
import './Dashboard.css'

const Dashboard = () => {
  const [currentDate, setCurrentDate] = useState('')
  const navigate = useNavigate()

  // Get actual datasets count
  const foundationDatasetsCount = getTotalDataSeriesCount();
  const techDatasetsCount = getTechTotalDataSeriesCount();

  // Organization data - will be dynamic in the future
  const foundationData: OrganizationData = {
    type: 'foundation',
    name: 'ALGORAND FOUNDATION',
    reports: 18,
    datasets: foundationDatasetsCount,
    latestReport: 'Oct 2025',
    status: 'online'
  }

  const technologiesData: OrganizationData = {
    type: 'technologies',
    name: 'ALGORAND TECHNOLOGIES',
    subtitle: '',
    reports: 7,
    datasets: techDatasetsCount,
    latestReport: 'Jun 2022',
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

  return (
    <div className="dashboard">
      <SEO
        title="Dashboard"
        description="Algo Account Ability - Track Algorand Foundation and Technologies ALGO distributions, transparency reports, and forensic analysis."
        path="/"
      />
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
        />
        <OrganizationCard
          data={technologiesData}
          onAccessData={() => handleAccessData('technologies')}
        />
      </div>

      <MusicPlayer />
    </div>
  )
}

export default Dashboard
