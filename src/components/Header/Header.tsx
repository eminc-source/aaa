import WalletConnect from '../WalletConnect/WalletConnect'
import MemberStatus from '../MemberStatus/MemberStatus'
import './Header.css'

const Header = () => {
  return (
    <header className="main-header">
      <div className="logo-container">
        <img src="/logo.png" alt="Algo Account Ability Logo" className="logo-image" />
      </div>
      <div className="page-title-container">
        <h1 className="page-title">ALGO ACCOUNT ABILITY</h1>
      </div>
      <div className="header-actions">
        <div className="header-wallet">
          <MemberStatus />
          <WalletConnect />
        </div>
      </div>
    </header>
  )
}

export default Header
