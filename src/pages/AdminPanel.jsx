// src/pages/admin/AdminPanel.jsx
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiTrash2, FiLoader, FiCheckCircle, FiAlertCircle,
  FiX, FiImage, FiGrid, FiBell, FiLogOut, FiUploadCloud,
  FiCalendar, FiType, FiAlignLeft, FiMenu, FiDownload,
  FiFileText, FiExternalLink
} from 'react-icons/fi';
import { db, auth } from '../firebase/config';
import {
  collection, addDoc, deleteDoc,
  doc, onSnapshot, query, orderBy, serverTimestamp,getDocs
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useCloudinaryUpload } from '../hooks/useCloudinaryUpload';

const EMPTY_NOTICE = { title: '', description: '' };

const isPdf = (url) =>
  url && (
    url.toLowerCase().endsWith('.pdf') ||
    /\/image\/upload\/.+\.pdf/i.test(url)
  );

const getFileName = (url) => {
  if (!url) return 'attachment';
  try {
    const parts = new URL(url).pathname.split('/');
    return decodeURIComponent(parts[parts.length - 1]);
  } catch {
    return 'attachment';
  }
};

/* ─── TOAST ─── */
const Toast = ({ toast }) => (
  <AnimatePresence>
    {toast && (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999]
          flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-3.5
          text-base font-semibold text-white rounded-2xl shadow-2xl backdrop-blur-sm
          max-w-[calc(100vw-2rem)]
          ${toast.type === 'success'
            ? 'bg-emerald-500/95 border border-emerald-400/30'
            : 'bg-red-500/95 border border-red-400/30'}`}
      >
        {toast.type === 'success'
          ? <FiCheckCircle size={16} className="shrink-0" />
          : <FiAlertCircle size={16} className="shrink-0" />}
        <span className="truncate">{toast.msg}</span>
      </motion.div>
    )}
  </AnimatePresence>
);

/* ─── DROPZONE ─── */
const DropZone = ({ preview, onFile, onClear, label, accent = 'indigo' }) => {
  const ref = useRef();
  const accentRing = accent === 'violet'
    ? 'border-violet-500/40 bg-violet-500/5 hover:border-violet-500/60'
    : 'border-indigo-500/40 bg-indigo-500/5 hover:border-indigo-500/60';
  const accentIcon = accent === 'violet'
    ? 'text-violet-400 bg-violet-500/10 border-violet-500/20'
    : 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
  return (
    <div
      onClick={() => ref.current.click()}
      className={`w-full relative cursor-pointer rounded-xl border-2 border-dashed
        transition-all duration-200 flex flex-col items-center justify-center
        ${preview
          ? `${accentRing} p-3 min-h-[180px]`
          : `border-slate-700 hover:bg-slate-800/40 bg-[#1e2334] min-h-[160px] p-6 ${accentRing.split(' ').pop()}`}`}
    >
      {preview ? (
        <div className="relative w-full flex items-center justify-center">
          <img src={preview} className="max-h-44 object-contain rounded-lg" alt="preview" />
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onClear(); }}
            className="absolute -top-1 -right-1 w-7 h-7 bg-red-500 hover:bg-red-600
              text-white flex items-center justify-center rounded-full shadow-lg transition-colors"
          >
            <FiX size={12} />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2.5 select-none text-center">
          <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${accentIcon}`}>
            <FiUploadCloud size={22} />
          </div>
          <p className="text-slate-200 text-base font-medium">{label}</p>
          <p className="text-slate-500 text-xs">PNG, JPG · max 2 MB</p>
        </div>
      )}
      <input ref={ref} type="file" accept="image/*" onChange={onFile} className="hidden" />
    </div>
  );
};

/* ─── PDF PREVIEW BADGE ─── */
const PdfBadge = ({ fileName, onClear }) => (
  <div className="flex items-center gap-3 bg-violet-500/10 border border-violet-500/30 rounded-xl px-4 py-3">
    <div className="w-9 h-9 rounded-lg bg-violet-500/20 flex items-center justify-center shrink-0">
      <FiFileText size={18} className="text-violet-400" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-slate-200 text-base font-semibold truncate">{fileName}</p>
      <p className="text-slate-500 text-[11px] mt-0.5">PDF selected</p>
    </div>
    {onClear && (
      <button
        type="button"
        onClick={onClear}
        className="w-7 h-7 bg-red-500/20 hover:bg-red-500/40 text-red-400
          flex items-center justify-center rounded-lg transition-colors shrink-0"
      >
        <FiX size={13} />
      </button>
    )}
  </div>
);

/* ─── FIELD ─── */
const Field = ({ icon: Icon, label, children, accent = 'indigo' }) => (
  <div className="w-full space-y-2">
    <label className="flex items-center gap-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
      <Icon size={11} className={accent === 'violet' ? 'text-violet-400' : 'text-indigo-400'} />
      {label}
    </label>
    {children}
  </div>
);

/* ─── CARD HEADER ─── */
const CardHeader = ({ icon: Icon, title, subtitle, accent = 'indigo', right }) => {
  const bg = accent === 'violet' ? 'bg-violet-500/15' : 'bg-indigo-500/15';
  const txt = accent === 'violet' ? 'text-violet-400' : 'text-indigo-400';
  return (
    <div className="px-5 sm:px-6 py-4 border-b border-slate-700/50 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
          <Icon size={16} className={txt} />
        </div>
        <div className="min-w-0">
          <p className="text-slate-100 text-base font-semibold truncate">{title}</p>
          <p className="text-slate-500 text-xs truncate">{subtitle}</p>
        </div>
      </div>
      {right}
    </div>
  );
};

/* ─── GALLERY TAB ─── */
const GalleryTab = ({ showToast }) => {
  const [images, setImages]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [title, setTitle]           = useState('');
  const [preview, setPreview]       = useState(null);
  const [file, setFile]             = useState(null);
  const [deleting, setDeleting]     = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { upload, uploading }       = useCloudinaryUpload();

  useEffect(() => {
    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snap) => {
      setImages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { showToast('error', 'Pick an image first.'); return; }
    setSubmitting(true);
    try {
      const result = await upload(file);
      await addDoc(collection(db, 'gallery'), {
        url: result.secure_url,
        title: title.trim() || 'Untitled Event',
        createdAt: serverTimestamp(),
      });
      setTitle(''); setFile(null); setPreview(null);
      showToast('success', 'Photo published.');
    } catch {
      showToast('error', 'Upload failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[400px_minmax(0,1fr)] gap-5 lg:gap-6 items-start">
      {/* Upload form */}
      <div className="bg-[#181c27] rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden">
        <CardHeader icon={FiImage} title="Add photo" subtitle="Upload to the public gallery" />
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
          <Field icon={FiType} label="Event title">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Annual Sports Day 2025"
              className="w-full bg-[#1e2334] text-slate-100 placeholder-slate-500
                py-2.5 px-3.5 text-base rounded-xl border border-slate-700/60
                focus:outline-none focus:border-indigo-500/70 focus:ring-2
                focus:ring-indigo-500/20 transition"
            />
          </Field>

          <Field icon={FiUploadCloud} label="Photo">
            <DropZone
              preview={preview}
              label="Click to upload photo"
              onFile={(e) => {
                const f = e.target.files[0];
                if (!f) return;
                if (f.size > 5 * 1024 * 1024) {
                  showToast('error', 'Image must be less than 5 MB.');
                  return;
                }
                setFile(f);
                setPreview(URL.createObjectURL(f));
              }}
              onClear={() => { setPreview(null); setFile(null); }}
            />
          </Field>

          {uploading && (
            <div className="flex items-center gap-2 text-xs text-indigo-400">
              <FiLoader size={12} className="animate-spin" /> Uploading please wait…
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || uploading}
            className="w-full py-3 rounded-xl text-base font-bold tracking-wide
              bg-gradient-to-r from-indigo-500 to-violet-500
              hover:from-indigo-400 hover:to-violet-400
              disabled:opacity-40 disabled:cursor-not-allowed
              text-white shadow-lg shadow-indigo-500/20 transition-all"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <FiLoader size={13} className="animate-spin" /> Publishing…
              </span>
            ) : 'Publish Photo'}
          </button>
        </form>
      </div>

      {/* Live feed */}
      <div className="bg-[#181c27] rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden">
        <CardHeader
          icon={FiGrid}
          title="Gallery"
          subtitle={`${images.length} photo${images.length !== 1 ? 's' : ''} published`}
          right={<span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.5)]" />}
        />
        <div className="p-5 sm:p-6 min-h-[320px]">
          {loading ? (
            <div className="flex justify-center py-20">
              <FiLoader size={24} className="animate-spin text-slate-500" />
            </div>
          ) : images.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-700/40 flex items-center justify-center">
                <FiImage size={24} className="text-slate-500" />
              </div>
              <p className="text-slate-400 text-base font-medium">No photos yet</p>
              <p className="text-slate-600 text-xs">Uploaded photos will appear here</p>
            </div>
            ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="relative aspect-square rounded-xl overflow-hidden
                    bg-slate-700/30 group border border-slate-700/40"
                >
                  <img
                    src={img.url}
                    alt={img.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent
                    opacity-20 group-hover:opacity-100 transition-opacity flex flex-col
                    items-center justify-end p-3 gap-2">
                    <p className="text-white text-[11px] font-semibold text-center line-clamp-2 leading-tight">
                      {img.title}
                    </p>
                    <button
                      onClick={() => {
                        if (window.confirm('Delete this photo?')) {
                          setDeleting(img.id);
                          deleteDoc(doc(db, 'gallery', img.id))
                            .then(() => showToast('success', 'Deleted.'))
                            .finally(() => setDeleting(null));
                        }
                      }}
                      disabled={deleting === img.id}
                      className="w-8 h-8 bg-red-500/95 hover:bg-red-500 text-white
                        rounded-lg flex items-center justify-center transition-colors shadow"
                    >
                      {deleting === img.id
                        ? <FiLoader size={12} className="animate-spin" />
                        : <FiTrash2 size={12} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── NOTICES TAB ─── */
const NoticesTab = ({ showToast }) => {
  const [notices, setNotices]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [form, setForm]             = useState(EMPTY_NOTICE);
  const [file, setFile]             = useState(null);
  const [preview, setPreview]       = useState(null);
  const [fileIsPdf, setFileIsPdf]   = useState(false);
  const [deleting, setDeleting]     = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef                = useRef();
  const { upload, uploading }       = useCloudinaryUpload();

  useEffect(() => {
    const q = query(collection(db, 'notices'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snap) => {
      setNotices(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
  }, []);

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setFileIsPdf(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) {
      showToast('error', 'File must be less than 10 MB.');
      return;
    }
    setFile(f);
    if (f.type === 'application/pdf') {
      setFileIsPdf(true);
      setPreview(null);
    } else {
      setFileIsPdf(false);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { showToast('error', 'Title is required.'); return; }
    setSubmitting(true);
    try {
      let imageUrl = '';
      if (file) {
        const result = await upload(file);
        imageUrl = result.secure_url;
      }

      const today = new Date().toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
      });

      await addDoc(collection(db, 'notices'), {
        title: form.title.trim(),
        description: form.description.trim(),
        date: today,
        imageUrl,
        createdAt: serverTimestamp(),
      });

      showToast('success', 'Notice published.');
      setForm(EMPTY_NOTICE);
      clearFile();
    } catch {
      showToast('error', 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const getAttachment = (n) => {
    const url = n.imageUrl || n.attachmentUrl || n.pdfUrl || '';
    const type = url ? (isPdf(url) ? 'pdf' : 'image') : '';
    return { url, type };
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[400px_minmax(0,1fr)] gap-5 lg:gap-6 items-start">
      {/* Compose form */}
      <div className="bg-[#181c27] rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden">
        <CardHeader icon={FiBell} title="New notice" subtitle="Publish to the school notice board" accent="violet" />
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
          <Field icon={FiType} label="Title *" accent="violet">
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Holiday notice — Dashain 2025"
              className="w-full bg-[#1e2334] text-slate-100 placeholder-slate-500
                py-2.5 px-3.5 text-base rounded-xl border border-slate-700/60
                focus:outline-none focus:border-violet-500/70 focus:ring-2
                focus:ring-violet-500/20 transition"
            />
          </Field>

          <Field icon={FiAlignLeft} label="Description" accent="violet">
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Brief details about the notice…"
              className="w-full bg-[#1e2334] text-slate-100 placeholder-slate-500
                py-2.5 px-3.5 text-base rounded-xl border border-slate-700/60
                focus:outline-none focus:border-violet-500/70 focus:ring-2
                focus:ring-violet-500/20 transition resize-none"
            />
          </Field>

          {/* ── Attachment Field ── */}
          <Field icon={FiUploadCloud} label="Attachment (Image or PDF)" accent="violet">
            {file ? (
              fileIsPdf ? (
                <PdfBadge fileName={file.name} onClear={clearFile} />
              ) : (
                <div className="relative rounded-xl overflow-hidden border border-violet-500/30 bg-violet-500/5">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full max-h-44 object-contain p-2"
                  />
                  <button
                    type="button"
                    onClick={clearFile}
                    className="absolute top-2 right-2 w-7 h-7 bg-red-500 hover:bg-red-600
                      text-white flex items-center justify-center rounded-full shadow-lg transition-colors"
                  >
                    <FiX size={12} />
                  </button>
                </div>
              )
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full cursor-pointer rounded-xl border-2 border-dashed
                  border-violet-500/40 bg-violet-500/5 hover:border-violet-500/60
                  min-h-[160px] flex flex-col items-center justify-center
                  text-center p-6 transition-all"
              >
                <div className="w-12 h-12 rounded-2xl border border-violet-500/20 bg-violet-500/10
                  flex items-center justify-center mb-3">
                  <FiUploadCloud size={22} className="text-violet-400" />
                </div>
                <p className="text-slate-200 text-base font-medium">Click to upload Image or PDF</p>
                <p className="text-slate-500 text-xs mt-1">JPG, PNG, PDF · max 10 MB</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf,application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />
          </Field>

          {uploading && (
            <div className="flex items-center gap-2 text-xs text-violet-400">
              <FiLoader size={12} className="animate-spin" /> Uploading…
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || uploading}
            className="w-full py-3 rounded-xl text-base font-bold tracking-wide
              bg-gradient-to-r from-violet-500 to-fuchsia-500
              hover:from-violet-400 hover:to-fuchsia-400
              disabled:opacity-40 disabled:cursor-not-allowed
              text-white shadow-lg shadow-violet-500/20 transition-all"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <FiLoader size={13} className="animate-spin" /> Publishing…
              </span>
            ) : 'Publish Notice'}
          </button>
        </form>
      </div>

      {/* Live feed */}
      <div className="bg-[#181c27] rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden">
        <CardHeader
          icon={FiBell}
          title="Notice board"
          subtitle={`${notices.length} active notice${notices.length !== 1 ? 's' : ''}`}
          accent="violet"
          right={<span className="w-2 h-2 rounded-full bg-violet-400 shadow-[0_0_8px_2px_rgba(167,139,250,0.5)]" />}
        />
        <div className="p-5 sm:p-6 min-h-[320px]">
          {loading ? (
            <div className="flex justify-center py-20">
              <FiLoader size={24} className="animate-spin text-slate-500" />
            </div>
          ) : notices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-700/40 flex items-center justify-center">
                <FiBell size={24} className="text-slate-500" />
              </div>
              <p className="text-slate-400 text-base font-medium">No notices yet</p>
              <p className="text-slate-600 text-xs">Published notices will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notices.map((n) => {
                const { url: attachUrl, type: attachType } = getAttachment(n);
                return (
                  <div
                    key={n.id}
                    className="group bg-[#1e2334] rounded-xl border border-slate-700/40
                      hover:border-violet-500/30 transition-colors overflow-hidden"
                  >
                    {/* Main row */}
                    <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] gap-3 sm:gap-4 p-3 sm:p-4">

                      {/* Thumbnail / icon */}
                      <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden
                        bg-slate-700/50 border border-slate-600/40 flex items-center justify-center">
                        {attachType === 'image' ? (
                          <img src={attachUrl} alt={n.title} className="w-full h-full object-cover" />
                        ) : attachType === 'pdf' ? (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-1 bg-violet-500/10">
                            <FiFileText size={22} className="text-violet-400" />
                            <span className="text-[9px] font-bold text-violet-400 uppercase tracking-wider">PDF</span>
                          </div>
                        ) : (
                          <FiBell size={20} className="text-slate-500" />
                        )}
                      </div>

                      {/* Text */}
                      <div className="min-w-0 flex flex-col justify-center">
                        <p className="text-slate-100 text-base font-semibold line-clamp-1">{n.title}</p>
                        {n.description && (
                          <p className="text-slate-400 text-xs line-clamp-2 mt-1 leading-relaxed">{n.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <div className="flex items-center gap-1.5">
                            <FiCalendar size={10} className="text-slate-600" />
                            <span className="text-slate-600 text-[10px]">{n.date}</span>
                          </div>
                          {attachType === 'pdf' && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold
                              text-violet-400 bg-violet-500/10 border border-violet-500/20
                              rounded-md px-1.5 py-0.5">
                              <FiFileText size={9} /> PDF
                            </span>
                          )}
                          {attachType === 'image' && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold
                              text-indigo-400 bg-indigo-500/10 border border-indigo-500/20
                              rounded-md px-1.5 py-0.5">
                              <FiImage size={9} /> Image
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => {
                          if (window.confirm('Delete this notice?')) {
                            setDeleting(n.id);
                            deleteDoc(doc(db, 'notices', n.id))
                              .then(() => showToast('success', 'Deleted.'))
                              .finally(() => setDeleting(null));
                          }
                        }}
                        disabled={deleting === n.id}
                        className="shrink-0 self-start w-8 h-8 bg-slate-700/50 hover:bg-red-500/90
                          text-slate-400 hover:text-white rounded-xl flex items-center justify-center
                          md:opacity-0 md:group-hover:opacity-100 transition-all"
                      >
                        {deleting === n.id
                          ? <FiLoader size={12} className="animate-spin" />
                          : <FiTrash2 size={12} />}
                      </button>
                    </div>

                    {/* Attachment action bar */}
                    {attachUrl && (
                      <div className="border-t border-slate-700/40 px-3 sm:px-4 py-2.5
                        flex items-center justify-between gap-3">
                        <p className="text-slate-600 text-[11px] truncate flex-1">
                          {attachType === 'pdf' ? getFileName(attachUrl) : 'Image attachment'}
                        </p>
                        <div className="flex items-center gap-2 shrink-0">
                          <a
                            href={attachUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-[11px] font-semibold
                              text-slate-400 hover:text-violet-300 transition-colors px-2 py-1
                              rounded-lg hover:bg-violet-500/10"
                          >
                            <FiExternalLink size={12} />
                            {attachType === 'pdf' ? 'View' : 'Open'}
                          </a>
                          <a
                            href={attachUrl}
                            download={attachType === 'pdf' ? getFileName(attachUrl) : undefined}
                            target={attachType === 'pdf' ? '_self' : '_blank'}
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-[11px] font-semibold
                              text-violet-400 hover:text-violet-300 bg-violet-500/10
                              hover:bg-violet-500/20 border border-violet-500/20
                              hover:border-violet-500/40 transition-all px-2.5 py-1 rounded-lg"
                          >
                            <FiDownload size={12} />
                            Download
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


/* ─── GALLERY TAB ─── */
const BannerTab = ({ showToast }) => {
  const [images, setImages]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [title, setTitle]           = useState('');
  const [preview, setPreview]       = useState(null);
  const [file, setFile]             = useState(null);
  const [deleting, setDeleting]     = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { upload, uploading }       = useCloudinaryUpload();

  useEffect(() => {
    const q = query(collection(db, 'banner'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snap) => {
      setImages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { showToast('error', 'Pick an image first.'); return; }
    setSubmitting(true);
    try {
      const result = await upload(file);
     const bannerRef = collection(db,'banner');

const snap = await getDocs(bannerRef);


/* remove old banners */

for(const item of snap.docs){

    await deleteDoc(

        doc(db,'banner',item.id)

    );

}


/* upload new banner */

await addDoc(

bannerRef,

{
    url:result.secure_url,
    title:title.trim() || 'Admission Banner',

    createdAt:serverTimestamp()
}

);
      setTitle(''); setFile(null); setPreview(null);
      showToast('success', 'Photo published.');
    } catch {
      showToast('error', 'Upload failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[400px_minmax(0,1fr)] gap-5 lg:gap-6 items-start">
      {/* Upload form */}
      <div className="bg-[#181c27] rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden">
        <CardHeader icon={FiImage} title="Add Banner" subtitle="Upload to the public Banner" />
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
          <Field icon={FiType} label="Banner Title">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Annual Sports Day 2025"
              className="w-full bg-[#1e2334] text-slate-100 placeholder-slate-500
                py-2.5 px-3.5 text-base rounded-xl border border-slate-700/60
                focus:outline-none focus:border-indigo-500/70 focus:ring-2
                focus:ring-indigo-500/20 transition"
            />
          </Field>

          <Field icon={FiUploadCloud} label="Banner picture">
            <DropZone
              preview={preview}
              label="Click to upload Banner Picture"
              onFile={(e) => {
                const f = e.target.files[0];
                if (!f) return;
                if (f.size > 5 * 1024 * 1024) {
                  showToast('error', 'Picture must be less than 5 MB.');
                  return;
                }
                setFile(f);
                setPreview(URL.createObjectURL(f));
              }}
              onClear={() => { setPreview(null); setFile(null); }}
            />
          </Field>

          {uploading && (
            <div className="flex items-center gap-2 text-xs text-indigo-400">
              <FiLoader size={12} className="animate-spin" /> Uploading please wait…
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || uploading}
            className="w-full py-3 rounded-xl text-base font-bold tracking-wide
              bg-gradient-to-r from-indigo-500 to-violet-500
              hover:from-indigo-400 hover:to-violet-400
              disabled:opacity-40 disabled:cursor-not-allowed
              text-white shadow-lg shadow-indigo-500/20 transition-all"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <FiLoader size={13} className="animate-spin" /> Publishing…
              </span>
            ) : 'Publish Banner'}
          </button>
        </form>
      </div>

      {/* Live feed */}
      <div className="bg-[#181c27] rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden">
        <CardHeader
          icon={FiGrid}
          title="Banner"
          subtitle={`${images.length} photo${images.length !== 1 ? 's' : ''} published`}
          right={<span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.5)]" />}
        />
        <div className="p-5 sm:p-6 min-h-[320px]">
          {loading ? (
            <div className="flex justify-center py-20">
              <FiLoader size={24} className="animate-spin text-slate-500" />
            </div>
          ) : images.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-700/40 flex items-center justify-center">
                <FiImage size={24} className="text-slate-500" />
              </div>
              <p className="text-slate-400 text-base font-medium">No Banner yet</p>
              <p className="text-slate-600 text-xs">Uploaded Banner will appear here</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="relative aspect-square rounded-xl overflow-hidden
                    bg-slate-700/30 group border border-slate-700/40"
                >
                  <img
                    src={img.url}
                    alt={img.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent
                    opacity-20 group-hover:opacity-100 transition-opacity flex flex-col
                    items-center justify-end p-3 gap-2">
                    <p className="text-white text-[11px] font-semibold text-center line-clamp-2 leading-tight">
                      {img.title}
                    </p>
                    <button
                      onClick={() => {
                        if (window.confirm('Delete this Banner?')) {
                          setDeleting(img.id);
                          deleteDoc(doc(db, 'banner', img.id))
                            .then(() => showToast('success', 'Deleted.'))
                            .finally(() => setDeleting(null));
                        }
                      }}
                      disabled={deleting === img.id}
                      className="w-8 h-8 bg-red-500/95 hover:bg-red-500 text-white
                        rounded-lg flex items-center justify-center transition-colors shadow"
                    >
                      {deleting === img.id
                        ? <FiLoader size={12} className="animate-spin" />
                        : <FiTrash2 size={12} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};






/* ─── NAV ITEM ─── */
const NavItem = ({ icon: Icon, label, active, onClick, count }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-base font-medium
      transition-all duration-150 group
      ${active
        ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/25'
        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/30 border border-transparent'}`}
  >
    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors
      ${active ? 'bg-indigo-500/25' : 'bg-slate-700/50 group-hover:bg-slate-600/50'}`}>
      <Icon size={14} className={active ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'} />
    </div>
    <span className="flex-1 text-left truncate">{label}</span>
    {count != null && (
      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0
        ${active ? 'bg-indigo-500/25 text-indigo-300' : 'bg-slate-700 text-slate-500'}`}>
        {count}
      </span>
    )}
  </button>
);

/* ─── SIDEBAR ─── */
const SidebarContent = ({
activeTab,
setActiveTab,
galCount,
notCount,
bannerCount,
handleLogout,
onNavigate
}) => (
  <>
    <div className="px-5 py-5 border-b border-slate-700/50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600
          flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
          <span className="text-orange-200 text-base font-black">VS</span>
        </div>
        <div className="min-w-0">
          <p className="text-orange-100 text-base font-bold leading-tight truncate">विद्या सागर</p>
          <p className="text-orange-200 text-[10px] font-semibold uppercase tracking-widest">Admin Console</p>
        </div>
      </div>
    </div>

    <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
      <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest px-3 mb-3">
        Workspace
      </p>
      <NavItem icon={FiGrid} label="Gallery" active={activeTab === 'gallery'}
        onClick={() => { setActiveTab('gallery'); onNavigate?.(); }} count={galCount} />
      <NavItem icon={FiBell} label="Notices" active={activeTab === 'notices'}
        onClick={() => { setActiveTab('notices'); onNavigate?.(); }} count={notCount} />

        <NavItem
 icon={FiImage}
 label="Banner"
 active={activeTab==='banner'}
 count={bannerCount}
 onClick={()=>{
    setActiveTab('banner');
    onNavigate?.();
 }}
/>
    </nav>

    <div className="px-3 py-4 border-t border-slate-700/50">
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-base font-medium
          text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent
          hover:border-red-500/20 transition-all"
      >
        <div className="w-7 h-7 rounded-lg bg-slate-700/50 flex items-center justify-center shrink-0">
          <FiLogOut size={13} />
        </div>
        <span className="flex-1 text-left">Sign out</span>
      </button>
    </div>
  </>
);

/* ─── MAIN ─── */
const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('gallery');
  const [toast, setToast]         = useState(null);
  const [galCount, setGalCount]   = useState(0);
  const [notCount, setNotCount]   = useState(0);
  const [bannerCount,setBannerCount]=useState(0);
  const [mobileNav, setMobileNav] = useState(false);
  const navigate                  = useNavigate();

  useEffect(()=>{

 const u1 = onSnapshot(
    collection(db,'gallery'),
    s=>setGalCount(s.size)
 );

 const u2 = onSnapshot(
    collection(db,'notices'),
    s=>setNotCount(s.size)
 );

 const u3 = onSnapshot(
    collection(db,'banner'),
    s=>setBannerCount(s.size)
 );

 return ()=>{
    u1();
    u2();
    u3();
 };

},[]);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#0f1117] text-slate-100 antialiased flex font-sans">
      <Toast toast={toast} />

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 xl:w-72 flex-col shrink-0 border-r border-slate-700/50
        bg-[#13161f] sticky top-0 h-screen">
       <SidebarContent
activeTab={activeTab}
setActiveTab={setActiveTab}
galCount={galCount}
notCount={notCount}
bannerCount={bannerCount}
handleLogout={handleLogout}
/>
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileNav && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileNav(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 32 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-72 max-w-[85vw] flex flex-col
                bg-[#13161f] border-r border-slate-700/50 lg:hidden"
            >
             <SidebarContent
activeTab={activeTab}
setActiveTab={setActiveTab}
galCount={galCount}
notCount={notCount}
bannerCount={bannerCount}
handleLogout={handleLogout}
onNavigate={()=>setMobileNav(false)}
/>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 -mt-5 sm:mt-0">
        <header className="sticky top-0 z-40 bg-[#0f1117]/85 backdrop-blur-md
          border-b border-slate-700/50 px-4 sm:px-6 py-3.5
          grid grid-cols-[auto_minmax(0,1fr)] sm:grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 sm:gap-4">

          <button
            onClick={() => setMobileNav(true)}
            className="lg:hidden w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700
              text-slate-300 flex items-center justify-center transition"
            aria-label="Open menu"
          >
            <FiMenu size={16} />
          </button>

          <div className="min-w-0">
            <h1 className="text-slate-100 text-base sm:text-base font-bold">

{activeTab==='gallery'
 ? 'Gallery'
 : activeTab==='notices'
 ? 'Notices'
 : 'Banner'}

</h1>
           <p className="text-slate-500 text-[11px] sm:text-xs mt-0.5 truncate">
  {activeTab === 'gallery'
    ? 'Upload and manage event photos'
    : activeTab === 'notices'
    ? 'Publish announcements to the board'
    : 'Manage popup banners'}
</p>
           
          </div>

          <button
            onClick={handleLogout}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 text-xs font-semibold
              text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
            aria-label="Sign out"
          >
            <FiLogOut size={14} />
          </button>
        </header>

        <main className="flex-1 p-4 sm:p-5 lg:p-6 xl:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.16, ease: 'easeOut' }}
            >
              {
activeTab==='gallery'

? <GalleryTab showToast={showToast}/>

: activeTab==='notices'

? <NoticesTab showToast={showToast}/>

: <BannerTab showToast={showToast}/>
}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  </div>
  );
};

export default AdminPanel;