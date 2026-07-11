import NotesListPage from '../components/NotesListPage';

const Archived = () => (
  <NotesListPage
    title="Archived"
    description="Notes you've tucked away but kept for later."
    fixedFilters={{ archived: true }}
    emptyTitle="Nothing archived"
    emptyDescription="Archived notes are hidden from your main list but never lost."
  />
);

export default Archived;
