import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <p className="text-6xl font-bold text-primary">404</p>
      <p className="text-base-content/60 text-sm">Page not found.</p>
      <Link to="/" className="btn btn-primary btn-sm">Go Home</Link>
    </div>
  );
}