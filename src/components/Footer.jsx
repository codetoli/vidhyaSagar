import React from "react";

import logo from "../assets/Logo/logo.png";
import playStore from "../assets/Gallery/playstore.png";
import appStore from "../assets/Gallery/appstore.png";

import facebookIcon from "../assets/Social/facebook.svg";
import tiktokIcon from "../assets/Social/tiktok.svg";
import whatsappIcon from "../assets/Social/whatsapp.svg";
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
function Footer() {
  const currentYear = new Date().getFullYear();

const whatsappNumber = "9779841929890"; 
const whatsappMessage = encodeURIComponent("Hi, I'd like to know more about Vidhya Sagar School.");
const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

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
    <footer className="footer">
      {/* Floating Logo */}
      <div className="footer__logo-wrapper">
        <div className="footer__logo-circle">
          <img src={logo} alt="Vidhya Sagar School" />
        </div>
      </div>

      <div className="container">
        <div className="footer__grid">

          {/* Column 1 - School Info */}
          <div className="footer__info-column">
            <span className="footer__brand-name">Vidhya Sagar School</span>

            <ul className="footer__contact-list">
              <li>
                <span className="material-symbols-outlined">location_on</span>
                <span><a href="#contact"> Punyashow Mahadev Marga, Banepa Bazar, Nepal</a></span>
              </li>
              <li>
                <span className="material-symbols-outlined">call</span>
                <a href="tel:011663555">011-663555</a>
              </li>
              <li>
                <span className="material-symbols-outlined">mail</span>
                <a href="mailto:info@vidhyasagar.edu.np">info@vidhyasagar.edu.np</a>
              </li>
            </ul>
          </div>

          {/* Column 2 - Quick Links */}
          <div className="footer__links-column">
            <h3 className="footer__col-title">Quick Links</h3>

            <div className="footer__quick-links">
              <ul className="footer__list">
                <li><a href="/">Home</a></li>
                <li><a href="/admission">Programs</a></li>
                <li><a href="/notices">Notice</a></li>
                <li> <a
           
             href="#contact"
              className={`nav__link ${activeLink === '' ? 'nav__link--active' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                scrollToSection('contact', 'C')
                
                
              }}
            >
              Contact Us
            </a></li>
              </ul>

              <ul className="footer__list">
                <li><a href="/about">About Us</a></li>
                <li><a href="/gallery">Gallery</a></li>
                <li><a
           
             href="#admissionsSection"
              className={`nav__link ${activeLink === '' ? 'nav__link--active' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                scrollToSection('admissionsSection', 'A')
                
                
              }}
            >Admission</a></li>
              </ul>
            </div>
          </div>

          {/* Column 3 - Download App */}
          <div className="footer__app-column">
            <h3 className="footer__col-title">Download App</h3>
            <p className="footer-app__text">Get our mobile application</p>

            <div className="footer-app__buttons">
              <a href="https://play.google.com/store/apps/details?id=com.vidhyasagar.nivid&hl=en" className="store-btn" aria-label="Google Play">
                <img src={playStore} alt="Get it on Google Play" />
              </a>
              <a href="https://apps.apple.com/us/app/vidhya-sagar-banepa/id1464638579" className="store-btn" aria-label="App Store">
                <img src={appStore} alt="Download on the App Store" />
              </a>
            </div>
          </div>

          {/* Column 4 - Follow Us */}
          <div className="footer__social-column">
            <h3 className="footer__col-title">Follow Us</h3>

            <div className="footer__socials">
              <a href="https://www.facebook.com/vsbanepa/" className="social-link" aria-label="Facebook">
                <img src={facebookIcon} alt="Facebook" />
              </a>
              <a href="" className="social-link" aria-label="TikTok">
                <img src={tiktokIcon} alt="TikTok" />
              </a>
             <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="WhatsApp">
          <img src={whatsappIcon} alt="WhatsApp" />
        </a>
            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="footer__bottom">
          <p>©️ {currentYear} Vidhya Sagar School. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;