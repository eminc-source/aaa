import WalletConnect from '../WalletConnect/WalletConnect'
import MemberStatus from '../MemberStatus/MemberStatus'
import './Header.css'

const Header = () => {
  return (
    <header className="main-header">
      <div className="logo-container">
        <img src="/logo.png" alt="Algo Account Ability Logo" className="logo-image" />
      </div>
      <div className="header-actions">
        <MemberStatus />
        <WalletConnect />
      </div>
    </header>
  )
}

export default Header
