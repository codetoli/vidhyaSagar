function Footer() {
  return (
    <footer className="footer">
      <div className="footer__blob footer__blob--1"></div>
      <div className="footer__blob footer__blob--2"></div>

      <div className="container">
        <div className="footer__grid">
          <div>
            <span className="footer__brand-name">Vidhya Sagar School</span>
            <p className="footer__tagline">
              Nurturing excellence through innovative learning and traditional values since 1995.
              Committed to building the leaders of tomorrow.
            </p>
            <div className="footer__socials">
              <button className="social-btn social-btn--primary" aria-label="Website">
                <span className="material-symbols-outlined">public</span>
              </button>
              <button className="social-btn social-btn--mauve" aria-label="Share">
                <span className="material-symbols-outlined">share</span>
              </button>
            </div>
          </div>

          <div>
            <h4 className="footer__col-title">Our Locations</h4>
            <ul className="footer__list">
              <li>Banepa, Kavreplanchowk</li>
            </ul>
          </div>

          <div>
            <h4 className="footer__col-title">Quick Navigation</h4>
            <ul className="footer__list">
              <li>Academic Calendar</li>
              <li>School Uniform</li>
              <li>Fee Structure</li>
              <li>Career Opportunities</li>
            </ul>
          </div>

          <div className="footer-app">
            <h4 className="footer__col-title">Mobile Experience</h4>
            <p className="footer-app__text">
              Download our student & parent portal app for attendance, notices, results and updates in real time.
            </p>
            <div className="footer-app__buttons">
              <a href="#" className="store-btn store-btn--apple" onClick={(e) => e.preventDefault()}>
                <span className="material-symbols-outlined">phone_iphone</span>
                <div>
                  <small>Download on the</small>
                  <strong>App Store</strong>
                </div>
              </a>
              <a href="#" className="store-btn store-btn--google" onClick={(e) => e.preventDefault()}>
                <span className="material-symbols-outlined">android</span>
                <div>
                  <small>Get it on</small>
                  <strong>Google Play</strong>
                </div>
              </a>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© 2026 Vidhya Sagar School. All rights reserved.</p>
          <div className="footer__bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer