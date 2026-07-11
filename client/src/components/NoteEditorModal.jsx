import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FiX } from 'react-icons/fi';
import { wordCount, charCount } from '../utils/helpers';

const COLORS = ['#FAF7F2', '#C89B3C', '#6B8F71', '#5A7D9A', '#B5563C', '#8B6BAE', '#3E7C6B'];

const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline', 'code-block', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    ['clean'],
  ],
};

const NoteEditorModal = ({ open, note, categories, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [color, setColor] = useState(COLORS[0]);
  const [saving, setSaving] = useState(false);
  const autosaveTimer = useRef(null);
  const isDirty = useRef(false);

  useEffect(() => {
    if (open) {
      setTitle(note?.title || '');
      setContent(note?.content || '');
      setCategory(note?.category?._id || note?.category || '');
      setColor(note?.color || COLORS[0]);
      isDirty.current = false;
    }
  }, [open, note]);

  useEffect(() => {
    if (!open || !note?._id) return undefined;
    if (!isDirty.current) return undefined;

    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => {
      handleSave(true);
    }, 2000);

    return () => clearTimeout(autosaveTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content, category, color]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave(false);
      }
    };
    if (open) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  const handleSave = async (silent = false) => {
    if (!title.trim()) return;
    setSaving(true);
    try {
      await onSave({ title, content, category: category || null, color }, silent);
      isDirty.current = false;
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/40 backdrop-blur-sm px-4 py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl rounded-card bg-surface-light dark:bg-surface-dark p-6 shadow-soft-dark"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <input
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  isDirty.current = true;
                }}
                placeholder="Untitled note"
                className="w-full bg-transparent font-display text-2xl font-medium outline-none placeholder:text-graphite/50"
              />
              <button onClick={onClose} className="mt-1 shrink-0 text-graphite hover:text-ink dark:hover:text-paper">
                <FiX size={20} />
              </button>
            </div>

            <div className="quill-editor mb-4">
              <ReactQuill
                theme="snow"
                value={content}
                onChange={(val) => {
                  setContent(val);
                  isDirty.current = true;
                }}
                modules={QUILL_MODULES}
                placeholder="Start writing…"
              />
            </div>

            <div className="mb-4 flex flex-wrap items-center gap-4">
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  isDirty.current = true;
                }}
                className="input-field w-auto"
              >
                <option value="">No category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-1.5">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setColor(c);
                      isDirty.current = true;
                    }}
                    className={`h-6 w-6 rounded-full border-2 transition-transform hover:scale-110 ${
                      color === c ? 'border-ink dark:border-paper' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: c }}
                    aria-label={`Set color ${c}`}
                  />
                ))}
              </div>

              <span className="ml-auto font-mono text-xs text-graphite">
                {wordCount(content)} words · {charCount(content)} characters
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-graphite">
                {saving ? 'Saving…' : 'Ctrl+S to save · autosaves while editing'}
              </span>
              <div className="flex gap-3">
                <button onClick={onClose} className="btn-secondary">
                  Close
                </button>
                <button onClick={() => handleSave(false)} disabled={!title.trim()} className="btn-primary">
                  Save note
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NoteEditorModal;
