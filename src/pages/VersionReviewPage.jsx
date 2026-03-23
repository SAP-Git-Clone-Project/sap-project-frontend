import { Link } from "react-router-dom";

export default function VersionReviewPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <h1 className="text-2xl font-bold text-base-content">Version Reviews</h1>
      <Link to="/" className="btn btn-ghost btn-sm">← Back Home</Link>
    </div>
  );
}