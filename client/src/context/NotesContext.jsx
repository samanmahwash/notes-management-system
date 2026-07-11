import { createContext, useContext, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import * as noteService from '../services/noteService';

const NotesContext = createContext(null);

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(false);

  const loadNotes = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const data = await noteService.fetchNotes(params);
      setNotes(data.notes);
      setPagination(data.pagination);
      return data.notes;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not load notes');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const addNote = async (payload) => {
    const data = await noteService.createNote(payload);
    setNotes((prev) => [data.note, ...prev]);
    toast.success('Note created');
    return data.note;
  };

  const editNote = async (id, payload) => {
    const data = await noteService.updateNote(id, payload);
    setNotes((prev) => prev.map((n) => (n._id === id ? data.note : n)));
    toast.success('Note updated');
    return data.note;
  };

  const removeNote = async (id) => {
    await noteService.deleteNote(id);
    setNotes((prev) => prev.filter((n) => n._id !== id));
    toast.success('Note moved to trash');
  };

  const patchNoteState = (id, updater) => {
    setNotes((prev) => prev.map((n) => (n._id === id ? updater(n) : n)));
  };

  const pin = async (id) => {
    const data = await noteService.togglePin(id);
    patchNoteState(id, () => data.note);
    toast.success(data.note.pinned ? 'Note pinned' : 'Note unpinned');
  };

  const archive = async (id) => {
    const data = await noteService.toggleArchive(id);
    setNotes((prev) => prev.filter((n) => n._id !== id));
    toast.success(data.note.archived ? 'Note archived' : 'Note unarchived');
  };

  const favorite = async (id) => {
    const data = await noteService.toggleFavorite(id);
    patchNoteState(id, () => data.note);
    toast.success(data.note.favorite ? 'Added to favorites' : 'Removed from favorites');
  };

  const duplicate = async (id) => {
    const data = await noteService.duplicateNote(id);
    setNotes((prev) => [data.note, ...prev]);
    toast.success('Note duplicated');
  };

  return (
    <NotesContext.Provider
      value={{ notes, pagination, loading, loadNotes, addNote, editNote, removeNote, pin, archive, favorite, duplicate, setNotes }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error('useNotes must be used within NotesProvider');
  return ctx;
};
