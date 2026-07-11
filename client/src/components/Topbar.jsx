import { FiMenu } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';
import { initials } from '../utils/helpers';

const Topbar = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-ink/5 dark:border-paper/10 bg-paper/80 dark:bg-ink-dark/80 backdrop-blur px-4 py-3 lg:px-8">
      <button onClick={onMenuClick} className="text-graphite lg:hidden" aria-label="Open menu">
        <FiMenu size={22} />
      </button>
      <span className="hidden lg:block" />
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <NavLink to="/profile" className="flex items-center gap-2">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="h-9 w-9 rounded-full object-cover" />
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/20 font-mono text-sm font-semibold text-gold-dark dark:text-gold">
              {initials(user?.name)}
            </span>
          )}
          <span className="hidden text-sm font-medium sm:block">{user?.name}</span>
        </NavLink>
      </div>
    </header>
  );
};

export default Topbar;
