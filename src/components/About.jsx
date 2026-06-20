import React, { useEffect } from 'react';

import schoolImage from '../assets/Gallery/school.jpg';
import principalImage from '../assets/Gallery/principal.jpg';

/* ─────────────────────────────────────────────────────────────
   CSS — exact 1-to-1 port of about_page_redesign.html styles
───────────────────────────────────────────────────────────── */
const css = `
  .about-page *{box-sizing:border-box;}
  .about-page{
    min-height:100vh;
    max-width:100%;
    overflow:hidden;
    background: rgba(144, 127, 160, 0.1);
    color:#1e293b;
    font-family:inherit;
  }

  /* ── Hero ─────────────────────────────── */
  .about-hero{
    background:#1e3a8a;
    padding-top:130px;
    padding-bottom:75px;
    text-align:center;
    position:relative;
    overflow:hidden;
  }
  .about-hero-wm{
    position:absolute;inset:0;
    display:flex;align-items:center;justify-content:center;
    font-size:clamp(50px,12vw,110px);
    font-weight:900;letter-spacing:18px;text-transform:uppercase;
    color:rgba(255,255,255,0.035);
    pointer-events:none;user-select:none;
  }
  .about-breadcrumb{
    position:relative;z-index:2;
    font-size:11px;font-weight:600;letter-spacing:3px;text-transform:uppercase;
    color:rgba(255,255,255,0.45);margin-bottom:20px;
  }
  .about-breadcrumb .sep{color:rgba(255,255,255,0.18);margin:0 8px;}
  .about-breadcrumb .active{color:#f59e0b;}
  .about-hero-title{
    position:relative;z-index:2;
    font-size:clamp(2rem,6vw,3.8rem);
    font-weight:900;color:#fff;text-transform:uppercase;letter-spacing:2px;line-height:1.15;
  }
  .about-hero-title span{color:#fff}
  .about-hero-bar{
    width:110px;height:3px;background:#f59e0b;
    border-radius:2px;margin:18px auto 0;
  }
  .about-hero-sub{
    position:relative;z-index:2;
    margin-top:18px;font-size:12px;font-weight:500;letter-spacing:3px;
    text-transform:uppercase;color:rgba(255,255,255,0.5);
  }

  /* ── School Section ───────────────────── */
  .about-school-section{
    max-width:1200px;margin:0 auto;
    padding:80px 32px;
    display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;
  }
  @media(max-width:780px){
    .about-school-section{grid-template-columns:1fr;gap:36px;padding:48px 20px;}
  }

  .about-img-wrap{
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  border: 3px solid #1e3a8a;
  box-shadow: 6px 6px 0 #1e3a8a;
}

.about-img-wrap img{
  width: 96vh;
  height: 70vh;
  display: block;
  object-fit: cover;
}

  .about-section-tag{
    font-size:11px;font-weight:600;letter-spacing:3px;text-transform:uppercase;
    color:#f59e0b;margin-bottom:8px;
  }
  .about-section-title{
    font-size:clamp(1.5rem,3.5vw,2.2rem);font-weight:700;
    color:#1e3a8a;line-height:1.25;
  }
  .about-gold-bar{
    width:52px;height:3px;background:#f59e0b;
    border-radius:2px;margin:14px 0 24px;
  }
  .about-body-text{
    font-size:14px;line-height:1.85;color:#475569;
    display:flex;flex-direction:column;gap:16px;
  }
  .about-body-text strong{color:#1e3a8a;}

  .about-motto-card{
    background:#eff6ff;border-left:4px solid #1e3a8a;
    padding:16px 20px;border-radius:0 8px 8px 0;
    margin-top:4px;
  }
  .about-motto-card p{color:#1e40af;font-size:13px;font-weight:500;line-height:1.7;}

  /* ── Principal Section ────────────────── */
  .about-principal-section{
    background:rgba(144, 127, 160, 0.1);
    border-top:1px solid #e2e8f0;
    padding:80px 32px;
  }
  .about-principal-inner{
    max-width:1200px;margin:0 auto;
    display:grid;grid-template-columns:280px 1fr;gap:60px;align-items:start;
  }
  @media(max-width:780px){
    .about-principal-inner{grid-template-columns:1fr;gap:36px;}
  }

  /* Profile card */
  .about-profile-card{
    background:#f8fafc;border-radius:16px;
    border:1px solid #e2e8f0;
    padding:32px 24px;
    display:flex;flex-direction:column;align-items:center;text-align:center;
  }
  .about-avatar-ring{
    width:160px;height:160px;border-radius:50%;
    border:4px solid #1e3a8a;
    background:linear-gradient(135deg,#1e3a8a,#2d4fa8);
    display:flex;align-items:center;justify-content:center;
    position:relative;
    margin-bottom:20px;
    overflow:hidden;
  }
  .about-avatar-ring img{
    width:100%;height:100%;object-fit:cover;border-radius:50%;
  }
  .about-avatar-badge{
    position:absolute;bottom:4px;right:4px;
    width:28px;height:28px;border-radius:50%;
    background:#f59e0b;
    display:flex;align-items:center;justify-content:center;
    z-index:2;
  }
  .about-avatar-badge svg{width:14px;height:14px;fill:#fff;}

  .about-profile-name{font-size:18px;font-weight:700;color:#1e3a8a;}
  .about-profile-role{
    font-size:11px;font-weight:600;letter-spacing:3px;text-transform:uppercase;
    color:#f59e0b;margin-top:4px;
  }
  .about-profile-divider{width:36px;height:1px;background:#e2e8f0;margin:14px auto;}
  .about-profile-school{
    font-size:11px;font-weight:500;letter-spacing:1.5px;text-transform:uppercase;
    color:#94a3b8;line-height:1.6;
  }

  .about-profile-chips{
    display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-top:16px;
  }
  .about-chip{
    font-size:11px;font-weight:500;
    padding:4px 10px;border-radius:20px;
    background:#eff6ff;color:#1e40af;
    border:1px solid #bfdbfe;
  }

  /* Message side */
  .about-blockquote-box{
    background:#eff6ff;
    border-left:4px solid #1e3a8a;
    padding:16px 22px;
    border-radius:0 10px 10px 0;
    margin:24px 0;
  }
  .about-blockquote-box p{
    font-size:16px;font-style:italic;font-weight:500;
    color:#1e40af;line-height:1.6;
  }

  .about-values-row{
    display:flex;flex-wrap:wrap;gap:8px;margin-top:20px;
  }
  .about-value-pill{
    display:flex;align-items:center;gap:6px;
    font-size:12px;font-weight:500;color:#1e40af;
    background:#eff6ff;border:1px solid #bfdbfe;
    padding:5px 12px;border-radius:20px;
  }

  .about-signoff{
    padding-top:24px;border-top:1px solid #e2e8f0;margin-top:28px;
  }
  .about-signoff-label{
    font-size:11px;font-weight:500;letter-spacing:2px;text-transform:uppercase;
    color:#94a3b8;
  }
  .about-signoff-name{font-size:18px;font-weight:700;color:#1e3a8a;margin-top:4px;}
  .about-signoff-role{
    font-size:11px;font-weight:600;letter-spacing:3px;text-transform:uppercase;
    color:#f59e0b;margin-top:2px;
  }

  /* Accessibility */
  .sr-only{
    position:absolute;width:1px;height:1px;padding:0;
    margin:-1px;overflow:hidden;clip:rect(0,0,0,0);
    white-space:nowrap;border-width:0;
  }
`;

/* ─────────────────────────────────────────────────────────────
   Value pill icon map — SVG inline icons (no external font needed)
───────────────────────────────────────────────────────────── */
const valuePills = [
  {
    label: 'Community',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
        fill="none" stroke="#1e40af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    label: 'Knowledge',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
        fill="none" stroke="#1e40af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    ),
  },
  {
    label: 'Character',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
        fill="none" stroke="#1e40af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  },
  {
    label: 'Excellence',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
        fill="none" stroke="#1e40af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/>
        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
        <line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/>
        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/>
        <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
      </svg>
    ),
  },
];

/* ─────────────────────────────────────────────────────────────
   Component
───────────────────────────────────────────────────────────── */
const About = () => {
  // Inject scoped CSS once on mount
  useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.id = 'about-page-styles';
    styleTag.textContent = css;
    if (!document.getElementById('about-page-styles')) {
      document.head.appendChild(styleTag);
    }
    return () => {
      const existing = document.getElementById('about-page-styles');
      if (existing) existing.remove();
    };
  }, []);

  return (
    <div className="about-page">
      <h2 className="sr-only">About Us — Vidhya Sagar Secondary School</h2>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="about-hero">
        <div className="about-hero-wm">VIDHYA SAGAR</div>

      
        <h1 className="about-hero-title">
          About <span>Us</span>
        </h1>

        <div className="about-hero-bar" />

        <p className="about-hero-sub">Learn for Advancement</p>
      </section>

      {/* ── About School ─────────────────────────────────────── */}
      <section>
        <div className="about-school-section">

          {/* School image */}
          <div className="about-img-wrap">
            <img
              src={schoolImage}
              alt="Vidhya Sagar Secondary School Campus"
            />
          </div>

          {/* Text content */}
          <div>
            <p className="about-section-tag">Our Story</p>
            <h2 className="about-section-title">About the School</h2>
            <div className="about-gold-bar" />

            <div className="about-body-text">
              <p>
                A school is more than a place where lessons are taught; it is a place where
                futures are shaped. Here, children do not simply learn to read and write—they
                learn to understand life. They acquire not only knowledge but also values,
                discipline, confidence, leadership, collaboration, and compassion. Guided by
                this belief, Vidhya Sagar Secondary School remains committed to providing
                quality, value-based, and life-oriented education.
              </p>

              <p>
                We are deeply inspired by the rich educational, cultural, and social heritage
                of Banepa and Kavrepalanchok. The trust of our parents, the dedication of our
                teachers, and the support of our local community form the foundation of our
                success. We strongly believe that when schools and communities work together,
                children thrive and societies prosper.
              </p>

              <p>
                In today's rapidly changing world, education cannot be confined to examination
                results alone. Our goal is not merely to produce successful students but to
                nurture thoughtful, resilient, and compassionate individuals who can contribute
                positively to society.
              </p>

              <p>
                Our vision is to create a vibrant learning community where every student
                discovers their unique potential, pursues their aspirations with confidence,
                and develops the knowledge, skills, and character needed to thrive in an
                ever-changing world.
              </p>

              <div className="about-motto-card">
                <p>
                  Our motto,{' '}
                  <strong>"Learn for Advancement,"</strong>{' '}
                  reflects our belief that meaningful learning empowers individuals,
                  strengthens families, enriches communities, and contributes to the
                  progress of the nation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Principal Message ─────────────────────────────────── */}
      <section className="about-principal-section">
        <div className="about-principal-inner">

          {/* Profile card */}
          <div className="about-profile-card">
            <div className="about-avatar-ring">
              <img src={principalImage} alt="Principal Hira Sharma" />
              <div className="about-avatar-badge">
                {/* Star icon */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
            </div>

            <p className="about-profile-name">Hira Sharma</p>
            <p className="about-profile-role">Principal</p>
            <div className="about-profile-divider" />
            <p className="about-profile-school">
              Vidhya Sagar<br />Secondary School
            </p>

            <div className="about-profile-chips">
              <span className="about-chip">Excellence</span>
              <span className="about-chip">Integrity</span>
              <span className="about-chip">Innovation</span>
            </div>
          </div>

          {/* Message content */}
          <div>
            <p className="about-section-tag">From the Principal's Desk</p>
            <h2 className="about-section-title">Message from the Principal</h2>
            <div className="about-gold-bar" />

            <div className="about-blockquote-box">
              <p>"Learn for Advancement"</p>
            </div>

            <div className="about-body-text">
              <p style={{ fontSize: '15px', fontWeight: 500, color: '#1e293b' }}>
                Dear Parents, Students, Well-Wishers, and Members of the Vidhya Sagar Family,
              </p>

              <p>
                It is my great pleasure to welcome you to Vidhya Sagar Secondary School.
              </p>

              <p>
                I would like to express my sincere gratitude to our parents for their trust,
                to our teachers and staff for their unwavering dedication, to our students
                for their enthusiasm and hard work, and to all our well-wishers for their
                continued support. Together, we have built a school community that values
                excellence, integrity, respect, and lifelong learning.
              </p>

              <p>
                Let us continue this journey together—fostering knowledge, character,
                innovation, and excellence—so that today's learners become tomorrow's
                responsible, capable, and compassionate leaders.
              </p>
            </div>

            <div className="about-values-row">
              {valuePills.map(({ label, icon }) => (
                <span key={label} className="about-value-pill">
                  {icon}
                  {label}
                </span>
              ))}
            </div>

            <div className="about-signoff">
              <p className="about-signoff-label">Warm regards,</p>
              <p className="about-signoff-name">Hira Sharma</p>
              <p className="about-signoff-role">Principal</p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default About;