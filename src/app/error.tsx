"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="content">
      <div className="page-head">
        <div>
          <h1>Something went wrong</h1>
          <p>An unexpected error occurred. Please try again.</p>
        </div>
      </div>
      <button className="primary" onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}