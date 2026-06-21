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

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const scrollToSection = (sectionId, linkName) => {
  setActiveLink(linkName)
  setMenuOpen(false)

  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  } else {
    navigate('/', { state: { scrollTo: sectionId } })
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
            className="nav__logo"
            onClick={(e) => {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
              setActiveLink('Home')
              setMenuOpen(false)
               goToPage("/")
            }}
          >
            <div className="nav__logo-img">
              <img src={logo} alt="Logo" />
            </div>

            <div className="nav__logo-content">
              <h1 className="nav__logo-nepali">विद्या सागर</h1>
              
 <div style={{
            height: '3px',
            width:'30%',
minWidth:'100px',
maxWidth:'180px',
            background: '#1e3a8a',
            borderRadius: '9999px',
          }} />
      

              <h2 className="nav__logo-english">
                <span className="blue">VIDHYA</span>
                <span className="blue"> SAGAR</span>
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
            
              className={`nav__link ${activeLink === 'Home' ? 'nav__link--active' : ''}`}
  onClick={(e) => {
    e.preventDefault()
    setActiveLink('Home')
    setMenuOpen(false)
    if (window.location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      goToPage("/")

    }
  }}
>
  Home
            </a>

            <a
              className={`nav__link ${activeLink === 'About Us' ? 'nav__link--active' : ''}`}
              onClick={(e) => {
                e.preventDefault()
              
                goToPage("/about")
              }}
            >
              About Us
            </a>

            <a
             
              className={`nav__link ${activeLink === 'Gallery,' ? 'nav__link--active' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                 goToPage('/gallery', 'Gallery')
              }}
            >
              Events
            </a>

            <a
             
              className={`nav__link ${activeLink === 'Notice' ? 'nav__link--active' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                goToPage('/notices', 'Notice')
              }}
            >
              Notice
            </a>

            <a
           
             href="#contact"
              className={`nav__link ${activeLink === '' ? 'nav__link--active' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                scrollToSection('contact', 'C')
                
                
              }}
            >
              Contact Us
            </a>

          </div>

          {/* CTA */}
          <button
            className="nav__cta"
            onClick={(e) => {
                e.preventDefault()
                goToPage('/admission', 'Admissions')}}
          >
            Explore Programs
          </button>

        </div>
      </nav>
    </header>
  )
}

export default Navbar