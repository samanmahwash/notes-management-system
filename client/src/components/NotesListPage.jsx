import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiPlus, FiFilter } from 'react-icons/fi';
import NoteCard from './NoteCard';
import NoteEditorModal from './NoteEditorModal';
import ConfirmModal from './ConfirmModal';
import EmptyState from './EmptyState';
import SearchBar from './SearchBar';
import CategoryPill from './CategoryPill';
import { NotesGridSkeleton } from './Skeleton';
import { useNotes } from '../context/NotesContext';
import { fetchCategories } from '../services/categoryService';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'az', label: 'Title A–Z' },
  { value: 'za', label: 'Title Z–A' },
];

const NotesListPage = ({ title, description, fixedFilters = {}, emptyTitle, emptyDescription }) => {
  const { notes, loading, loadNotes, addNote, editNote, removeNote, pin, archive, favorite, duplicate } = useNotes();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState([]);
  const [editorOpen, setEditorOpen] = useState(false);
  const [activeNote, setActiveNote] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const refresh = useCallback(() => {
    loadNotes({ search, sort, category: categoryFilter || undefined, ...fixedFilters });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, sort, categoryFilter]);

  useEffect(() => {
    fetchCategories().then((d) => setCategories(d.categories));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (searchParams.get('new') === '1') {
      setActiveNote(null);
      setEditorOpen(true);
      searchParams.delete('new');
      setSearchParams(searchParams, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        setActiveNote(null);
        setEditorOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSave = async (payload, silent) => {
    try {
      if (activeNote?._id) {
        const updated = await editNote(activeNote._id, payload);
        setActiveNote(updated);
      } else {
        const created = await addNote(payload);
        setActiveNote(created);
      }
    } catch (error) {
      if (!silent) toast.error(error.response?.data?.message || 'Could not save note');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await removeNote(deleteTarget._id);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not delete note');
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold">{title}</h1>
          <p className="text-sm text-graphite">{description}</p>
        </div>
        <button
          onClick={() => {
            setActiveNote(null);
            setEditorOpen(true);
          }}
          className="btn-primary"
        >
          <FiPlus size={16} /> New note
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SearchBar value={search} onChange={setSearch} />
        <div className="flex items-center gap-2 text-graphite">
          <FiFilter size={15} />
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="input-field w-auto py-2 text-sm">
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <CategoryPill name="All" color="#6B6560" active={!categoryFilter} onClick={() => setCategoryFilter('')} />
          {categories.map((c) => (
            <CategoryPill
              key={c._id}
              name={c.name}
              color={c.color}
              active={categoryFilter === c._id}
              onClick={() => setCategoryFilter(c._id)}
            />
          ))}
        </div>
      )}

      {loading ? (
        <NotesGridSkeleton />
      ) : notes.length === 0 ? (
        <EmptyState
          title={emptyTitle || 'No notes here yet'}
          description={emptyDescription || 'Create a note to get started.'}
          action={
            <button
              onClick={() => {
                setActiveNote(null);
                setEditorOpen(true);
              }}
              className="btn-primary mt-5"
            >
              <FiPlus size={16} /> Create a note
            </button>
          }
        />
      ) : (
        <motion.div layout className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {notes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onOpen={(n) => {
                  setActiveNote(n);
                  setEditorOpen(true);
                }}
                onPin={pin}
                onFavorite={favorite}
                onArchive={archive}
                onDuplicate={duplicate}
                onDelete={setDeleteTarget}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <NoteEditorModal
        open={editorOpen}
        note={activeNote}
        categories={categories}
        onClose={() => setEditorOpen(false)}
        onSave={handleSave}
      />

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete this note?"
        description={`"${deleteTarget?.title}" will be moved to trash.`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default NotesListPage;
