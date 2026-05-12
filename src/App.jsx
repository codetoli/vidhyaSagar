import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import WhyChoose from './components/WhyChoose'
import Events from './components/Events'
import Principal from './components/Principal'
import Notices from './components/Notices'
import Location from './components/Location'
import Admissions from './components/Admissions'
import Footer from './components/Footer'

function App() {
  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )
    
    const revealElements = document.querySelectorAll('.reveal')
    revealElements.forEach((el) => revealObserver.observe(el))
    
    return () => {
      revealElements.forEach((el) => revealObserver.unobserve(el))
    }
  }, [])

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <WhyChoose />
        <Events />
        <Principal />
        <Notices />
        <Location />
        <Admissions />
      </main>
      <Footer />
    </>
  )
}

export default App