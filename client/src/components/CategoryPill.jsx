const CategoryPill = ({ name, color = '#C89B3C', size = 'sm', onClick, active }) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 transition-colors ${
      size === 'sm' ? 'text-xs' : 'text-sm'
    } ${
      active
        ? 'border-transparent text-white'
        : 'border-ink/10 dark:border-paper/15 text-ink/80 dark:text-paper/80 hover:bg-ink/5 dark:hover:bg-paper/10'
    }`}
    style={active ? { backgroundColor: color } : {}}
  >
    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
    {name}
  </button>
);

export default CategoryPill;
