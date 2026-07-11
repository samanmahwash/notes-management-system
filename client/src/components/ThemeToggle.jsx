import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="relative flex h-9 w-16 items-center rounded-full border border-ink/15 dark:border-paper/20 bg-ink/5 dark:bg-paper/10 px-1 transition-colors"
    >
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-full bg-paper dark:bg-ink-dark shadow-soft transition-transform duration-300 ${
          isDark ? 'translate-x-7' : 'translate-x-0'
        }`}
      >
        {isDark ? <FiMoon className="text-gold" size={14} /> : <FiSun className="text-gold-dark" size={14} />}
      </span>
    </button>
  );
};

export default ThemeToggle;
