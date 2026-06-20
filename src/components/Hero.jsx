import hero1 from '../assets/Gallery/hero1.jpg'
import hero2 from '../assets/Gallery/hero2.jpg'
import hero3 from '../assets/Gallery/hero3.jpg'
import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

function Hero() {
    const location = useLocation()
  const navigate = useNavigate()
const [activeLink, setActiveLink] = useState('Home')
const [menuOpen, setMenuOpen] = useState(false)
  const scrollTo = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
  if (location.state?.scrollTo) {
    const target = location.state.scrollTo
    // wait for next paint, then check element exists before scrolling
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = document.getElementById(target)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
        navigate('.', { replace: true, state: {} })
      })
    })
  }
}, [location.state])

const goToPage = (path, linkName) => {
    setActiveLink(linkName)
    setMenuOpen(false)
    navigate(path)
  }

  return (
    <section className="hero">
      <div className="hero__bg"></div>
      <div className="hero__bg-blob hero__bg-blob--1"></div>
      <div className="hero__bg-blob hero__bg-blob--2"></div>

      <div className="hero__grid">
        <div className="reveal">
          <span className="hero__badge">Education Redefined</span>
          <h1 className="hero__title glow-text">
            Empowering Excellence,<br />Nurturing Dreams
          </h1>
          <p className="hero__subtitle">
            Providing a world-class education rooted in heritage and driven by
            future-ready innovation for the leaders of tomorrow.
          </p>
          <div className="hero__cta-group">
            <button className="btn-primary" onClick={() => scrollTo('admissionsSection')}>
              Explore Programs
            </button>
            <button className="btn-secondary" onClick={() => goToPage('/about')}>
              Our Campus
            </button>
          </div>
        </div>

        <div className="hero__gallery reveal" style={{ transitionDelay: '180ms' }}>
  <div className="hero__gallery-grid">
  <div className="hero__gallery-side">
    <div className="hero__img hero__img--top">
      <img src={hero3} alt="Students" />
    </div>
    <div className="hero__img hero__img--bottom">
      <img src={hero2} alt="Activities" />
    </div>
  </div>
  <div className="hero__img hero__img--main">
    <img src={hero1} alt="Campus" />
  </div>
</div>

  <div className="hero__stat pulse-ring">
    <span className="hero__stat-num">25+</span>
    <span className="hero__stat-label">Years of Academic Legacy</span>
  </div>
</div>
      </div>
    </section>
  )
}

export default Hero