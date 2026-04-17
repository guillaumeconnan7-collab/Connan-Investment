import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllAnalyses } from '@/lib/analyses'

export const metadata: Metadata = {
  title: 'Analyses',
  description:
    "Analyses d'entreprises cotées selon une approche value investing : thèse d'investissement, analyse fondamentale, valorisation et risques. Recommandations Achat, Suivi ou Neutre.",
  keywords: [
    'analyse financière',
    'value investing',
    'thèse d\'investissement',
    'analyse fondamentale',
    'actions cotées',
    'analyse boursière',
    'investissement long terme',
    'recommandation achat',
    'valorisation entreprise',
  ],
  openGraph: {
    title: 'Analyses — Connan Investment',
    description:
      "Analyses d'entreprises cotées : thèses d'investissement, analyse fondamentale, valorisation et risques. Approche value investing.",
    url: 'https://connaninvestment.com/analyses',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Analyses — Connan Investment',
    description:
      "Analyses d'entreprises cotées : thèses d'investissement, valorisation et risques.",
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
  const analyses = getAllAnalyses()

  return (
    <div className="px-6 py-16 md:py-20">
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <span className="section-label">Publications</span>
        <h1 className="mt-3 text-3xl font-serif font-medium text-navy">Analyses</h1>
        <div className="divider-gold mt-4 mb-4" />
        <p className="text-[14px] text-gray-500 leading-relaxed mb-10">
          Nos analyses sont publiées à titre informatif uniquement. Elles reflètent notre opinion au
          moment de la publication et ne constituent pas un conseil en investissement.
        </p>

        {/* Liste */}
        <div className="flex flex-col gap-4">
          {analyses.map((a) => (
            <Link key={a.slug} href={`/analyses/${a.slug}`} className="group">
              <article className="card flex flex-col md:flex-row md:items-start md:gap-8">
                {/* Meta colonne */}
                <div className="flex-shrink-0 md:w-40">
                  <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">
                    {a.secteur}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{a.geographie}</p>
                  <p className="text-[11px] text-gray-400 mt-3">{formatDate(a.date)}</p>
                </div>

                {/* Contenu */}
                <div className="flex-1 mt-3 md:mt-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h2 className="text-[15px] font-serif font-medium text-navy leading-snug group-hover:text-navy-light transition-colors">
                      {a.titre}
                    </h2>
                    <span
                      className={`flex-shrink-0 ${
                        a.recommandation === 'Achat'
                          ? 'badge-achat'
                          : a.recommandation === 'Neutre'
                            ? 'badge-neutre'
                            : 'badge-suivi'
                      }`}
                    >
                      {a.recommandation}
                    </span>
                  </div>

                  <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-2">
                    {a.resume}
                  </p>

                  <div className="mt-3 flex items-center gap-4 text-[12px] text-gray-400">
                    <span>
                      {a.ticker} · {a.bourse}
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {analyses.length === 0 && (
          <p className="text-[14px] text-gray-400 text-center py-16">
            Aucune analyse publiée pour le moment.
          </p>
        )}
      </div>
    </div>
  )
}
