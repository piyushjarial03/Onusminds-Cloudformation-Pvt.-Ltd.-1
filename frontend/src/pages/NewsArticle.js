import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Reveal, MaskedLines } from "../components/Motion";
import { api, fileUrl } from "../lib/api";

export default function NewsArticle() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    api
      .get(`/news/${slug}`)
      .then((r) => setArticle(r.data))
      .catch(() => setMissing(true));
  }, [slug]);

  if (missing)
    return (
      <main className="pt-40 pb-32 text-center" data-testid="article-missing">
        <p className="text-white/50">Article not found.</p>
        <Link to="/news" className="mt-4 inline-block text-[#0055FF] text-sm uppercase tracking-widest">Back to News</Link>
      </main>
    );

  if (!article)
    return <main className="pt-40 pb-32 px-6 text-white/40 text-sm" data-testid="article-loading">Loading…</main>;

  return (
    <main data-testid="article-page">
      <section className="relative pt-40 pb-14 md:pt-52">
        <div className="mx-auto max-w-4xl px-6">
          <Reveal y={20}>
            <Link data-testid="article-back" to="/news" className="mb-10 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/50 hover:text-white transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" /> News & Media
            </Link>
          </Reveal>
          <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest">
            <span className="text-[#0055FF]">{article.category}</span>
            <span className="text-white/40">
              {new Date(article.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>
          <MaskedLines
            lines={[article.title]}
            className="mt-4 font-display font-black tracking-tighter leading-[1.05] text-3xl sm:text-4xl md:text-5xl"
          />
        </div>
      </section>

      {article.image_url && (
        <Reveal className="mx-auto max-w-5xl px-6">
          <div className="overflow-hidden border border-white/10">
            <img src={fileUrl(article.image_url)} alt={article.title} className="w-full object-cover aspect-[21/9]" />
          </div>
        </Reveal>
      )}

      <article className="mx-auto max-w-3xl px-6 py-16 md:py-20">
        {article.excerpt && (
          <Reveal>
            <p className="mb-10 border-l-2 border-[#0055FF] pl-6 font-display text-lg md:text-2xl font-bold leading-snug text-white/90">
              {article.excerpt}
            </p>
          </Reveal>
        )}
        {article.content.split(/\n\n+/).map((para, i) => (
          <Reveal key={i} delay={0.05}>
            <p className="mb-6 text-base md:text-lg leading-relaxed text-white/70">{para}</p>
          </Reveal>
        ))}
      </article>
    </main>
  );
}
