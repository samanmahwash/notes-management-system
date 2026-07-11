import { Outlet, Link } from 'react-router-dom';

const AuthLayout = () => (
  <div className="flex min-h-screen bg-paper dark:bg-ink-dark bg-grain bg-repeat">
    <div className="hidden flex-1 flex-col justify-between bg-ink dark:bg-surface-dark p-12 text-paper lg:flex">
      <Link to="/" className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold text-ink-dark font-display font-semibold">
          M
        </div>
        <span className="font-display text-lg font-semibold">Marginalia</span>
      </Link>
      <div>
        <p className="font-display text-3xl font-medium leading-snug">
          Where scattered thoughts <br /> become a kept record.
        </p>
        <p className="mt-4 max-w-md text-sm text-paper/60">
          Capture ideas, pin what matters, and find any note in seconds — a calm, private
          margin for your thinking.
        </p>
      </div>
      <p className="text-xs text-paper/40">© {new Date().getFullYear()} Marginalia</p>
    </div>
    <div className="flex flex-1 items-center justify-center p-6">
      <Outlet />
    </div>
  </div>
);

export default AuthLayout;
