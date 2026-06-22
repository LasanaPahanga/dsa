import { Link, useParams } from 'react-router-dom';
import { getAlgorithmBySlug } from '@/algorithms/registry';
import { LabAlgorithmPage } from '@/components/LabAlgorithmPage';

export function AlgorithmDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const algorithm = slug ? getAlgorithmBySlug(slug) : undefined;

  if (!algorithm) {
    return (
      <div className="text-center py-20 space-y-4">
        <h1 className="text-2xl font-semibold">Algorithm not found</h1>
        <Link to="/" className="text-lab-primary hover:underline">
          ← Back to lab
        </Link>
      </div>
    );
  }

  return <LabAlgorithmPage algorithm={algorithm} />;
}
