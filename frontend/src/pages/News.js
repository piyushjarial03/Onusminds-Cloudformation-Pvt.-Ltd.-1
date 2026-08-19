import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { Reveal } from "../components/Motion";
import { api, fileUrl } from "../lib/api";

export default function News() {
  const [articles, setArticles] = useState(null);

  useEffect(() => {
    api.get("/news").then((r) => setArticles(r.data)).catch(() => setArticles([]));
  }, []);

  return (
    <main data-testid="news-page">
      <PageHero
        kicker="Resources — News & Media"
        titleLines={["News &", "Media"]}
        description="Announcements, engineering notes and growth thinking from the OnusMinds team."
      />
      <section className="mx-auto max-w-[1600px] px-6 md:px-10 pb-28">
        {articles === null ? (
          <p className="text-white/40 text-sm" data-testid="news-loading">Loading articles…</p>
        ) : articles.length === 0 ? (
          <p className="text-white/40 text-sm" data-testid="news-empty">No articles published yet. Check back soon.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {articles.map((a, i) => (
              <Reveal key={a.id} delay={(i % 3) * 0.08}>
                <Link
                  data-testid={`news-card-${a.slug}`}
                  to={`/news/${a.slug}`}
                  className="group block border border-white/10 bg-white/[0.02] hover:border-[#0055FF]/60 transition-colors duration-300 h-full"
                >
                  {a.image_url && (
                    <div className="overflow-hidden aspect-[16/10]">
                      <img
                        src={fileUrl(a.image_url)}
                        alt={a.title}
                        className="h-full w-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                      />
                    </div>
                  )}
                  <div className="p-7">
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-widest">
                      <span className="text-[#0055FF]">{a.category}</span>
                      <span className="text-white/40">
                        {new Date(a.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>
                    <h2 className="mt-4 font-display text-xl md:text-2xl font-bold tracking-tight leading-snug group-hover:text-[#0055FF] transition-colors duration-300">
                      {a.title}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-white/50 line-clamp-3">{a.excerpt}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/50 group-hover:text-white transition-colors">
                      Read article <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
