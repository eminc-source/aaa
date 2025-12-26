import WalletConnect from '../WalletConnect/WalletConnect'
import MemberStatus from '../MemberStatus/MemberStatus'
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
      <div className="header-actions">
        <MemberStatus />
        <WalletConnect />
      </div>
    </header>
  )
}

export default Header
