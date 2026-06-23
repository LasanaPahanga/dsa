import type { AlgorithmModule, AlgorithmSummary } from './types';
import { prefixSumModule } from './prefix-sum';
import { differenceArrayModule } from './difference-array';

/**
 * Central registry — add new algorithms here as you build them.
 *
 * To add a new algorithm:
 * 1. Create `src/algorithms/<slug>/` with index.ts + visualizer(s)
 * 2. Import and append to `algorithmModules` below
 */

const algorithmModules: AlgorithmModule[] = [prefixSumModule, differenceArrayModule];

export function getAllAlgorithms(): AlgorithmSummary[] {
  return algorithmModules.map(
    ({ id, slug, title, shortDescription, tags, difficulty }) => ({
      id,
      slug,
      title,
      shortDescription,
      tags,
      difficulty,
    }),
  );
}

export function getAlgorithmBySlug(slug: string): AlgorithmModule | undefined {
  return algorithmModules.find((a) => a.slug === slug);
}
