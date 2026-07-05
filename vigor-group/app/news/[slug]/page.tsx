import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { news, getPost } from "@/data/news";
import { pageMeta } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { PlaceholderImage } from "@/components/PlaceholderImage";
import { CTABand } from "@/components/CTABand";

export function generateStaticParams() {
  return news.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) return {};
  return pageMeta({
    title: post.title,
    description: post.excerpt,
    path: `/news/${post.slug}`,
  });
}

export default function NewsPostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();

  return (
    <>
      <article className="container max-w-3xl pb-8 pt-32 sm:pt-40">
        <Link
          href="/news"
          className="inline-flex items-center gap-1.5 text-sm text-ink-600 hover:text-ink-900"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.8} /> All news
        </Link>

        <div className="mt-6 flex items-center gap-3">
          <Badge tone="gold">{post.category}</Badge>
          <time className="text-sm text-ink-500" dateTime={post.date}>
            {formatDate(post.date)}
          </time>
        </div>

        <h1 className="mt-4 font-heading text-4xl font-semibold leading-tight tracking-tight text-ink-900">
          {post.title}
        </h1>

        <PlaceholderImage
          label={post.category}
          icon="sparkles"
          aspect="aspect-[16/9]"
          className="mt-8"
        />

        <div className="prose mt-8 space-y-5 text-lg leading-relaxed text-ink-700">
          {post.body.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        <p className="mt-10 rounded-xl border border-dashed border-ink-900/15 bg-white/50 p-4 text-sm text-ink-500">
          Sample article — placeholder content pending real press material.
        </p>
      </article>

      <CTABand
        title="Media & partnership enquiries"
        body="For press, interviews or partnership opportunities, reach the group directly."
      />
    </>
  );
}
