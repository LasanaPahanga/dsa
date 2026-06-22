import { getAllAlgorithms } from '@/algorithms/registry';

export type NavItem = {
  id: string;
  label: string;
  slug: string;
};

export type NavGroup = {
  id: string;
  label: string;
  items: NavItem[];
};

/** Sidebar items — built from the algorithm registry only. */
export function getSidebarNav(): NavGroup[] {
  const algorithms = getAllAlgorithms();
  if (algorithms.length === 0) return [];

  return [
    {
      id: 'algorithms',
      label: 'Algorithms',
      items: algorithms.map((a) => ({
        id: a.id,
        label: a.title,
        slug: a.slug,
      })),
    },
  ];
}
