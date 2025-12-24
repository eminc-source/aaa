import { NavLink } from 'react-router-dom'
import './Header.css'

const Header = () => {
  return (
    <header className="main-header">
      <div className="logo-container">
        <h1 className="logo">
          <span className="logo-letter">A</span>
          <span className="logo-letter">A</span>
          <span className="logo-letter">A</span>
        </h1>
        <p className="tagline">ALGO ACCOUNT ABILITY</p>
      </div>
      <nav className="main-nav">
        <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          DASHBOARD
        </NavLink>
      </nav>
    </header>
  )
}

export default Header
