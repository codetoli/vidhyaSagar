import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiLoader, FiX, FiCalendar, FiSearch,
  FiFileText, FiDownload, FiChevronLeft, FiChevronRight,
  FiExternalLink
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

/* ── helpers ── */
const isMobile = () =>
  /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);

const getAttachment = (post) => {
  const url =
    post.pdfUrl ||
    post.imageUrl ||
    post.fileUrl ||
    '';

  let type = post.attachmentType;

  if (!type) {
    if (post.pdfUrl || url.toLowerCase().includes('.pdf')) type = 'pdf';
    else if (post.imageUrl || url.match(/\.(jpg|jpeg|png|webp)/i)) type = 'image';
    else type = '';
  }

  return { url, type };
};

const cloudinaryDownloadUrl = (url, filename) => {
  if (!url.includes('cloudinary.com')) return url;
  const safe = filename.replace(/\s+/g, '_').replace(/\./g, '_');
  return url.replace('/upload/', `/upload/fl_attachment:${safe}/`);
};

const cloudinaryPdfThumbnail = (url) => {
  if (!url || !url.includes('cloudinary.com')) return null;
  return url.replace('.pdf', '.jpg');
};

const downloadFile = async (url, filename) => {
  try {
    const res = await fetch(url, { mode: 'cors' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), {
      href: blobUrl,
      download: filename,
    });
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(blobUrl), 15_000);
  } catch {
    window.open(url, '_blank', 'noopener');
  }
};

/* ── PDF thumbnail fallback ── */
const PdfThumbnailFallback = ({ title }) => (
  <div style={{
    width: '100%', height: '100%',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(135deg, #2d1b69 0%, #4c1d95 60%, #6d28d9 100%)',
    gap: '10px',
  }}>
    <div style={{
      width: '56px', height: '68px',
      background: 'rgba(255,255,255,0.12)',
      borderRadius: '6px', border: '1.5px solid rgba(255,255,255,0.2)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', position: 'relative',
    }}>
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: '14px', height: '14px',
        background: 'rgba(255,255,255,0.25)',
        borderBottomLeftRadius: '4px',
        clipPath: 'polygon(0 0, 100% 0, 100% 100%)',
      }} />
      <FiFileText size={24} style={{ color: 'rgba(255,255,255,0.85)' }} />
    </div>
    <span style={{
      fontSize: '9px', fontWeight: 800,
      letterSpacing: '0.18em', textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.55)',
    }}>PDF Document</span>
    {title && (
      <span style={{
        fontSize: '10px', fontWeight: 700,
        color: 'rgba(255,255,255,0.4)',
        maxWidth: '80%', textAlign: 'center',
        overflow: 'hidden', display: '-webkit-box',
        WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
      }}>{title}</span>
    )}
  </div>
);

/* ── PDF card thumbnail ── */
const PdfCardThumbnail = ({ url, title }) => {
  const [failed, setFailed] = useState(false);
  const thumbUrl = cloudinaryPdfThumbnail(url);

  if (!thumbUrl || failed) return <PdfThumbnailFallback title={title} />;

  return (
    <img
      src={thumbUrl}
      alt={title || 'PDF preview'}
      style={{
        width: '100%', height: '100%',
        objectFit: 'cover', objectPosition: 'top',
        display: 'block', transition: 'transform 0.7s ease',
      }}
      onError={() => setFailed(true)}
    />
  );
};

/* ── Notice card ── */
const NoticeCard = ({ post, onClick }) => {
  const { url, type } = getAttachment(post);
  const accentColor = type === 'pdf' ? '#7c3aed' : '#f97316';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      onClick={() => onClick(post)}
      style={{
        width: '100%', cursor: 'pointer',
        background: 'white', borderRadius: '18px',
        overflow: 'hidden',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        border: '1px solid rgba(26,35,126,0.08)',
        display: 'flex', flexDirection: 'column',
        transition: 'box-shadow 0.3s, transform 0.3s',
      }}
      whileHover={{ y: -4, boxShadow: '0 12px 36px rgba(26,35,126,0.14)' }}
    >
      {/* Thumbnail */}
      <div style={{
        position: 'relative', width: '100%',
        aspectRatio: '16/9', overflow: 'hidden',
        background: '#e8eaf6', flexShrink: 0,
      }}>
        {type === 'pdf' ? (
          <PdfCardThumbnail url={url} title={post?.title} />
        ) : url ? (
          <img
            src={url}
            alt={post?.title || 'Notice'}
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover', display: 'block',
              transition: 'transform 0.7s ease',
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/600x400?text=Notice';
            }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, #1a237e, #3949ab)',
          }}>
            <FiFileText size={36} style={{ color: 'rgba(255,255,255,0.25)' }} />
          </div>
        )}

        {/* Badge */}
        <span style={{
          position: 'absolute', top: '12px', left: '12px',
          background: accentColor, color: 'white',
          fontSize: '9px', fontWeight: 800,
          textTransform: 'uppercase', letterSpacing: '0.12em',
          padding: '4px 10px', borderRadius: '999px',
        }}>
          {type === 'pdf' ? 'PDF' : 'Notice'}
        </span>
      </div>

      {/* Card body */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        flex: 1, padding:
window.innerWidth < 768
?'15px'
:'18px 20px 20px',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '5px',
          fontSize: '11px', fontWeight: 600,
          color: 'rgba(26,35,126,0.4)', marginBottom: '8px',
        }}>
          <FiCalendar size={11} />
          {post.date ||
            post.createdAt?.toDate?.()?.toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric',
            }) || '—'}
        </div>

        <h3 style={{
          margin: '0 0 8px', fontWeight: 900, fontSize: '15px',
          lineHeight: 1.35, color: '#1a237e',
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {post.title}
        </h3>

        <p style={{
          margin: 0, fontSize: '13px', color: '#6b7280',
          lineHeight: 1.6, flex: 1,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {post.content || post.description || 'Click to view this notice.'}
        </p>

        <div style={{
          marginTop: '16px', paddingTop: '12px',
          borderTop: '1px solid #f1f5f9',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{
            fontSize: '11px', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.1em',
            color: accentColor,
          }}>
            {type === 'pdf' ? 'View PDF →' : 'Read more →'}
          </span>
          <span style={{
            width: '28px', height: '28px', borderRadius: '50%',
            background: type === 'pdf' ? 'rgba(124,58,237,0.08)' : 'rgba(26,35,126,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {type === 'pdf'
              ? <FiFileText size={13} style={{ color: '#7c3aed' }} />
              : <FiChevronRight size={13} style={{ color: '#1a237e' }} />
            }
          </span>
        </div>
      </div>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
const NoticesHome = () => {
  const [posts, setPosts]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchQuery, setSearchQuery]   = useState('');
  const [downloading, setDownloading]   = useState(false);
  const [touchStartX, setTouchStartX]   = useState(0);
  const [touchEndX, setTouchEndX]       = useState(0);

  /* Lock body scroll when modal is open */
  useEffect(() => {
    document.body.style.overflow = selectedPost ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedPost]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const q = query(collection(db, 'notices'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter(p => {
      const dateStr = p.date || p.createdAt?.toDate?.()?.toLocaleDateString() || '';
      return (
        p.title?.toLowerCase().includes(q) ||
        (p.content || p.description || '').toLowerCase().includes(q) ||
        dateStr.toLowerCase().includes(q)
      );
    });
  }, [posts, searchQuery]);

  /* ── Only show the latest 3 notices ── */
  const latestThree = useMemo(() => filtered.slice(0, 3), [filtered]);

  const navigatePost = (dir) => {
    if (!selectedPost || filtered.length === 0) return;
    const idx  = filtered.findIndex(p => p.id === selectedPost.id);
    const next = (idx + dir + filtered.length) % filtered.length;
    setSelectedPost(filtered[next]);
  };

  useEffect(() => {
    const handler = (e) => {
      if (!selectedPost) return;
      if (e.key === 'ArrowRight') navigatePost(1);
      if (e.key === 'ArrowLeft')  navigatePost(-1);
      if (e.key === 'Escape')     setSelectedPost(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedPost, filtered]);

  const onTouchStart = (e) => {
    if (e.target.closest('a, button')) return;
    setTouchStartX(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e) => {
    if (e.target.closest('a, button')) return;
    setTouchEndX(e.targetTouches[0].clientX);
  };
  const onTouchEnd = (e) => {
    if (e.target.closest('a, button')) return;
    if (touchStartX - touchEndX > 50) navigatePost(1);
    if (touchEndX - touchStartX > 50) navigatePost(-1);
  };

  const handleDownload = async (e, post) => {
    e.stopPropagation();
    const { url, type } = getAttachment(post);
    if (!url || downloading) return;

    const ext      = type === 'pdf' ? 'pdf' : 'jpg';
    const filename = `${(post.title || 'notice').replace(/\s+/g, '_')}.${ext}`;

    if (isMobile()) {
      window.open(url, '_blank', 'noopener');
      return;
    }

    setDownloading(true);
    try {
      const downloadUrl = type === 'image' && url.includes('cloudinary.com')
        ? cloudinaryDownloadUrl(url, filename)
        : url;
      await downloadFile(downloadUrl, filename);
    } finally {
      setDownloading(false);
    }
  };

  const currentIndex       = selectedPost ? filtered.findIndex(p => p.id === selectedPost.id) : -1;
  const selectedAttachment = selectedPost ? getAttachment(selectedPost) : null;

  /* ── Section padding shared between hero/search/grid ── */
  const sectionPadding = {
  paddingTop: window.innerWidth < 768 ? '32px' : '48px',
  paddingRight: '16px',
  paddingBottom: window.innerWidth < 768 ? '48px' : '96px',
  paddingLeft: '16px',
  maxWidth: '1152px',
  margin: '0 auto',
  boxSizing: 'border-box',
};
  return (
    <div style={{ minHeight: '100vh', background: '#eef0f8' }}>

      {/* ── GRID ── */}
      <section style={sectionPadding}>

        {/* ── Section heading with orange underline ── */}
        <div style={{ marginBottom: '36px' }}>
          <h2 style={{
            margin: '0 0 10px',
            fontWeight: 900,
            fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: '#1a237e',
          }}>
            Latest News and Notices
          </h2>
          {/* Orange underline — matches the text width naturally via inline-block */}
          <div style={{
            height: '4px',
            width:'30%',
minWidth:'100px',
maxWidth:'180px',
            background: 'orange',
            borderRadius: '9999px',
          }} />
        </div>

        {loading ? (
          <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', padding: '160px 0',
            gap: '16px', color: 'rgba(26,35,126,0.3)',
          }}>
            <FiLoader size={40} style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{
              fontSize: '11px', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '3px', margin: 0,
            }}>
              Loading notices...
            </p>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </div>

        ) : latestThree.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', padding: '160px 0',
              gap: '16px', textAlign: 'center',
            }}
          >
            <div style={{
              width: '64px', height: '64px', borderRadius: '16px',
              background: 'rgba(26,35,126,0.05)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <FiSearch size={28} style={{ color: 'rgba(26,35,126,0.2)' }} />
            </div>
            <p style={{ fontWeight: 900, fontSize: '18px', color: '#1a237e', margin: 0 }}>
              No notices found
            </p>
            <p style={{ color: '#9ca3af', fontSize: '14px', maxWidth: '280px', margin: 0 }}>
              {searchQuery
                ? `No results for "${searchQuery}". Try a different keyword.`
                : 'No notices have been published yet.'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  marginTop: '8px', fontSize: '11px', fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.1em',
                  color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer',
                }}
              >
                Clear search
              </button>
            )}
          </motion.div>

        ) : (
          /* ── THE GRID — renders only the latest 3 notices ── */
          <div style={{
            display: 'grid',
            gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',
            gap: '24px',
          }}>
            {latestThree.map((post) => (
              <NoticeCard key={post.id} post={post} onClick={setSelectedPost} />
            ))}
          </div>
        )}

        {/* ── Read More button ── */}
        {!loading && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
            <Link
              to="/notices"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#1e3a8a',
                color: 'white',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                padding:'12px 22px',
                fontSize:'12px',
                borderRadius: '12px',
                textDecoration: 'none',
                boxShadow: '0 4px 16px rgba(30,58,138,0.30)',
                transition: 'background 0.2s, transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#1e40af';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(30,58,138,0.40)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#1e3a8a';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(30,58,138,0.30)';
              }}
            >
              Read More
              <FiChevronRight size={15} />
            </Link>
          </div>
        )}
      </section>

      {/* ══════════════════════════════════════
          LIGHTBOX MODAL
      ══════════════════════════════════════ */}
      <AnimatePresence>
        {selectedPost && selectedAttachment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 9999,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 'clamp(16px, 4vw, 40px)',
              background: 'rgba(10,14,50,0.96)',
            }}
            onClick={() => setSelectedPost(null)}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Close */}
            <button
              onClick={(e) => { e.stopPropagation(); setSelectedPost(null); }}
              style={{
                position: 'absolute', top: '20px', right: '20px', zIndex: 50,
                width: '40px', height: '40px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer',
              }}
            >
              <FiX size={18} />
            </button>

            {/* Prev */}
            {filtered.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); navigatePost(-1); }}
                style={{
                  position: 'absolute', left: 'clamp(12px, 3vw, 24px)', zIndex: 50,
                  width: '44px', height: '44px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer',
                }}
              >
                <FiChevronLeft size={22} />
              </button>
            )}

            {/* Modal card */}
            <motion.div
              key={selectedPost.id}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                maxWidth: '860px', width: '100%',
                maxHeight: '92vh',
                display: 'flex', flexDirection: 'column',
                borderRadius: '20px', background: 'white',
                boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.08)',
                overflow: 'hidden',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                // PDF: swap .pdf → .jpg for inline image display
                // Image: use URL as-is
                const displayUrl = selectedAttachment.type === 'pdf'
                  ? selectedAttachment.url.replace('.pdf', '.jpg')
                  : selectedAttachment.url;

                const accentColor = selectedAttachment.type === 'pdf' ? '#7c3aed' : '#f97316';
                const badgeLabel  = selectedAttachment.type === 'pdf' ? 'PDF' : 'Notice';

                return (
                  <>
                    {/* Scrollable content */}
                    <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>

                      {/* Full-width attachment image */}
                      {displayUrl && (
                        <div style={{ position: 'relative', width: '100%' }}>
                          <img
                            src={displayUrl}
                            alt={selectedPost.title}
                            style={{ width: '100%', height: 'auto', display: 'block' }}
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                          {/* Gradient fade */}
                          <div style={{
                            position: 'absolute', bottom: 0, left: 0, right: 0,
                            height: '80px',
                            background: 'linear-gradient(to top, white 0%, transparent 100%)',
                            pointerEvents: 'none',
                          }} />
                          {/* Badge */}
                          <span style={{
                            position: 'absolute', top: '16px', left: '16px',
                            background: accentColor, color: 'white',
                            fontSize: '9px', fontWeight: 800,
                            textTransform: 'uppercase', letterSpacing: '0.12em',
                            padding: '5px 12px', borderRadius: '999px',
                          }}>
                            {badgeLabel}
                          </span>
                        </div>
                      )}

                      {/* Date + title + description */}
                      <div style={{ padding: 'clamp(20px, 4vw, 40px)' }}>
                        <div style={{
                          display: 'inline-flex', alignItems: 'center', gap: '6px',
                          fontSize: '11px', fontWeight: 700,
                          textTransform: 'uppercase', letterSpacing: '0.1em',
                          color: '#1a237e', background: 'rgba(26,35,126,0.05)',
                          border: '1px solid rgba(26,35,126,0.1)',
                          borderRadius: '999px', padding: '6px 14px', marginBottom: '16px',
                        }}>
                          <FiCalendar size={11} />
                          {selectedPost.date ||
                            selectedPost.createdAt?.toDate?.()?.toLocaleDateString('en-US', {
                              year: 'numeric', month: 'long', day: 'numeric',
                            }) || '—'}
                        </div>

                        <h2 style={{
                          fontWeight: 900, fontSize: 'clamp(1.3rem, 3vw, 2rem)',
                          lineHeight: 1.25, color: '#1a237e', margin: '0 0 16px',
                        }}>
                          {selectedPost.title}
                        </h2>

                        <div style={{
                          width: '48px', height: '3px', background: accentColor,
                          borderRadius: '9999px', marginBottom: '20px',
                        }} />

                        {(selectedPost.content || selectedPost.description) && (
                          <p style={{
                            color: '#4b5563', fontSize: '15px',
                            lineHeight: 1.75, whiteSpace: 'pre-wrap', margin: 0,
                          }}>
                            {selectedPost.content || selectedPost.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* ── Footer: counter + View Full + Download ── */}
                    <div style={{
                      display:'flex',
flexDirection:
window.innerWidth < 768
?'column'
:'row',

alignItems:
window.innerWidth < 768
?'stretch'
:'center',


                      padding: '14px clamp(20px, 4vw, 40px)',
                      borderTop: '1px solid #f1f5f9',
                      gap: '12px', flexShrink: 0, background: 'white',
                    }}>
                      <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#94a3b8' }}>
                        {currentIndex + 1} / {filtered.length}
                      </span>

                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        {/* View Full — opens original URL in new tab */}
                        <a
                          href={selectedAttachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            fontSize: '11px', fontWeight: 700,
                            textTransform: 'uppercase', letterSpacing: '0.08em',
                            color: '#64748b', background: 'rgba(100,116,139,0.08)',
                            border: '1px solid rgba(100,116,139,0.15)',
                            padding: '9px 16px', borderRadius: '10px',
                            textDecoration: 'none',
                          }}
                        >
                          <FiExternalLink size={12} /> View Full
                        </a>

                        {/* Download */}
                        <button
                          onClick={(e) => handleDownload(e, selectedPost)}
                          disabled={downloading}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            color: 'white', fontWeight: 700, fontSize: '11px',
                            textTransform: 'uppercase', letterSpacing: '0.1em',
                            background: accentColor,
                            padding: '10px 20px', borderRadius: '10px',
                            boxShadow: selectedAttachment.type === 'pdf'
                              ? '0 4px 14px rgba(124,58,237,0.3)'
                              : '0 4px 14px rgba(249,115,22,0.3)',
                            border: 'none',
                            cursor: downloading ? 'not-allowed' : 'pointer',
                            opacity: downloading ? 0.55 : 1,
                            transition: 'opacity 0.2s',
                          }}
                        >
                          {downloading
                            ? <FiLoader size={13} style={{ animation: 'spin 1s linear infinite' }} />
                            : <FiDownload size={13} />
                          }
                          {downloading ? 'Saving...' : 'Download'}
                        </button>
                      </div>
                    </div>
                  </>
                );
              })()}
            </motion.div>

            {/* Next */}
            {filtered.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); navigatePost(1); }}
                style={{
                  position: 'absolute', right: 'clamp(12px, 3vw, 24px)', zIndex: 50,
                  width: '44px', height: '44px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer',
                }}
              >
                <FiChevronRight size={22} />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NoticesHome;