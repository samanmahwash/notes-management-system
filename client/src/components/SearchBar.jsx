import { FiSearch, FiX } from 'react-icons/fi';

const SearchBar = ({ value, onChange, placeholder = 'Search your notes…' }) => (
  <div className="relative w-full max-w-md">
    <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-graphite" size={16} />
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="input-field pl-10 pr-9"
    />
    {value && (
      <button
        onClick={() => onChange('')}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-graphite hover:text-ink dark:hover:text-paper"
        aria-label="Clear search"
      >
        <FiX size={16} />
      </button>
    )}
  </div>
);

export default SearchBar;
