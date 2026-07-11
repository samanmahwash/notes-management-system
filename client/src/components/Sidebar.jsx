import { NavLink } from 'react-router-dom';
import {
  FiGrid,
  FiFileText,
  FiStar,
  FiArchive,
  FiTag,
  FiUser,
  FiSettings,
  FiLogOut,
  FiX,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: FiGrid },
  { to: '/notes', label: 'All Notes', icon: FiFileText },
  { to: '/favorites', label: 'Favorites', icon: FiStar },
  { to: '/archived', label: 'Archived', icon: FiArchive },
  { to: '/categories', label: 'Categories', icon: FiTag },
  { to: '/profile', label: 'Profile', icon: FiUser },
  { to: '/settings', label: 'Settings', icon: FiSettings },
];

const Sidebar = ({ open, onClose }) => {
  const { logout } = useAuth();

  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-ink/40 backdrop-blur-sm lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-ink/5 dark:border-paper/10 bg-surface-light dark:bg-surface-dark px-4 py-6 transition-transform duration-300 lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-8 flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink dark:bg-gold text-paper dark:text-ink-dark font-display font-semibold">
              M
            </div>
            <span className="font-display text-lg font-semibold">Marginalia</span>
          </div>
          <button onClick={onClose} className="text-graphite lg:hidden">
            <FiX size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-gold/15 text-gold-dark dark:text-gold'
                    : 'text-graphite hover:bg-ink/5 dark:hover:bg-paper/10 hover:text-ink dark:hover:text-paper'
                }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={logout}
          className="mt-4 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-clay hover:bg-clay/10"
        >
          <FiLogOut size={17} />
          Logout
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
