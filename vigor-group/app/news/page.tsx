import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getNews } from "@/data/news";
import { pageMeta } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { PlaceholderImage } from "@/components/PlaceholderImage";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";

export const metadata = pageMeta({
  title: "News & press",
  description:
    "Announcements, milestones and press mentions from across the Vigor Group of Companies.",
  path: "/news",
});

export default function NewsPage() {
  const posts = getNews();

  return (
    <>
      <PageHeader
        eyebrow="News & press"
        title="What's happening across the group"
        intro="Announcements, milestones and press from Vigor Group and its companies."
      />

      <section className="container py-16">
        <RevealGroup className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" as="ul">
          {posts.map((post) => (
            <RevealItem as="li" key={post.slug} className="h-full">
              <Link
                href={`/news/${post.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-graphite-900/10 bg-white shadow-card transition-shadow hover:shadow-lift"
              >
                <PlaceholderImage
                  label={post.category}
                  icon="sparkles"
                  aspect="aspect-[16/9]"
                  className="rounded-none"
                />
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-3">
                    <Badge tone="gold">{post.category}</Badge>
                    <time className="text-xs text-graphite-500" dateTime={post.date}>
                      {formatDate(post.date)}
                    </time>
                  </div>
                  <h2 className="mt-3 font-heading text-lg font-semibold leading-snug text-graphite-900">
                    {post.title}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-graphite-600">
                    {post.excerpt}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-graphite-800 transition-transform group-hover:translate-x-0.5">
                    Read more
                    <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
                  </span>
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>

        <p className="mt-10 rounded-xl border border-dashed border-graphite-900/15 bg-white/50 p-4 text-sm text-graphite-500">
          These are sample entries. Add a post by appending one object to{" "}
          <code className="rounded bg-graphite-900/5 px-1.5 py-0.5 font-mono text-xs">
            data/news.ts
          </code>{" "}
          — no design changes or redeploy of components required.
        </p>
      </section>
    </>
  );
}
