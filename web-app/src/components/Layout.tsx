import { Link, Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="glass sticky top-0 z-50 border-b border-lab-border">
        <div className="max-w-[1600px] mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-3 font-semibold text-lg group"
          >
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-lab-primary to-viz-purple flex items-center justify-center text-sm shadow-lg shadow-lab-primary/30 group-hover:scale-105 transition-transform">
              ◈
            </span>
            <span>
              DSA <span className="text-lab-primary">Visual Lab</span>
            </span>
          </Link>

          <nav className="flex items-center gap-6 text-sm text-lab-muted">
            <Link to="/" className="hover:text-lab-text transition-colors">
              Home
            </Link>
            <Link
              to="/algorithms/prefix-sum"
              className="hover:text-lab-text transition-colors"
            >
              Learn
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 py-6">
        <Outlet />
      </main>

      <footer className="border-t border-lab-border py-5 text-center text-sm text-lab-muted">
        DSA Visual Lab. Algorithms come alive.
      </footer>
    </div>
  );
}
