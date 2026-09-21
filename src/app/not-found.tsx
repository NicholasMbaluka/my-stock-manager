import Link from "next/link";

export default function NotFound() {
  return (
    <div className="content">
      <div className="page-head">
        <div>
          <h1>Page not found</h1>
          <p>The page you are looking for does not exist or was moved.</p>
        </div>
      </div>
      <Link className="primary" href="/dashboard">
        Back to dashboard
      </Link>
    </div>
  );
}