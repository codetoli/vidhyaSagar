import { useRef } from 'react'
import cultureFest from '../assets/Gallery/culturefest.jpg'
import scienceExpo from '../assets/Gallery/science-expo.jpg'
import sportWeek from '../assets/Gallery/sport-week.jpg'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Gallery from  "./Gallery.jsx"

const events = [
  {
    img: cultureFest,
    date: 'OCT 25',
    dateClass: 'date--indigo',
    title: 'Annual Cultural Fest 2025',
    location: 'Main Auditorium'
  },
  {
    img: scienceExpo,
    date: 'NOV 12',
    dateClass: 'date--navy',
    title: 'Inter-School Science Expo',
    location: 'Innovation Lab'
  },
  {
    img: sportWeek,
    date: 'DEC 05',
    dateClass: 'date--mauve',
    title: 'Annual Sports Meet',
    location: 'Athletic Stadium'
  }
]

function Events() {
  const sliderRef = useRef(null)
const [activeLink, setActiveLink] = useState('Home')
  const [menuOpen, setMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const navigate = useNavigate()
  const scroll = (direction) => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: direction === 'prev' ? -430 : 430,
        behavior: 'smooth'
      })
    }
  }

  const goToPage = (path, linkName) => {
    setActiveLink(linkName)
    setMenuOpen(false)
    navigate(path)
  }


  return (
    <section id="eventsSection" className="events section-pad">
      <div className="events__bg"></div>
      <div className="events__blob events__blob--1"></div>
      <div className="events__blob events__blob--2"></div>

      <div className="container">
        <div className="events__header reveal">
          <div>
            <span className="section-label">Get Involved</span>
            <h2 className="section-title glow-text">Campus Events</h2>
          </div>
          <div className="events__controls">
            <button className="slider-btn" onClick={() => scroll('prev')} aria-label="Previous events">
              <span className="material-symbols-outlined">west</span>
            </button>
            <button className="slider-btn" onClick={() => scroll('next')} aria-label="Next events">
              <span className="material-symbols-outlined">east</span>
            </button>
          </div>
        </div>

        <div ref={sliderRef} className="events__slider reveal" style={{ transitionDelay: '150ms' }}>
          {events.map((event, index) => (
            <article key={index} className="event-card">
              <div className="event-card__img">
                <img src={event.img} alt={event.title} />
                <div className="event-card__overlay"></div>
                <span className={`event-card__date ${event.dateClass}`}>{event.date}</span>
              </div>
              <div className="event-card__body">
                <h4 className="event-card__title">{event.title}</h4>
                <p className="event-card__location">
                  <span className="material-symbols-outlined">location_on</span> {event.location}
                </p>
                <a href="gallery" className="event-card__link" onClick={(e) => {
                e.preventDefault()
                 goToPage('/gallery', 'Gallery')
              }}>
                  READ MORE <span className="material-symbols-outlined">arrow_forward</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Events