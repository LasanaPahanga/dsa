import { Link, useLocation } from 'react-router-dom';
import { getSidebarNav } from '@/lib/sidebar-nav';

function NavGroup({
  label,
  items,
}: {
  label: string;
  items: { id: string; label: string; slug: string }[];
}) {
  const location = useLocation();

  return (
    <div className="mb-2">
      <p className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-lab-muted">
        {label}
      </p>
      <ul className="mt-1 space-y-0.5 pl-2">
        {items.map((item) => {
          const isActive = location.pathname.includes(item.slug);

          return (
            <li key={item.id}>
              <Link
                to={`/algorithms/${item.slug}`}
                className={`block px-3 py-2 text-sm rounded-lg transition-all ${
                  isActive
                    ? 'bg-lab-primary/20 text-lab-primary border border-lab-primary/30'
                    : 'text-lab-muted hover:text-lab-text hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function LabSidebar() {
  const nav = getSidebarNav();

  if (nav.length === 0) {
    return (
      <aside className="glass-strong rounded-2xl p-4 h-full">
        <p className="text-sm text-lab-muted">No algorithms yet.</p>
      </aside>
    );
  }

  return (
    <aside className="glass-strong rounded-2xl p-4 h-full">
      <p className="text-xs font-semibold text-lab-muted uppercase tracking-wider mb-4 px-2">
        Curriculum
      </p>
      {nav.map((group) => (
        <NavGroup key={group.id} label={group.label} items={group.items} />
      ))}
    </aside>
  );
}
