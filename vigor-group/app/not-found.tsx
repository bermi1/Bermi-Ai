import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="container flex min-h-[70vh] flex-col items-center justify-center py-32 text-center">
      <p className="font-heading text-6xl font-semibold text-brand-500">404</p>
      <h1 className="mt-4 font-heading text-3xl font-semibold text-graphite-900">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-graphite-600">
        The page you&apos;re looking for isn&apos;t here. It may have moved, or the company you want lives
        under a different link.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/" variant="primary">
          Back to home
        </ButtonLink>
        <ButtonLink href="/companies" variant="outline">
          Browse companies
        </ButtonLink>
      </div>
    </section>
  );
}
