import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { HomePage } from '@/pages/HomePage';
import { AlgorithmDetailPage } from '@/pages/AlgorithmDetailPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="algorithms/:slug" element={<AlgorithmDetailPage />} />
      </Route>
    </Routes>
  );
}
