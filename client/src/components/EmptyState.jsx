const EmptyState = ({ title, description, action }) => (
  <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-ink/15 dark:border-paper/15 py-16 px-6 text-center animate-fade-in">
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" className="mb-4 opacity-70">
      <rect x="14" y="10" width="44" height="54" rx="4" className="fill-ink/5 dark:fill-paper/10" />
      <path d="M22 24h28M22 34h28M22 44h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-graphite" />
      <circle cx="50" cy="50" r="14" className="fill-gold/15" />
      <path d="M44 50h12M50 44v12" stroke="#C89B3C" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
    <h3 className="font-display text-lg font-medium">{title}</h3>
    <p className="mt-1 max-w-sm text-sm text-graphite">{description}</p>
    {action}
  </div>
);

export default EmptyState;
