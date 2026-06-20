import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiLoader, FiImage, FiDownload,
  FiChevronLeft, FiChevronRight, FiX
} from 'react-icons/fi';
import { db } from '../firebase/config';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

const isMobile = () =>
  /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
    navigator.userAgent
  );

const Gallery = () => {
  const [images, setImages]               = useState([]);
  const [loading, setLoading]             = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [downloading, setDownloading]     = useState(false);
  const [touchStartX, setTouchStartX]     = useState(0);
  const [touchEndX, setTouchEndX]         = useState(0);

  /* ── Firestore fetch ── */
  useEffect(() => {
    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q,
      (snap) => {
        setImages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  /* ── Navigation ── */
  const navigate = (dir) => {
    if (!selectedImage || images.length === 0) return;
    const idx  = images.findIndex((i) => i.url === selectedImage.url);
    const next = (idx + dir + images.length) % images.length;
    setSelectedImage(images[next]);
  };

  /* ── Keyboard ── */
  useEffect(() => {
    const handler = (e) => {
      if (!selectedImage) return;
      if (e.key === 'ArrowRight') navigate(1);
      if (e.key === 'ArrowLeft')  navigate(-1);
      if (e.key === 'Escape')     setSelectedImage(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedImage, images]);

  /* ── Swipe ── */
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
    if (touchStartX - touchEndX > 50) navigate(1);
    if (touchEndX - touchStartX > 50) navigate(-1);
  };

  /* ── Desktop blob download ── */
  const downloadDesktop = async (rawUrl, title = 'image') => {
    if (downloading) return;
    setDownloading(true);
    const filename = `${title.replace(/\s+/g, '_')}.jpg`;
    try {
      const downloadUrl = rawUrl.includes('cloudinary.com')
        ? rawUrl.replace('/upload/', `/upload/fl_attachment:${filename.replace(/\./g, '_')}/`)
        : rawUrl;
      const response = await fetch(downloadUrl);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const blob    = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a       = document.createElement('a');
      a.href        = blobUrl;
      a.download    = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10_000);
    } catch (err) {
      console.error('Download failed:', err);
      window.open(rawUrl, '_blank', 'noopener');
    } finally {
      setDownloading(false);
    }
  };

  const currentIndex = selectedImage
    ? images.findIndex((i) => i.url === selectedImage.url)
    : -1;

  /* ── Responsive padding helper ── */
  const sectionPadding = {
    /* 40px top so grid never hugs the hero */
    paddingTop: '48px',
    /* Equal 40px gutters on all sides — override any global CSS */
    paddingRight: 'clamp(16px, 4vw, 40px)',
    paddingBottom: '96px',
    paddingLeft: 'clamp(16px, 4vw, 40px)',
    maxWidth: '1152px',
    margin: '0 auto',
    boxSizing: 'border-box',
  };

  return (
    /* ── PAGE WRAPPER ── */
    <div style={{ minHeight: '100vh', background: '#eef0f8' }}>

      {/* ══════════════════════════════════════
          HERO BANNER
      ══════════════════════════════════════ */}
      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #1a237e 0%, #2d3a8c 60%, #3949ab 100%)',
          paddingTop: '120px',
          paddingBottom: '64px',
        }}
      >
        {/* Ghost watermark */}
        <p
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            textTransform: 'uppercase',
            pointerEvents: 'none',
            userSelect: 'none',
            fontSize: 'clamp(60px, 12vw, 130px)',
            color: 'rgba(255,255,255,0.04)',
            letterSpacing: '16px',
            margin: 0,
          }}
        >
          SCHOOL SAGAR VIDHYA
        </p>

        {/* Breadcrumb */}
        <p
          style={{
            position: 'relative',
            zIndex: 10,
            fontSize: '11px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '3px',
            marginBottom: '20px',
            color: 'rgba(255,255,255,0.45)',
          }}
        >
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 8px', color: 'rgba(255,255,255,0.2)' }}>/</span>
          <span style={{ color: '#f97316' }}>Gallery</span>
        </p>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          style={{
            position: 'relative',
            zIndex: 10,
            fontWeight: 900,
            textTransform: 'uppercase',
            color: 'white',
            fontSize: 'clamp(2.5rem, 8vw, 5rem)',
            lineHeight: 1.1,
            margin: 0,
          }}
        >
          विद्या सागर{' '}
          <span style={{ color: '#f97316' }}>Gallery</span>
        </motion.h1>

        {/* Orange accent bar */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          style={{
            height: '3px',
            width: '200px',
            background: '#f97316',
            borderRadius: '9999px',
            margin: '20px auto 0',
            transformOrigin: 'center',
          }}
        />

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            position: 'relative',
            zIndex: 10,
            fontSize: '14px',
            maxWidth: '480px',
            margin: '20px auto 0',
            textAlign: 'center',
            padding: '0 24px',
            color: 'rgba(255,255,255,0.5)',
          }}
        >
          Celebrating learning, friendship, and unforgettable moments.
        </motion.p>
      </section>

      {/* ══════════════════════════════════════
          GALLERY GRID
          All spacing via inline style — guaranteed on all 4 sides
      ══════════════════════════════════════ */}
      <section style={sectionPadding}>

        {loading ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '160px 0',
              color: 'rgba(26,35,126,0.35)',
            }}
          >
            <FiLoader className="animate-spin" size={40} />
          </div>

        ) : images.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              padding: '160px 0',
              color: '#9ca3af',
            }}
          >
            <FiImage size={52} style={{ opacity: 0.3 }} />
            <p style={{ fontSize: '14px', fontWeight: 500, margin: 0 }}>No photos available</p>
          </div>

        ) : (
          /*
           * Grid columns:
           *   mobile  (< 640px) → always 2 columns  (minmax floors at 140px)
           *   tablet  (≥ 640px) → 2–3 columns
           *   desktop (≥ 900px) → 3 columns
           * Using CSS custom property trick: clamp keeps min at 140px on mobile
           * so two cards always fit side-by-side even on a 320px screen.
           */
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(max(140px, calc(33% - 16px)), 1fr))',
              gap: '12px',
            }}
          >
            {images.map((img, index) => (
              <motion.div
                key={img.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                onClick={() => setSelectedImage(img)}
                style={{
                  cursor: 'pointer',
                  overflow: 'hidden',
                  position: 'relative',
                  borderRadius: '16px',
                  aspectRatio: '4/3',
                  background: '#dde0f0',
                  border: '1px solid rgba(26,35,126,0.08)',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                  transition: 'box-shadow 0.3s, transform 0.3s',
                  width: '100%',
                }}
                whileHover={{ y: -3, boxShadow: '0 10px 32px rgba(26,35,126,0.16)' }}
              >
                <img
                  src={img.url}
                  alt={img.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.7s ease',
                  }}
                  className="group-hover:scale-110"
                />
                {/* Hover overlay — uses absolute so it never adds to layout */}
                <div
                  className="gallery-card-overlay"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: '16px',
                    background: 'linear-gradient(to top, rgba(26,35,126,0.82) 0%, transparent 60%)',
                    opacity: 0,
                    transition: 'opacity 0.3s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = 1; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = 0; }}
                >
                  <p
                    style={{
                      color: 'white',
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      margin: 0,
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      maxWidth: '100%',
                    }}
                  >
                    {img.title}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ══════════════════════════════════════
          LIGHTBOX
      ══════════════════════════════════════ */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'clamp(16px, 4vw, 40px)',
              background: 'rgba(10,14,50,0.96)',
            }}
            onClick={() => setSelectedImage(null)}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Close */}
            <button
              onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                zIndex: 50,
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.15)',
                cursor: 'pointer',
              }}
            >
              <FiX size={18} />
            </button>

            {/* Prev */}
            {images.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); navigate(-1); }}
                style={{
                  position: 'absolute',
                  left: 'clamp(12px, 3vw, 24px)',
                  zIndex: 50,
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  cursor: 'pointer',
                }}
              >
                <FiChevronLeft size={22} />
              </button>
            )}

            {/* Image container */}
            <motion.div
              key={selectedImage.url}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ maxWidth: '896px', width: '100%' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  overflow: 'hidden',
                  borderRadius: '16px',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <img
                  src={selectedImage.url}
                  alt={selectedImage.title}
                  style={{
                    width: '100%',
                    objectFit: 'contain',
                    maxHeight: '68vh',
                    background: 'rgba(0,0,0,0.4)',
                    display: 'block',
                  }}
                />
              </div>

              {/* Bottom bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '16px',
                  padding: '0 4px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                  <span
                    style={{
                      flexShrink: 0,
                      fontSize: '12px',
                      fontFamily: 'monospace',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      color: 'rgba(255,255,255,0.4)',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    {currentIndex + 1} / {images.length}
                  </span>
                  <span
                    style={{
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '14px',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {selectedImage.title}
                  </span>
                </div>

                {/* Download — mobile opens, desktop saves */}
                {isMobile() ? (
                  <a
                    href={selectedImage.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                    onTouchEnd={(e) => e.stopPropagation()}
                    style={{
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontWeight: 700,
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      marginLeft: '12px',
                      textDecoration: 'none',
                      background: 'white',
                      color: '#1a237e',
                      padding: '10px 20px',
                      borderRadius: '12px',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
                    }}
                  >
                    <FiDownload size={14} />
                    Open
                  </a>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadDesktop(selectedImage.url, selectedImage.title);
                    }}
                    disabled={downloading}
                    style={{
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontWeight: 700,
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      marginLeft: '12px',
                      background: 'white',
                      color: '#1a237e',
                      padding: '10px 20px',
                      borderRadius: '12px',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
                      border: 'none',
                      cursor: downloading ? 'not-allowed' : 'pointer',
                      opacity: downloading ? 0.5 : 1,
                      transition: 'opacity 0.3s',
                    }}
                  >
                    {downloading
                      ? <FiLoader size={14} className="animate-spin" />
                      : <FiDownload size={14} />
                    }
                    {downloading ? 'Saving...' : 'Download'}
                  </button>
                )}
              </div>
            </motion.div>

            {/* Next */}
            {images.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); navigate(1); }}
                style={{
                  position: 'absolute',
                  right: 'clamp(12px, 3vw, 24px)',
                  zIndex: 50,
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  cursor: 'pointer',
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

export default Gallery;