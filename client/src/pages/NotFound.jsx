import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-paper dark:bg-ink-dark px-4 text-center">
    <p className="font-display text-6xl font-semibold text-gold">404</p>
    <h1 className="mt-3 font-display text-xl font-medium">This page has gone missing</h1>
    <p className="mt-1.5 max-w-sm text-sm text-graphite">
      The page you're looking for doesn't exist or may have been moved.
    </p>
    <Link to="/dashboard" className="btn-primary mt-6">
      Back to dashboard
    </Link>
  </div>
);

export default NotFound;
