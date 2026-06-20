import { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';

function Admissions() {
  const formRef = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const EMAILJS_SERVICE_ID = 'service_8cknql8';
  const EMAILJS_TEMPLATE_ID = 'template_cv6sy7h';
  const EMAILJS_PUBLIC_KEY = '8jagAhbv30GQLizmb';

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3200);
  };

  // Validation function
  const validateForm = (formData) => {
    const errors = [];

    if (!formData.get('full_name')?.trim()) {
      errors.push("Please enter the student's name !!");
    }
    if (!formData.get('email')?.trim()) {
      errors.push("Email Address is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.get('email'))) {
      errors.push("Please enter a valid email address !!");
    }
    if (!formData.get('program') || formData.get('program') === "") {
      errors.push("Please select a grade/program !!");
    }
    if (!formData.get('phone')?.trim()) {
      errors.push("Please enter a phone number !!");
    }
    if (!formData.get('message')?.trim()) {
      errors.push("Message is required");
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData(formRef.current);
    const validationErrors = validateForm(formData);

    if (validationErrors.length > 0) {
      showToast(validationErrors[0], 'error'); // Show first error
      return;
    }

    setIsSubmitting(true);

    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current,
        EMAILJS_PUBLIC_KEY
      );
      showToast('✓ Enquiry sent successfully! Our counselor will reach out soon.');
      formRef.current.reset();
    } catch (error) {
      showToast('✗ Failed to send enquiry. Please try again later.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          {/* Left Side */}
          <div className="reveal">
            <h2 className="admissions__title glow-text">Start Your Journey with Us Today</h2>
            <p className="admissions__subtitle">
              Join a community dedicated to academic rigor, creative freedom, and character growth. 
              Admissions for 2025-26 are now open.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}>
              <button 
  type="button" 
  className="btn-cta-orange"
  onClick={() => document.querySelector('.inquiry-card').scrollIntoView({ 
    behavior: 'smooth' 
  })}
>
 Learn for Advancement
</button>
            </div>
          </div>

          {/* Right Side - Form Card */}
          <div className="inquiry-card reveal" style={{ transitionDelay: '280ms' }}>
            <h3 className="inquiry-card__title">Admission Enquiry </h3>

            <form ref={formRef} onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="full_name"></label>
                <input
                  id="full_name"
                  type="text"
                  name="full_name"
                  className="form-input"
                  placeholder="STUDENT FULL NAME"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email"></label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="EMAIL ADDRESS"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="program"> </label>
                  <select 
                    id="program" 
                    name="program" 
                    className="form-select" 
                    required 
                    defaultValue=""
                  >
                    <option value="" disabled hidden>Select Grade</option>
                    <option>Pre School</option>
                    <option>Primary(Grade 1 - 5)</option>
                    <option>Middle(Grade 6 - 8)</option>
                    <option>Secondary(Grade 9 - 10)</option>
                    <option>Science(Grade 11 - 12)</option>
                    <option>Management(Grade 11 - 12)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="phone"></label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    className="form-input"
                    placeholder="Phone Number"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="message"></label>
                <textarea
                  id="message"
                  name="message"
                  className="form-input"
                  placeholder="Tell us about your child's interests or questions"
                  rows="4"
              
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="btn-form-submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'SUBMIT INQUIRY'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`vs-toast ${toast.type === 'error' ? 'vs-toast--error' : ''}`}>
          {toast.message}
        </div>
      )}
    </section>
  );
}

export default Admissions;