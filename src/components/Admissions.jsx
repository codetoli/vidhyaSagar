import { useState } from 'react'

function Admissions() {
  const [formData, setFormData] = useState({
    name: '',
    grade: 'nursery',
    phone: ''
  })
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3200)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.grade || !formData.phone) {
      showToast('Please fill in all required fields.', 'error')
      return
    }
    showToast('Thank you! We will contact you soon. ✓')
    setFormData({ name: '', grade: 'nursery', phone: '' })
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <section id="admissionsSection" className="admissions">
      <div className="admissions__blob admissions__blob--1"></div>
      <div className="admissions__blob admissions__blob--2"></div>
      <img
        className="admissions__bg-img"
        src="https://lh3.googleusercontent.com/aida/ADBb0uj67lywq4A6bfGrG2qjd4n5CAM0khTNnP59Sm3od57y293_vmILhKsY0W_vicklz_6B145IrYpvrVdxe8GuFXy0ql7h07A6s-XsUSs1dOP-0As_WAuR_NJlQ-BtgrO-iIOVmDb37uWUt2SjWqmrvruCsVd7VcBGxSDkREfr2XQjsICDINlI90WLccZdm_oPb2HnHFgpbaVJd8dQr4PbcEl590RwDlPYEMGeM-raGA4HONp8g2fOd4-Ybg"
        alt=""
      />

      <div className="container">
        <div className="admissions__grid">
          <div className="reveal">
            <h2 className="admissions__title glow-text">Start Your Journey with Us Today</h2>
            <p className="admissions__subtitle">
              Join a community dedicated to academic rigor, creative freedom, and character growth.
              Admissions for 2025-26 are now open.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}>
              <button className="btn-cta-orange">Apply for Admission</button>
              <a href="#" className="admissions__download">Download Prospectus</a>
            </div>
          </div>

          <div className="inquiry-card reveal" style={{ transitionDelay: '280ms' }}>
            <h3 className="inquiry-card__title">Express Your Interest</h3>

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="studentName">Student Full Name</label>
                <input
                  id="studentName"
                  name="name"
                  type="text"
                  className="form-input"
                  placeholder="  "
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="targetGrade">Target Grade</label>
                  <select 
                    id="targetGrade" 
                    name="grade" 
                    className="form-select" 
                    required 
                    value={formData.grade} 
                    onChange={handleChange}
                  >
                    <option value="nursery">Nursery</option>
                    <option value="kg">KG</option>
                    <option value="grade-1-5">Grade 1–5</option>
                    <option value="grade-6-8">Grade 6–8</option>
                    <option value="grade-9-10">Grade 9–10</option>
                    <option value="grade-11-12">Grade 11–12</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="parentPhone">Parent Phone</label>
                  <input
                    id="parentPhone"
                    name="phone"
                    type="tel"
                    className="form-input"
                    placeholder="+977 XXXXX XXXXX"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button type="submit" className="btn-form-submit">SUBMIT INQUIRY</button>
            </form>
          </div>
        </div>
      </div>

      {toast && (
        <div className={`vs-toast ${toast.type === 'error' ? 'vs-toast--error' : ''}`}>
          {toast.message}
        </div>
      )}
    </section>
  )
}

export default Admissions