import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/Logo/logo.png'

function Navbar() {
  const [activeLink, setActiveLink] = useState('Home')
  const [menuOpen, setMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth > 768 && window.scrollY > 100) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId, linkName) => {
    setActiveLink(linkName)
    setMenuOpen(false)

    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const goToPage = (path, linkName) => {
    setActiveLink(linkName)
    setMenuOpen(false)
    navigate(path)
  }

  return (
    <header>
      <nav className={`nav ${isScrolled ? 'nav--scrolled' : ''}`}>
        <div className="nav__inner">

          {/* Logo */}
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
              <img src={logo} alt="Logo" />
            </div>

            <div className="nav__logo-content">
              <h1 className="nav__logo-nepali">विद्या सागर</h1>
              <h2 className="nav__logo-english">
                <span className="blue">VIDHYA</span>
                <span className="orange"> SAGAR</span>
              </h2>
            </div>
          </a>

          {/* Hamburger */}
          <button
            className={`nav__hamburger ${menuOpen ? 'nav__hamburger--open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* Links */}
          <div className={`nav__links ${menuOpen ? 'nav__links--open' : ''}`}>

            <a
              href="#"
              className={`nav__link ${activeLink === 'Home' ? 'nav__link--active' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                window.scrollTo({ top: 0, behavior: 'smooth' })
                setActiveLink('Home')
                setMenuOpen(false)
              }}
            >
              Home
            </a>

            <a
              href="#aboutSection"
              className={`nav__link ${activeLink === 'About Us' ? 'nav__link--active' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                scrollToSection('aboutSection', 'About Us')
              }}
            >
              About Us
            </a>

            <a
              href="/gallery"
              className={`nav__link ${activeLink === 'Gallery,' ? 'nav__link--active' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                 goToPage('/gallery', 'Gallery')
              }}
            >
              Events
            </a>

            <a
              href="/notices"
              className={`nav__link ${activeLink === 'Notice' ? 'nav__link--active' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                goToPage('/notices', 'Notice')
              }}
            >
              Notice
            </a>

            <a
              href="#location"
              className={`nav__link ${activeLink === '' ? 'nav__link--active' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                scrollToSection('contactSection', 'Contact Us')
              }}
            >
              Contact Us
            </a>

          </div>

          {/* CTA */}
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