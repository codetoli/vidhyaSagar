function Location() {
  return (
    <section id="locationSection" className="location section-pad">
      <div className="location__bg"></div>

      <div className="container">
        <div className="location__grid">
          <div className="reveal">
            <span className="section-label">Contact Us</span>
            <h2 className="section-title glow-text" style={{ marginTop: '0.75rem', marginBottom: '2.5rem' }}>
              Visit Our Modern Campus
            </h2>

            <div className="contact-item">
              <div className="contact-item__icon contact-item__icon--purple">
                <span className="material-symbols-outlined">location_on</span>
              </div>
              <div>
                <p className="contact-item__label">Campus Address</p>
                <p className="contact-item__value">
                  Vidhya Sagar English boarding school<br />Banepa, kavreplanchowk
                </p>
              </div>
            </div>

            {/* New Email Address */}
            <div className="contact-item">
              <div className="contact-item__icon contact-item__icon--purple">
                <span className="material-symbols-outlined">email</span>
              </div>
              <div>
                <p className="contact-item__label">Email Address</p>
                <p className="contact-item__value">
                  info@vidhyasagarschool.edu.np
                </p>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-item__icon contact-item__icon--navy">
                <span className="material-symbols-outlined">call</span>
              </div>
              <div>
                <p className="contact-item__label">Phone Inquiry</p>
                <p className="contact-item__value">+977 XXX XXX XXX</p>
              </div>
            </div>

            <button className="btn-primary" style={{ marginTop: '2.5rem' }}>
              Get Directions
            </button>
          </div>

          <div className="reveal" style={{ transitionDelay: '200ms' }}>
            <div className="location__map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3548.6455278916246!2d85.51607609999999!3d27.629546899999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb0f32b831fa95%3A0xe100635a8dcfc469!2sVidhya%20Sagar%20Secondary%20School!5e1!3m2!1sen!2snp!4v1778325376876!5m2!1sen!2snp"
                width="600"
                height="400"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="School Location"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Location