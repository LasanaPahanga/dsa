import type { ComponentType, ReactNode } from 'react';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type ComplexityInfo = {
  build: string;
  query: string;
  space: string;
};

export type CodeSnippet = {
  language: 'python' | 'cpp' | 'java' | 'javascript';
  label: string;
  code: string;
};

export type PracticeProblem = {
  title: string;
  description: string;
  difficulty: Difficulty;
  link?: string;
};

export type AlgorithmSection = {
  id: string;
  title: string;
  component: ComponentType;
};

export type AlgorithmModule = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  tags: string[];
  difficulty: Difficulty;
  complexity: ComplexityInfo;
  sections: AlgorithmSection[];
  concept: ReactNode;
  bruteForce: ReactNode;
  optimized: ReactNode;
  codeSnippets: CodeSnippet[];
  practiceProblems: PracticeProblem[];
};

export type AlgorithmSummary = Pick<
  AlgorithmModule,
  'id' | 'slug' | 'title' | 'shortDescription' | 'tags' | 'difficulty'
>;
