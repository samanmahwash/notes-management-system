import NotesListPage from '../components/NotesListPage';

const Favorites = () => (
  <NotesListPage
    title="Favorites"
    description="The notes you've starred for quick access."
    fixedFilters={{ favorite: true }}
    emptyTitle="No favorites yet"
    emptyDescription="Star a note to keep it close at hand."
  />
);

export default Favorites;
