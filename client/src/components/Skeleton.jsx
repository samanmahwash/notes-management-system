export const NoteCardSkeleton = () => (
  <div className="card h-48 animate-pulse p-5">
    <div className="mb-4 h-4 w-2/3 rounded bg-ink/10 dark:bg-paper/10" />
    <div className="mb-2 h-3 w-full rounded bg-ink/10 dark:bg-paper/10" />
    <div className="mb-2 h-3 w-5/6 rounded bg-ink/10 dark:bg-paper/10" />
    <div className="h-3 w-1/2 rounded bg-ink/10 dark:bg-paper/10" />
  </div>
);

export const NotesGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {Array.from({ length: count }).map((_, i) => (
      <NoteCardSkeleton key={i} />
    ))}
  </div>
);
