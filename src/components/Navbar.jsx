import { useState } from 'react'
import logo from '../assets/Logo/vidya-sagar-logo.jpg'

function Navbar() {
  const [activeLink, setActiveLink] = useState('Home')
  const [menuOpen, setMenuOpen] = useState(false)

  const scrollToSection = (sectionId, linkName) => {
    setActiveLink(linkName)
    setMenuOpen(false)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header>
      <nav className="nav">
        <div className="nav__inner">
          <a 
            href="#" 
            className="nav__logo" 
            onClick={(e) => { 
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
              setActiveLink('Home')
              setMenuOpen(false)
            }}
          >
            <div className="nav__logo-img">
              <img src={logo} alt="Vidya Sagar Logo" />
            </div>
            <span className="nav__logo-text">VIDYA SAGAR</span>
          </a>

          {/* Hamburger Button */}
          <button 
            className={`nav__hamburger ${menuOpen ? 'nav__hamburger--open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* Navigation Links */}
          <div className={`nav__links ${menuOpen ? 'nav__links--open' : ''}`}>
            <a 
              href="#" 
              className={`nav__link ${activeLink === 'Home' ? 'nav__link--active' : ''}`}
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); setActiveLink('Home'); setMenuOpen(false) }}
            >
              Home
            </a>
            <a 
              href="#eventsSection" 
              className={`nav__link ${activeLink === 'Events' ? 'nav__link--active' : ''}`}
              onClick={(e) => { e.preventDefault(); scrollToSection('eventsSection', 'Events') }}
            >
              Events
            </a>
            <a 
              href="#admissionsSection" 
              className={`nav__link ${activeLink === 'Admissions' ? 'nav__link--active' : ''}`}
              onClick={(e) => { e.preventDefault(); scrollToSection('admissionsSection', 'Admissions') }}
            >
              Admissions
            </a>
            <a 
              href="#locationSection" 
              className={`nav__link ${activeLink === 'Contact' ? 'nav__link--active' : ''}`}
              onClick={(e) => { e.preventDefault(); scrollToSection('locationSection', 'Contact') }}
            >
              Contact
            </a>
          </div>

          <button 
            className="nav__cta" 
            onClick={() => scrollToSection('admissionsSection', 'Admissions')}
          >
            Explore Programs
          </button>
        </div>
      </nav>
    </header>
  )
}

export default Navbar