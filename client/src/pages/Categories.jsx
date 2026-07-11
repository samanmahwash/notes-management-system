import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiEdit2, FiCheck, FiX } from 'react-icons/fi';
import EmptyState from '../components/EmptyState';
import ConfirmModal from '../components/ConfirmModal';
import * as categoryService from '../services/categoryService';

const COLORS = ['#C89B3C', '#6B8F71', '#5A7D9A', '#B5563C', '#8B6BAE', '#3E7C6B'];

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(COLORS[0]);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await categoryService.fetchCategories();
      setCategories(data.categories);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      await categoryService.createCategory({ name: newName.trim(), color: newColor });
      toast.success('Category added');
      setNewName('');
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not add category');
    }
  };

  const startEdit = (cat) => {
    setEditingId(cat._id);
    setEditName(cat.name);
  };

  const saveEdit = async (id) => {
    try {
      await categoryService.updateCategory(id, { name: editName });
      toast.success('Category renamed');
      setEditingId(null);
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not rename category');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await categoryService.deleteCategory(deleteTarget._id);
      toast.success('Category deleted');
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not delete category');
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-semibold">Categories</h1>
        <p className="text-sm text-graphite">Organize your notes into meaningful groups.</p>
      </div>

      <form onSubmit={handleCreate} className="card flex flex-wrap items-center gap-3 p-4">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New category name"
          className="input-field max-w-xs"
        />
        <div className="flex items-center gap-1.5">
          {COLORS.map((c) => (
            <button
              type="button"
              key={c}
              onClick={() => setNewColor(c)}
              className={`h-6 w-6 rounded-full border-2 transition-transform hover:scale-110 ${
                newColor === c ? 'border-ink dark:border-paper' : 'border-transparent'
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        <button type="submit" className="btn-primary ml-auto">
          <FiPlus size={16} /> Add category
        </button>
      </form>

      {loading ? (
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold border-t-transparent" />
      ) : categories.length === 0 ? (
        <EmptyState title="No categories yet" description="Create categories to group related notes together." />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {categories.map((cat) => (
              <motion.div
                key={cat._id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="card flex items-center justify-between gap-3 p-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: cat.color }} />
                  {editingId === cat._id ? (
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="input-field py-1"
                      autoFocus
                    />
                  ) : (
                    <div className="min-w-0">
                      <p className="truncate font-medium">{cat.name}</p>
                      <p className="text-xs text-graphite">{cat.noteCount} notes</p>
                    </div>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-2 text-graphite">
                  {editingId === cat._id ? (
                    <>
                      <button onClick={() => saveEdit(cat._id)} className="hover:text-pine">
                        <FiCheck size={16} />
                      </button>
                      <button onClick={() => setEditingId(null)} className="hover:text-clay">
                        <FiX size={16} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(cat)} className="hover:text-ink dark:hover:text-paper">
                        <FiEdit2 size={15} />
                      </button>
                      <button onClick={() => setDeleteTarget(cat)} className="hover:text-clay">
                        <FiTrash2 size={15} />
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete this category?"
        description={`Notes in "${deleteTarget?.name}" will become uncategorized, not deleted.`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default Categories;
