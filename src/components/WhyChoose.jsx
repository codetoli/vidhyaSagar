const features = [
  {
    icon: 'school',
    colorClass: 'feature-card__icon--indigo',
    iconColor: 'icon-color--indigo',
    title: 'Academic Excellence',
    body: 'Consistently ranking among top institutions with 100% board results and competitive success.',
    delay: '80ms'
  },
  {
    icon: 'psychology',
    colorClass: 'feature-card__icon--mauve',
    iconColor: 'icon-color--mauve',
    title: 'Holistic Growth',
    body: 'Focusing on emotional intelligence, character building, and creative arts beyond textbooks.',
    delay: '160ms'
  },
  {
    icon: 'apartment',
    colorClass: 'feature-card__icon--navy',
    iconColor: 'icon-color--navy',
    title: 'Modern Facilities',
    body: 'Smart classrooms, advanced labs, and expansive sports complexes designed for modern learners.',
    delay: '240ms'
  },
  {
    icon: 'groups',
    colorClass: 'feature-card__icon--soft',
    iconColor: 'icon-color--soft',
    title: 'Expert Faculty',
    body: 'Mentors with decades of experience dedicated to personalized student guidance and success.',
    delay: '320ms'
  }
]

function WhyChoose() {
  return (
    <section className="why section-pad">
      <div className="why__bg-blob why__bg-blob--1"></div>
      <div className="why__bg-blob why__bg-blob--2"></div>

      <div className="container">
        <div className="why__header reveal">
          <span className="section-label">Our Foundation</span>
          <h2 className="section-title glow-text">Why Choose Vidhya Sagar?</h2>
        </div>

        <div className="cards-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card reveal" style={{ transitionDelay: feature.delay }}>
              <div className={`feature-card__icon ${feature.colorClass}`}>
                <span className={`material-symbols-outlined ${feature.iconColor}`}>
                  {feature.icon}
                </span>
              </div>
              <h3 className="feature-card__title">{feature.title}</h3>
              <p className="feature-card__body">{feature.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyChoose