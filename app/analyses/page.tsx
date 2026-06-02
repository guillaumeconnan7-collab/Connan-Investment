import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllAnalyses } from '@/lib/analyses'

export const metadata: Metadata = {
  title: 'Publications',
  description:
    "Analyses financières, essais, réflexions et articles publiés par Connan Investment. Approche value investing, psychologie de marché, pensée long terme.",
  keywords: [
    'analyse financière',
    'value investing',
    'essai investissement',
    'réflexion marché',
    'pensée long terme',
    'analyse fondamentale',
    'Connan Investment',
    'Guillaume Connan',
  ],
  openGraph: {
    title: 'Publications — Connan Investment',
    description:
      "Analyses, essais et réflexions publiés par Connan Investment. Approche value investing et pensée long terme.",
    url: 'https://connaninvestment.com/analyses',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Publications — Connan Investment',
    description: "Analyses, essais et réflexions. Approche value investing et pensée long terme.",
  },
  alternates: {
    canonical: 'https://connaninvestment.com/analyses',
  },
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function AnalysesPage() {
  const articles = getAllAnalyses()

  return (
    <div className="px-6 py-16 md:py-20">
      <div className="max-w-3xl mx-auto">
        {/* En-tête */}
        <span className="section-label">Écrits</span>
        <h1 className="mt-3 text-3xl font-serif font-medium text-navy">Publications</h1>
        <div className="divider-gold mt-4 mb-4" />
        <p className="text-[14px] text-gray-500 leading-relaxed mb-10">
          Analyses d&rsquo;entreprises, essais sur l&rsquo;investissement, réflexions sur les marchés
          et la psychologie de marché. Ces textes sont publiés à titre informatif et ne constituent
          pas un conseil en investissement.
        </p>

        {/* Liste */}
        <div className="flex flex-col divide-y divide-gray-100">
          {articles.map((a) => (
            <Link key={a.slug} href={`/analyses/${a.slug}`} className="group py-6 first:pt-0">
              <article>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[11px] font-medium uppercase tracking-wide text-brand-blue">
                    {a.categorie}
                  </span>
                  <span className="text-[11px] text-gray-300">·</span>
                  <time className="text-[11px] text-gray-400">{formatDate(a.date)}</time>
                </div>
                <h2 className="text-[16px] font-serif font-medium text-navy leading-snug mb-2 group-hover:text-navy-light transition-colors">
                  {a.titre}
                </h2>
                <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-2">
                  {a.resume}
                </p>
              </article>
            </Link>
          ))}
        </div>

        {articles.length === 0 && (
          <p className="text-[14px] text-gray-400 text-center py-16">
            Aucune publication pour le moment.
          </p>
        )}
      </div>
    </div>
  )
}
