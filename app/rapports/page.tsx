import type { Metadata } from 'next'
import { getRapportsByYear } from '@/lib/rapports'

export const metadata: Metadata = {
  title: 'Rapports annuels',
  description:
    "Rapports annuels de Connan Investment : bilan de l'exercice, performance du portefeuille, décisions d'investissement et réflexions sur le marché. Transparence et pédagogie value investing.",
  keywords: [
    'rapport annuel investissement',
    'performance portefeuille',
    'lettre aux actionnaires',
    'bilan financier annuel',
    'value investing',
    'investissement long terme',
    'analyse fondamentale',
    'gestion de portefeuille',
    'transparence investissement',
  ],
  openGraph: {
    title: 'Rapports annuels — Connan Investment',
    description:
      "Rapports annuels : performance du portefeuille, décisions d'investissement et réflexions sur le marché. Approche value investing.",
    url: 'https://connaninvestment.com/rapports',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Rapports annuels — Connan Investment',
    description:
      "Performance du portefeuille, décisions d'investissement et réflexions sur le marché.",
  },
  alternates: {
    canonical: 'https://connaninvestment.com/rapports',
  },
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function RapportsPage() {
  const rapports = getRapportsByYear()

  return (
    <div className="px-6 py-16 md:py-20">
      <div className="max-w-3xl mx-auto">
        {/* En-tête */}
        <span className="section-label">Documentation</span>
        <h1 className="mt-3 text-3xl font-serif font-medium text-navy">Rapports annuels</h1>
        <div className="divider-gold mt-4 mb-4" />
        <p className="text-[14px] text-gray-500 leading-relaxed mb-6">
          Chaque année, nous publions un rapport complet couvrant la performance du portefeuille,
          les décisions d&rsquo;investissement prises dans l&rsquo;exercice, et notre réflexion sur
          le marché. Ces rapports sont publiés à titre informatif.
        </p>
        <div className="flex items-start gap-3 border border-gray-200 px-4 py-3.5 mb-12">
          <svg
            className="w-4 h-4 text-brand-blue flex-shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-[13px] text-gray-600 leading-relaxed">
            <span className="font-medium text-navy">Calendrier :</span> l&rsquo;exercice social de
            Connan Investment clôture au <span className="font-medium">30 juin</span> de chaque
            année. Le rapport annuel est publié le{' '}
            <span className="font-medium">1er août</span> suivant.
          </p>
        </div>

        {/* Liste des rapports */}
        <div className="flex flex-col gap-6">
          {rapports.map((rapport) => (
            <article
              key={rapport.annee}
              className="border border-gray-200 bg-white"
            >
              {/* Header du rapport */}
              <div className="flex items-start justify-between gap-6 px-6 py-5 border-b border-gray-100">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-2xl font-serif font-medium text-navy">
                      {rapport.annee}
                    </span>
                    <span className="text-[11px] text-gray-400">{rapport.pages} pages</span>
                  </div>
                  <p className="text-[14px] font-medium text-navy">{rapport.titre}</p>
                </div>

                {/* Performance */}
                <div className="text-right flex-shrink-0">
                  <p className="text-[11px] text-gray-400 uppercase tracking-wide mb-1">
                    Performance
                  </p>
                  <p className="text-[15px] font-medium text-navy">
                    {rapport.rendementPortefeuille}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{rapport.rendementComparaison}</p>
                </div>
              </div>

              {/* Corps */}
              <div className="px-6 py-5">
                <p className="text-[13px] text-gray-500 leading-relaxed mb-5">{rapport.resume}</p>

                <div className="flex items-center justify-between">
                  <p className="text-[11px] text-gray-400">
                    Publié le {formatDate(rapport.publie)}
                  </p>

                  <a
                    href={rapport.fichier}
                    className="inline-flex items-center gap-2 text-[13px] font-medium text-navy border border-navy px-4 py-2 hover:bg-navy hover:text-white transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h4a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                      />
                    </svg>
                    Télécharger PDF
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {rapports.length === 0 && (
          <p className="text-[14px] text-gray-400 text-center py-16">
            Aucun rapport publié pour le moment.
          </p>
        )}

        {/* Disclaimer */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-[11px] text-gray-400 leading-relaxed">
          <strong className="text-gray-500">Avertissement :</strong> Ces rapports sont publiés à
          titre informatif uniquement. Ils ne constituent pas un conseil en investissement, une
          sollicitation ni une offre. Les performances passées ne préjugent pas des performances
          futures. Tout investissement comporte un risque de perte en capital.
        </div>
      </div>
    </div>
  )
}
