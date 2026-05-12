import { useState } from 'react'

const noticesData = [
  {
    tag: 'Academics',
    tagClass: 'tag--purple',
    cardClass: 'notice-card--purple',
    title: 'Pre-Board Examination Schedule Released',
    body: 'The final datesheet for the upcoming Class X and XII pre-board examinations has been uploaded to the student portal.',
    date: 'Oct 15, 2025',
    icon: 'download',
    delay: '80ms'
  },
  {
    tag: 'Admissions',
    tagClass: 'tag--mauve',
    cardClass: 'notice-card--mauve',
    title: 'Nursery Admissions 2026-27 Open',
    body: 'Applications are now invited for Nursery and KG admissions for the next academic session. Limited seats available.',
    date: 'Oct 12, 2025',
    icon: 'launch',
    delay: '160ms'
  },
  {
    tag: 'Urgent',
    tagClass: 'tag--navy',
    cardClass: 'notice-card--navy',
    title: 'Inter-School Debate Postponed',
    body: 'Due to administrative reasons, the debate competition scheduled for tomorrow has been moved to next Friday.',
    date: 'Oct 10, 2025',
    icon: 'info',
    delay: '240ms'
  }
]

function Notices() {
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3200)
  }

  const handleAction = (icon) => {
    if (icon === 'download') showToast('Downloading notice…')
    else if (icon === 'launch') showToast('Opening external link…')
    else if (icon === 'info') showToast('Showing notice details…')
  }

  return (
    <section className="notices section-pad">
      <div className="notices__bg"></div>

      <div className="container">
        <div className="notices__header reveal">
          <div>
            <span className="section-label">Stay Updated</span>
            <h2 className="section-title glow-text">Latest Notices &amp; Bulletins</h2>
          </div>
          <button className="btn-secondary" onClick={() => showToast('Redirecting to all notices…')}>
            View All Notices
          </button>
        </div>

        <div className="notices__grid">
          {noticesData.map((notice, index) => (
            <div key={index} className={`notice-card ${notice.cardClass} reveal`} style={{ transitionDelay: notice.delay }}>
              <span className={`notice-card__tag ${notice.tagClass}`}>{notice.tag}</span>
              <h4 className="notice-card__title">{notice.title}</h4>
              <p className="notice-card__body">{notice.body}</p>
              <div className="notice-card__footer">
                <span className="notice-card__date">{notice.date}</span>
                <button className="notice-card__action" onClick={() => handleAction(notice.icon)} aria-label={notice.icon}>
                  <span className="material-symbols-outlined">{notice.icon}</span>
                </button>
              </div>
            </div>
          ))}
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

export default Notices