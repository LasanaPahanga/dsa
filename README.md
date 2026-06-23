# DSA Visualizer

Interactive web app + reference implementations for learning data structures and algorithms.

**Live concept:** understand the *why*, step through each operation visually, then study clean Python/C++ code and practice problems.

## Repository structure

```
dsa/
├── algorithms/          # Reference code + docs (one folder per algorithm)
│   ├── prefix-sum/
│   └── difference-array/
├── web-app/             # React visualizer (Vite + TypeScript)
└── README.md
```

## Quick start (web app)

```bash
cd web-app
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) — start with **Prefix Sum**, then try **Difference Array**.

## Algorithms included

| Algorithm | 1D | 2D | Visualizer |
|-----------|----|----|------------|
| Prefix Sum | ✓ | ✓ | ✓ |
| Difference Array | ✓ | — | ✓ |

More coming: two pointers, sliding window, binary search, sorting, graphs, …

## Adding a new algorithm

### 1. Repo (`algorithms/<slug>/`)

```
algorithms/my-algo/
├── README.md          # concept, formulas, complexity
├── examples.md        # worked examples
├── my_algo.py
└── my_algo.cpp
```

### 2. Web app (`web-app/src/algorithms/<slug>/`)

1. Create a folder with:
   - `index.ts` — export an `AlgorithmModule` (metadata, theory, code snippets, practice problems)
   - `<Name>Visualizer.tsx` — interactive component(s)
2. Register in `web-app/src/algorithms/registry.ts`:

```ts
import { myAlgoModule } from './my-algo';

const algorithmModules: AlgorithmModule[] = [
  prefixSumModule,
  myAlgoModule,  // add here
];
```

That's it — the home page and `/algorithms/:slug` route pick it up automatically.

### `AlgorithmModule` checklist

- `id`, `slug`, `title`, `shortDescription`, `tags`, `difficulty`
- `sections[]` — one or more visualizer tabs
- `concept`, `bruteForce`, `optimized` — short theory panels
- `codeSnippets[]` — Python and/or C++
- `complexity` — build, query, space
- `practiceProblems[]`

## Run reference code

```bash
# Python
python algorithms/prefix-sum/prefix_sum_1d.py
python algorithms/prefix-sum/prefix_sum_2d.py
python algorithms/difference-array/difference_array.py

# C++ (requires g++)
g++ -std=c++17 algorithms/prefix-sum/prefix_sum_1d.cpp -o prefix_1d && ./prefix_1d
```

## License

MIT — feel free to use, learn, and contribute.
