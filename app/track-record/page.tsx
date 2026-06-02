import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Track Record',
  description:
    "Suivi de la performance du portefeuille de Connan Investment dans le temps. Premier track record publié avec le rapport semestriel du 30 juin 2026.",
  keywords: [
    'track record',
    'performance portefeuille',
    'historique performance',
    'value investing',
    'investissement long terme',
    'rendement portefeuille',
    'Connan Investment',
  ],
  openGraph: {
    title: 'Track Record — Connan Investment',
    description:
      "Suivi de la performance du portefeuille de Connan Investment. Premier track record publié en juillet 2026.",
    url: 'https://connaninvestment.com/track-record',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Track Record — Connan Investment',
    description: "Suivi de la performance du portefeuille. Premier track record en juillet 2026.",
  },
  alternates: {
    canonical: 'https://connaninvestment.com/track-record',
  },
}

export default function TrackRecordPage() {
  return (
    <div className="px-6 py-16 md:py-20">
      <div className="max-w-3xl mx-auto">
        {/* En-tête */}
        <span className="section-label">Performance</span>
        <h1 className="mt-3 text-3xl font-serif font-medium text-navy">Track Record</h1>
        <div className="divider-gold mt-4 mb-4" />
        <p className="text-[14px] text-gray-500 leading-relaxed mb-12">
          L&rsquo;historique de performance sera publié ici, semestriellement, avec transparence
          sur la méthode de calcul, les positions et les décisions prises.
        </p>

        {/* Encadré jalon */}
        <div className="flex items-start gap-3 border border-gray-200 px-4 py-3.5 mb-8">
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
            <span className="font-medium text-navy">Premier track record :</span> publié avec le
            rapport semestriel couvrant la période de création de la société au{' '}
            <span className="font-medium">30 juin 2026</span>. Publication prévue en{' '}
            <span className="font-medium">juillet 2026</span>.
          </p>
        </div>

        {/* État en construction */}
        <div className="border border-gray-200 bg-gray-50 py-16 text-center">
          <p className="text-[13px] text-gray-400 mb-1">Aucun ordre passé à ce jour</p>
          <p className="text-[11px] text-gray-300 uppercase tracking-widest">
            En construction
          </p>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-[11px] text-gray-400 leading-relaxed">
          <strong className="text-gray-500">Avertissement :</strong> Les performances publiées le
          seront à titre informatif uniquement. Elles ne constituent pas un conseil en
          investissement ni une sollicitation. Les performances passées ne préjugent pas des
          performances futures. Tout investissement comporte un risque de perte en capital.
        </div>
      </div>
    </div>
  )
}
