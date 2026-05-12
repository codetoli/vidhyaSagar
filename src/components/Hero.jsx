import hero1 from '../assets/Gallery/hero1.jpg'
import hero2 from '../assets/Gallery/hero2.jpg'
import hero3 from '../assets/Gallery/hero3.jpg'

function Hero() {
  const scrollTo = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
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
            <button className="btn-secondary" onClick={() => scrollTo('locationSection')}>
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