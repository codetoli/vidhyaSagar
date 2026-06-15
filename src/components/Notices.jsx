import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiLoader, FiX, FiCalendar, FiSearch,
  FiFileText, FiDownload, FiChevronLeft, FiChevronRight
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

/* ── Device detection ── */
const isMobile = () =>
  /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);

/* ── Desktop blob download ── */
const downloadDesktop = async (url, title = 'notice') => {
  const filename = `${title.replace(/\s+/g, '_')}.jpg`;
  try {
    const downloadUrl = url.includes('cloudinary.com')
      ? url.replace('/upload/', `/upload/fl_attachment:${filename.replace(/\./g, '_')}/`)
      : url;
    const res = await fetch(downloadUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob    = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), { href: blobUrl, download: filename });
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(blobUrl), 10_000);
  } catch {
    window.open(url, '_blank', 'noopener');
  }
};

/* ══════════════════════════════════════════════
   NOTICE CARD  — improved layout
══════════════════════════════════════════════ */
const NoticeCard = ({ post, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.45 }}
    onClick={() => onClick(post)}
    style={{
      width: '100%',
      cursor: 'pointer',
      background: 'white',
      borderRadius: '18px',
      overflow: 'hidden',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      border: '1px solid rgba(26,35,126,0.08)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'box-shadow 0.3s, transform 0.3s',
    }}
    whileHover={{ y: -4, boxShadow: '0 12px 36px rgba(26,35,126,0.14)' }}
  >
    {/* ── Image / placeholder ── */}
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '16/9',
        overflow: 'hidden',
        background: '#e8eaf6',
        flexShrink: 0,
      }}
    >
      {post?.imageUrl ? (
        <img
          src={post.imageUrl}
          alt={post?.title || 'Notice'}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transition: 'transform 0.7s ease',
          }}
          className="group-hover:scale-105"
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #1a237e, #3949ab)',
          }}
        >
          <FiFileText size={36} style={{ color: 'rgba(255,255,255,0.25)' }} />
        </div>
      )}

      {/* Notice badge */}
      <span
        style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          background: '#f97316',
          color: 'white',
          fontSize: '9px',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          padding: '4px 10px',
          borderRadius: '999px',
        }}
      >
        Notice
      </span>
    </div>

    {/* ── Card body ── */}
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        padding: '18px 20px 20px',
      }}
    >
      {/* Date */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          fontSize: '11px',
          fontWeight: 600,
          color: 'rgba(26,35,126,0.4)',
          marginBottom: '8px',
        }}
      >
        <FiCalendar size={11} />
        {post.date ||
          post.createdAt?.toDate?.()?.toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
          }) || '—'}
      </div>

      {/* Title */}
      <h3
        style={{
          margin: 0,
          fontWeight: 900,
          fontSize: '15px',
          lineHeight: 1.35,
          color: '#1a237e',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          marginBottom: '8px',
          transition: 'color 0.2s',
        }}
      >
        {post.title}
      </h3>

      {/* Excerpt */}
      <p
        style={{
          margin: 0,
          fontSize: '13px',
          color: '#6b7280',
          lineHeight: 1.6,
          flex: 1,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {post.content || post.description || 'Click to read this notice.'}
      </p>

      {/* Footer row */}
      <div
        style={{
          marginTop: '16px',
          paddingTop: '12px',
          borderTop: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: '#1a237e',
          }}
        >
          Read more →
        </span>
        <span
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'rgba(26,35,126,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FiChevronRight size={13} style={{ color: '#1a237e' }} />
        </span>
      </div>
    </div>
  </motion.div>
);

/* ══════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════ */
const Notices = () => {
  const [posts, setPosts]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchQuery, setSearchQuery]   = useState('');
  const [downloading, setDownloading]   = useState(false);
  const [touchStartX, setTouchStartX]   = useState(0);
  const [touchEndX, setTouchEndX]       = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    const q = query(collection(db, 'notices'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  /* ── Filtered posts ── */
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

  /* ── Lightbox nav ── */
  const navigatePost = (dir) => {
    if (!selectedPost || filtered.length === 0) return;
    const idx  = filtered.findIndex(p => p.id === selectedPost.id);
    const next = (idx + dir + filtered.length) % filtered.length;
    setSelectedPost(filtered[next]);
  };

  /* ── Keyboard ── */
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
    if (touchStartX - touchEndX > 50) navigatePost(1);
    if (touchEndX - touchStartX > 50) navigatePost(-1);
  };

  const handleDesktopDownload = async (e, url, title) => {
    e.stopPropagation();
    setDownloading(true);
    await downloadDesktop(url, title);
    setDownloading(false);
  };

  const currentIndex = selectedPost
    ? filtered.findIndex(p => p.id === selectedPost.id)
    : -1;

  /* ── Shared spacing (mirrors Gallery exactly) ── */
  const sectionPadding = {
    paddingTop: '48px',
    paddingRight: 'clamp(16px, 4vw, 40px)',
    paddingBottom: '96px',
    paddingLeft: 'clamp(16px, 4vw, 40px)',
    maxWidth: '1152px',
    margin: '0 auto',
    boxSizing: 'border-box',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#eef0f8' }}>

      {/* ══════════════════════════════════════
          HERO — mirrors Gallery hero
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
          <span style={{ color: '#f97316' }}>Notices</span>
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
          <span style={{ color: '#f97316' }}>Notices</span>
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
          Stay updated with the latest announcements, events, and school notices.
        </motion.p>
      </section>

      {/* ══════════════════════════════════════
          SEARCH BAR — sits between hero and grid,
          styled as a standalone floating bar
      ══════════════════════════════════════ */}
      <div
        style={{
          maxWidth: '1152px',
          margin: '0 auto',
          padding: '32px clamp(16px, 4vw, 40px) 0',
          boxSizing: 'border-box',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: 'white',
            borderRadius: '16px',
            padding: '6px 6px 6px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 2px 16px rgba(26,35,126,0.09)',
            border: '1px solid rgba(26,35,126,0.08)',
          }}
        >
          <FiSearch size={16} style={{ color: 'rgba(26,35,126,0.3)', flexShrink: 0 }} />

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notices by title, description or date…"
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '14px',
              color: '#1a237e',
              background: 'transparent',
              padding: '10px 0',
              minWidth: 0,
            }}
          />

          {/* Result count pill */}
          {searchQuery && (
            <span
              style={{
                flexShrink: 0,
                fontSize: '11px',
                fontWeight: 700,
                color: '#f97316',
                background: 'rgba(249,115,22,0.08)',
                border: '1px solid rgba(249,115,22,0.2)',
                borderRadius: '999px',
                padding: '4px 12px',
                whiteSpace: 'nowrap',
              }}
            >
              {filtered.length} found
            </span>
          )}

          {/* Clear button */}
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                flexShrink: 0,
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                border: 'none',
                background: 'rgba(26,35,126,0.05)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#1a237e',
              }}
            >
              <FiX size={14} />
            </button>
          ) : (
            /* Decorative search pill on the right when idle */
            <span
              style={{
                flexShrink: 0,
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'white',
                background: '#1a237e',
                borderRadius: '10px',
                padding: '10px 18px',
              }}
            >
              Search
            </span>
          )}
        </motion.div>
      </div>

      {/* ══════════════════════════════════════
          GRID — same spacing as Gallery
      ══════════════════════════════════════ */}
      <section style={sectionPadding}>

        {/* Section label (hidden during search) */}
        {!searchQuery && (
          <div style={{ marginBottom: '28px', textAlign: 'center' }}>
            <p
              style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '3px',
                color: '#d97706',
                margin: '0 0 6px',
              }}
            >
              Latest Updates
            </p>
            <h2
              style={{
                fontSize: 'clamp(1.4rem, 3vw, 1.9rem)',
                fontWeight: 900,
                color: '#1a237e',
                margin: 0,
              }}
            >
              All Notices
            </h2>
          </div>
        )}

        {loading ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '160px 0',
              gap: '16px',
              color: 'rgba(26,35,126,0.3)',
            }}
          >
            <FiLoader className="animate-spin" size={40} />
            <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '3px', margin: 0 }}>
              Loading notices...
            </p>
          </div>

        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '160px 0',
              gap: '16px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: 'rgba(26,35,126,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
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
                  marginTop: '8px',
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: '#ef4444',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Clear search
              </button>
            )}
          </motion.div>

        ) : (
          /*
           * Grid columns (inline, no Tailwind purge risk):
           *   mobile  (< ~480px) → 1 column   minmax floors at 300px
           *   tablet  (≥ ~480px) → 2 columns
           *   desktop (≥ ~960px) → 3 columns
           */
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '24px',
            }}
          >
            {filtered.map((post) => (
              <NoticeCard key={post.id} post={post} onClick={setSelectedPost} />
            ))}
          </div>
        )}
      </section>

      {/* ══════════════════════════════════════
          LIGHTBOX MODAL — improved preview
      ══════════════════════════════════════ */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
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
            onClick={() => setSelectedPost(null)}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Close */}
            <button
              onClick={(e) => { e.stopPropagation(); setSelectedPost(null); }}
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
            {filtered.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); navigatePost(-1); }}
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

            {/* Modal card */}
            <motion.div
              key={selectedPost.id}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                maxWidth: '720px',
                width: '100%',
                maxHeight: '88vh',
                overflowY: 'auto',
                borderRadius: '20px',
                background: 'white',
                boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* ── Hero image with gradient fade ── */}
              {selectedPost.imageUrl && (
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '16/9',
                    overflow: 'hidden',
                    borderRadius: '20px 20px 0 0',
                  }}
                >
                  <img
                    src={selectedPost.imageUrl}
                    alt={selectedPost.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  {/* Bottom fade so text floats over cleanly */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, white 0%, transparent 55%)',
                    }}
                  />
                  {/* Notice badge on image */}
                  <span
                    style={{
                      position: 'absolute',
                      top: '16px',
                      left: '16px',
                      background: '#f97316',
                      color: 'white',
                      fontSize: '9px',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.12em',
                      padding: '5px 12px',
                      borderRadius: '999px',
                    }}
                  >
                    Notice
                  </span>
                </div>
              )}

              {/* ── Body ── */}
              <div
                style={{
                  padding: 'clamp(20px, 4vw, 40px)',
                  /* pull up slightly when image exists so title overlaps the fade */
                  marginTop: selectedPost.imageUrl ? '-36px' : '0',
                  position: 'relative',
                }}
              >
                {/* Date badge */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: '#1a237e',
                    background: 'rgba(26,35,126,0.05)',
                    border: '1px solid rgba(26,35,126,0.1)',
                    borderRadius: '999px',
                    padding: '6px 14px',
                    marginBottom: '16px',
                  }}
                >
                  <FiCalendar size={11} />
                  {selectedPost.date ||
                    selectedPost.createdAt?.toDate?.()?.toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    }) || '—'}
                </div>

                {/* Title */}
                <h2
                  style={{
                    fontWeight: 900,
                    fontSize: 'clamp(1.3rem, 3vw, 2rem)',
                    lineHeight: 1.25,
                    color: '#1a237e',
                    margin: '0 0 16px',
                  }}
                >
                  {selectedPost.title}
                </h2>

                {/* Orange divider */}
                <div
                  style={{
                    width: '48px',
                    height: '3px',
                    background: '#f97316',
                    borderRadius: '9999px',
                    marginBottom: '20px',
                  }}
                />

                {/* Content */}
                <p
                  style={{
                    color: '#4b5563',
                    fontSize: '15px',
                    lineHeight: 1.75,
                    whiteSpace: 'pre-wrap',
                    margin: 0,
                  }}
                >
                  {selectedPost.content || selectedPost.description}
                </p>
              </div>

              {/* ── Footer bar ── */}
              {selectedPost.imageUrl && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px clamp(20px, 4vw, 40px)',
                    borderTop: '1px solid #f1f5f9',
                  }}
                >
                  <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#94a3b8' }}>
                    {currentIndex + 1} / {filtered.length}
                  </span>

                  {isMobile() ? (
                    <a
                      href={selectedPost.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      onTouchStart={(e) => e.stopPropagation()}
                      onTouchMove={(e) => e.stopPropagation()}
                      onTouchEnd={(e) => e.stopPropagation()}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        textDecoration: 'none',
                        background: '#1a237e',
                        padding: '10px 20px',
                        borderRadius: '10px',
                        boxShadow: '0 4px 14px rgba(26,35,126,0.25)',
                      }}
                    >
                      <FiDownload size={13} />
                      Open
                    </a>
                  ) : (
                    <button
                      onClick={(e) => handleDesktopDownload(e, selectedPost.imageUrl, selectedPost.title)}
                      disabled={downloading}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        background: '#1a237e',
                        padding: '10px 20px',
                        borderRadius: '10px',
                        boxShadow: '0 4px 14px rgba(26,35,126,0.25)',
                        border: 'none',
                        cursor: downloading ? 'not-allowed' : 'pointer',
                        opacity: downloading ? 0.5 : 1,
                      }}
                    >
                      {downloading
                        ? <FiLoader size={13} className="animate-spin" />
                        : <FiDownload size={13} />
                      }
                      {downloading ? 'Saving...' : 'Download'}
                    </button>
                  )}
                </div>
              )}
            </motion.div>

            {/* Next */}
            {filtered.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); navigatePost(1); }}
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

export default Notices;