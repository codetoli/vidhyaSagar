import principalPic from '../assets/Gallery/principalpic.jpg'

function Principal() {
  return (
    <section className="principal section-pad">
      <div className="principal__bg"></div>

      <div className="container">
        <div className="principal__grid">
          <div className="principal__img-wrap reveal">
            <div className="principal__img-frame">
              <img src={principalPic} alt="Principal" />
            </div>
            <div className="principal__quote-badge">
              <span className="principal__quote-icon">"</span>
              <p className="principal__quote-text">Leading with a vision that empowers every mind.</p>
            </div>
          </div>

          <div className="reveal" style={{ transitionDelay: '200ms' }}>
            <span className="section-label">Leadership Welcome</span>
            <h2 className="section-title glow-text" style={{ marginTop: '0.75rem', marginBottom: '1.5rem' }}>
              Principal&apos;s Welcome
            </h2>
            <p className="principal__body">
              At Vidhya Sagar School, we believe that education is not just the filling of a pail, but
              the lighting of a fire. Our mission is to provide an environment where curiosity is nurtured,
              character is built, and every student is empowered to achieve their highest potential.
            </p>
            <p className="principal__body">
              We integrate traditional values with modern pedagogical techniques to ensure our students
              are well-prepared for the challenges of the 21st century.
            </p>
            <div className="principal__sig">
              <div className="principal__sig-line"></div>
              <div>
                <h4 className="principal__sig-name">Hira Sharma</h4>
                <p className="principal__sig-role">Principal, Vidhya Sagar School</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Principal