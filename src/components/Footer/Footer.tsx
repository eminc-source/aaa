import './Footer.css'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="main-footer">
      <div className="footer-content">
        <span className="footer-text">ALGO ACCOUNT ABILITY © {currentYear}</span>
        <span className="footer-divider">|</span>
        <span className="footer-text">TRANSPARENCY IN DATA</span>
      </div>
      <div className="footer-decoration" />
    </footer>
  )
}

export default Footer
