import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'

import Navbar from './components/Navbar'
import Hero from './components/Hero'
import WhyChoose from './components/WhyChoose'
import Events from './components/Events'
import Principal from './components/Principal'
import Notices from './components/Notices'
import NoticesHome from './components/NoticesHome'
import Location from './components/Location'
import Admissions from './components/Admissions'
import Gallery from './components/Gallery'
import About from './components/About'
import Footer from './components/Footer'
import AdminPanel from './pages/AdminPanel'
import AdminLogin from './pages/AdminLogin'
import ProtectedRoute from './components/admin/ProtectedRoute'
import Banner from './components/Banner'

/* ── Scroll-reveal observer ── */
function RevealObserver() {
  const location = useLocation()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('active')
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    const timeoutId = setTimeout(() => {
      const els = document.querySelectorAll('.reveal')
      els.forEach((el) => observer.observe(el))
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      observer.disconnect()
    }
  }, [location.pathname])

  return null
}

/* ── Public layout: Navbar + page content + Footer ── */
function PublicLayout() {
  const [showPopup, setShowPopup] = useState(false)
  const location = useLocation()

  // Triggers the popup timer every time the public route changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true)
    }, 800) // slight delay

    return () => clearTimeout(timer)
  }, [location.pathname])

  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <WhyChoose />
                <Events />
                <Principal />
                <NoticesHome />
                <Location />
                <Admissions />
              </>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/notices" element={<Notices />} />
          <Route path="/admission" element={<Admissions />}/>
          
        </Routes>
        {showPopup && <Banner onClose={() => setShowPopup(false)} />}
      </main>
      <Footer />
    </>
  )
}

/* ── Root: decides which layout to render ── */
function AppRoutes() {
  return (
    <>
      <RevealObserver />
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        <Route path="/*" element={<PublicLayout />} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  )
}

export default App