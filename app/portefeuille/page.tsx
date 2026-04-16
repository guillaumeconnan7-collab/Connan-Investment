import type { Metadata } from 'next'
import {
  getPositions,
  getPortfolioMeta,
  getSecteurBreakdown,
  getGeographieBreakdown,
} from '@/lib/portfolio'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Portefeuille',
  description:
    'Portefeuille de Connan Investment : positions publiées à la dernière date de mise à jour.',
}

function formatPublicationDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function formatDateEntree(ym: string) {
  const [year, month] = ym.split('-')
  return new Date(parseInt(year), parseInt(month) - 1, 1).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
  })
}

export default function PortefeuillePage() {
  const positions = getPositions()
  const portfolioMeta = getPortfolioMeta()
  const secteurs = getSecteurBreakdown()
  const geographies = getGeographieBreakdown()
  const totalInvesti = positions.reduce((sum, p) => sum + p.poids, 0)
  const liquidites = portfolioMeta.liquidites

  return (
    <div className="px-6 py-16 md:py-20">
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <span className="section-label">Allocation</span>
        <h1 className="mt-3 text-3xl font-serif font-medium text-navy">Portefeuille</h1>
        <div className="divider-gold mt-4 mb-4" />

        {/* Encadré rythme de publication + dernière mise à jour */}
        <div className="border border-gray-200 divide-y divide-gray-100 mb-10">
          <div className="flex items-start gap-3 px-4 py-3.5">
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
              <span className="font-medium text-navy">Rythme de publication :</span>{' '}
              les positions sont publiées deux fois par an, à la clôture de chaque semestre —
              au <span className="font-medium">30 juin</span> et au{' '}
              <span className="font-medium">31 décembre</span>.
            </p>
          </div>
          <div className="flex items-start gap-3 px-4 py-3.5 bg-amber-50">
            <svg
              className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-[13px] text-amber-700 leading-relaxed">
              <span className="font-medium">Dernière mise à jour :</span>{' '}
              {formatPublicationDate(portfolioMeta.dernierePublication)}. Ces données reflètent la
              composition du portefeuille à cette date et ne sont pas mises à jour en temps réel.
              Les pondérations ont pu évoluer depuis.
            </p>
          </div>
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          <div className="border border-gray-200 p-4">
            <p className="text-[11px] text-gray-400 uppercase tracking-wide mb-1">Positions</p>
            <p className="text-2xl font-serif font-medium text-navy">
              {portfolioMeta.nombrePositions}
            </p>
          </div>
          <div className="border border-gray-200 p-4">
            <p className="text-[11px] text-gray-400 uppercase tracking-wide mb-1">Investi</p>
            <p className="text-2xl font-serif font-medium text-navy">{totalInvesti}&nbsp;%</p>
          </div>
          <div className="border border-gray-200 p-4">
            <p className="text-[11px] text-gray-400 uppercase tracking-wide mb-1">Liquidités</p>
            <p className="text-2xl font-serif font-medium text-navy">{liquidites}&nbsp;%</p>
          </div>
        </div>

        {/* Tableau des positions */}
        <section className="mb-12">
          <h2 className="text-lg font-serif text-navy mb-5">Positions</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-gray-200">
                  {[
                    'Entreprise',
                    'Ticker',
                    'Secteur',
                    'Géographie',
                    'Poids',
                    'Depuis',
                  ].map((col) => (
                    <th
                      key={col}
                      className={`py-2.5 text-[11px] font-medium text-gray-400 uppercase tracking-wide ${
                        col === 'Poids' ? 'text-right' : 'text-left pr-5'
                      }`}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {positions
                  .slice()
                  .sort((a, b) => b.poids - a.poids)
                  .map((p) => (
                    <tr key={p.ticker} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3.5 pr-5">
                        <span className="font-medium text-navy">{p.entreprise}</span>
                      </td>
                      <td className="py-3.5 pr-5 text-gray-400 font-mono text-[12px]">
                        {p.ticker}
                      </td>
                      <td className="py-3.5 pr-5 text-gray-500">{p.secteur}</td>
                      <td className="py-3.5 pr-5 text-gray-500">{p.geographie}</td>
                      <td className="py-3.5 text-right">
                        <div className="flex items-center justify-end gap-3">
                          {/* Barre de progression */}
                          <div className="hidden sm:block w-16 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-navy rounded-full"
                              style={{ width: `${Math.min((p.poids / 15) * 100, 100)}%` }}
                            />
                          </div>
                          <span className="font-medium text-navy w-10 text-right">
                            {p.poids}&nbsp;%
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 text-gray-400 text-[12px] pl-4">
                        {formatDateEntree(p.dateEntree)}
                      </td>
                    </tr>
                  ))}
                {/* Ligne liquidités */}
                <tr className="border-b border-gray-100 bg-gray-50">
                  <td colSpan={4} className="py-3.5 pr-5 text-gray-400 italic text-[13px]">
                    Liquidités
                  </td>
                  <td className="py-3.5 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <div className="hidden sm:block w-16 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gray-300 rounded-full"
                          style={{ width: `${Math.min((liquidites / 15) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-gray-400 w-10 text-right">{liquidites}&nbsp;%</span>
                    </div>
                  </td>
                  <td className="py-3.5" />
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Répartition */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Par secteur */}
          <section>
            <h2 className="text-base font-serif text-navy mb-4">Par secteur</h2>
            <div className="border border-gray-200 divide-y divide-gray-100">
              {secteurs.map(({ secteur, poids }) => (
                <div key={secteur} className="flex items-center justify-between px-4 py-3 text-[13px]">
                  <span className="text-gray-600">{secteur}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-gray-100 h-1 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-navy rounded-full"
                        style={{ width: `${Math.min((poids / 20) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="font-medium text-navy w-10 text-right">{poids}&nbsp;%</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Par géographie */}
          <section>
            <h2 className="text-base font-serif text-navy mb-4">Par géographie</h2>
            <div className="border border-gray-200 divide-y divide-gray-100">
              {geographies.map(({ geo, poids }) => (
                <div key={geo} className="flex items-center justify-between px-4 py-3 text-[13px]">
                  <span className="text-gray-600">{geo}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-gray-100 h-1 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-navy rounded-full"
                        style={{ width: `${Math.min((poids / 20) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="font-medium text-navy w-10 text-right">{poids}&nbsp;%</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-[11px] text-gray-400 leading-relaxed">
          <strong className="text-gray-500">Avertissement :</strong> Les informations présentées
          ici correspondent à la composition du portefeuille à la date de dernière publication. Elles
          ne sont pas mises à jour en temps réel et ne reflètent pas nécessairement la composition
          actuelle. Elles sont publiées à titre informatif uniquement et ne constituent pas un conseil
          en investissement. Tout investissement comporte un risque de perte en capital.
        </div>
      </div>
    </div>
  )
}
