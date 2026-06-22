import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type ExplanationField = {
  label: string;
  value: string;
  accent?: 'primary' | 'success' | 'warning' | 'error' | 'purple';
};

export type LabExplanation = {
  stepNumber: number;
  totalSteps: number;
  title: string;
  fields: ExplanationField[];
  meaning?: string;
  formula?: string;
};

export type LabVisualizerState = {
  explanation: LabExplanation | null;
  highlightedCodeLine: number | null;
  codeTabIndex: number;
};

type LabContextValue = LabVisualizerState & {
  setExplanation: (e: LabExplanation | null) => void;
  setHighlightedCodeLine: (line: number | null) => void;
  setCodeTabIndex: (i: number) => void;
  isLabMode: true;
};

const LabVisualizerContext = createContext<LabContextValue | null>(null);

export function LabVisualizerProvider({ children }: { children: ReactNode }) {
  const [explanation, setExplanation] = useState<LabExplanation | null>(null);
  const [highlightedCodeLine, setHighlightedCodeLine] = useState<number | null>(null);
  const [codeTabIndex, setCodeTabIndex] = useState(0);

  const value = useMemo(
    () => ({
      explanation,
      highlightedCodeLine,
      codeTabIndex,
      setExplanation,
      setHighlightedCodeLine,
      setCodeTabIndex,
      isLabMode: true as const,
    }),
    [explanation, highlightedCodeLine, codeTabIndex],
  );

  return (
    <LabVisualizerContext.Provider value={value}>{children}</LabVisualizerContext.Provider>
  );
}

export function useLabVisualizer() {
  return useContext(LabVisualizerContext);
}

export function useLabSyncEffect(
  explanation: LabExplanation | null,
  codeLine: number | null,
  codeTab = 0,
) {
  const lab = useLabVisualizer();

  useEffect(() => {
    if (!lab) return;
    lab.setExplanation(explanation);
    lab.setHighlightedCodeLine(codeLine);
    lab.setCodeTabIndex(codeTab);
  }, [lab, explanation, codeLine, codeTab]);

  return lab !== null;
}
