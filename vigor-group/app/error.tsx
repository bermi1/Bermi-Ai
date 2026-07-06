"use client";

import { useEffect } from "react";
import { ButtonLink, Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <section className="container flex min-h-[70vh] flex-col items-center justify-center py-32 text-center">
      <p className="font-heading text-5xl font-semibold text-brand-500">Something went wrong</p>
      <p className="mt-4 max-w-md text-graphite-600">
        An unexpected error occurred. You can try again, or head back to the home page.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button variant="primary" onClick={reset}>
          Try again
        </Button>
        <ButtonLink href="/" variant="outline">
          Back to home
        </ButtonLink>
      </div>
    </section>
  );
}
