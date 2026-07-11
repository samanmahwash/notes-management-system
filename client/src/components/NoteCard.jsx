import { motion } from 'framer-motion';
import { FiStar, FiArchive, FiCopy, FiTrash2, FiShare2 } from 'react-icons/fi';
import { RiPushpinFill, RiPushpinLine } from 'react-icons/ri';
import toast from 'react-hot-toast';
import { stripHtml, wordCount, formatRelative } from '../utils/helpers';

const NoteCard = ({ note, onOpen, onPin, onFavorite, onArchive, onDuplicate, onDelete }) => {
  const handleShare = (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/notes/${note._id}`;
    navigator.clipboard?.writeText(url);
    toast.success('Share link copied (demo only)');
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ y: -3 }}
      onClick={() => onOpen(note)}
      className="folded-corner card group relative flex cursor-pointer flex-col p-5"
      style={{ borderTop: `3px solid ${note.color || '#C89B3C'}` }}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="line-clamp-1 font-display text-base font-medium">{note.title}</h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPin(note._id);
          }}
          className={`shrink-0 transition-colors ${note.pinned ? 'text-gold' : 'text-graphite/50 hover:text-gold'}`}
          aria-label="Toggle pin"
        >
          {note.pinned ? <RiPushpinFill size={17} /> : <RiPushpinLine size={17} />}
        </button>
      </div>

      <p className="line-clamp-4 flex-1 text-sm text-graphite">{stripHtml(note.content) || 'No content yet.'}</p>

      {note.category?.name && (
        <span
          className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium text-white"
          style={{ backgroundColor: note.category.color || '#C89B3C' }}
        >
          {note.category.name}
        </span>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-ink/5 dark:border-paper/10 pt-3 text-xs text-graphite">
        <span>{formatRelative(note.updatedAt)} · {wordCount(note.content)} words</span>
        <div className="flex items-center gap-2.5 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFavorite(note._id);
            }}
            aria-label="Toggle favorite"
            className={note.favorite ? 'text-gold' : 'hover:text-gold'}
          >
            <FiStar size={15} fill={note.favorite ? 'currentColor' : 'none'} />
          </button>
          <button onClick={handleShare} aria-label="Share note" className="hover:text-pine">
            <FiShare2 size={15} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate(note._id);
            }}
            aria-label="Duplicate note"
            className="hover:text-ink dark:hover:text-paper"
          >
            <FiCopy size={15} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onArchive(note._id);
            }}
            aria-label="Archive note"
            className="hover:text-ink dark:hover:text-paper"
          >
            <FiArchive size={15} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note);
            }}
            aria-label="Delete note"
            className="hover:text-clay"
          >
            <FiTrash2 size={15} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default NoteCard;
