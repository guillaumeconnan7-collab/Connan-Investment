import Link from 'next/link'
import { getAllAnalyses } from '@/lib/analyses'
import { getPositions, getPortfolioMeta } from '@/lib/portfolio'
import { getRapportsByYear } from '@/lib/rapports'

const pilliers = [
  'Analyse fondamentale',
  'Approche contrarienne',
  'Horizon long terme',
  'Sans effet de levier',
  'Actions mondiales',
]

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function HomePage() {
  const analyses = getAllAnalyses().slice(0, 3)
  const topPositions = getPositions().slice(0, 4)
  const portfolioMeta = getPortfolioMeta()
  const latestRapport = getRapportsByYear()[0]

  return (
    <div className="flex flex-col">
      {/* ── Hero ─────────────────────────────────── */}
      <section className="flex-1 flex items-center justify-center px-6 py-20 md:py-28">
        <div className="w-full max-w-4xl">
          <span className="section-label">Société d&rsquo;investissement</span>

          <h1
            className="mt-4 text-[2rem] md:text-[2.25rem] font-serif font-medium text-navy leading-tight tracking-tight"
          >
            Investir avec rigueur,<br />penser sur le long terme.
          </h1>

          <p className="mt-4 text-[15px] text-gray-500 leading-relaxed">
            Connan Investment est une société d&rsquo;investissement fondée sur l&rsquo;analyse
            fondamentale et comptable des entreprises, l&rsquo;étude de la psychologie de marché et
            une discipline sans effet de levier.
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {pilliers.map((p) => (
              <span key={p} className="pill">
                {p}
              </span>
            ))}
          </div>

          <div className="mt-10 pt-8 border-t border-gray-200">
            <blockquote>
              <p className="text-[14px] text-gray-500 italic leading-relaxed pl-4 border-l-2 border-gold">
                &laquo;&nbsp;Nous ne cherchons pas à prédire les marchés. Nous cherchons à comprendre
                les entreprises, et à laisser le temps faire son œuvre.&nbsp;&raquo;
              </p>
              <footer className="mt-2 pl-4 text-[12px] text-gray-400">
                — Guillaume Connan, fondateur
              </footer>
            </blockquote>
          </div>

          <div className="mt-8 flex gap-4">
            <Link
              href="/analyses"
              className="text-[13px] font-medium text-white bg-navy px-5 py-2.5 hover:bg-navy-light transition-colors"
            >
              Lire les analyses
            </Link>
            <Link
              href="/philosophie"
              className="text-[13px] font-medium text-navy border border-navy px-5 py-2.5 hover:bg-navy hover:text-white transition-colors"
            >
              Notre philosophie
            </Link>
          </div>
        </div>
      </section>

      {/* ── Dernières analyses ────────────────────── */}
      <section className="border-t border-gray-200 bg-gray-50 px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <span className="section-label">Publications</span>
              <h2 className="mt-1.5 text-xl font-serif text-navy">Dernières analyses</h2>
            </div>
            <Link href="/analyses" className="text-[12px] text-gray-500 hover:text-navy transition-colors">
              Voir toutes →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {analyses.map((a) => (
              <Link key={a.slug} href={`/analyses/${a.slug}`} className="group">
                <article className="card h-full flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">
                      {a.secteur}
                    </span>
                    <span
                      className={
                        a.recommandation === 'Achat'
                          ? 'badge-achat'
                          : a.recommandation === 'Neutre'
                            ? 'badge-neutre'
                            : 'badge-suivi'
                      }
                    >
                      {a.recommandation}
                    </span>
                  </div>

                  <h3 className="text-[15px] font-serif font-medium text-navy leading-snug group-hover:text-navy-light transition-colors mb-2">
                    {a.titre}
                  </h3>

                  <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-3 flex-1">
                    {a.resume}
                  </p>

                  <p className="mt-4 text-[11px] text-gray-400">{formatDate(a.date)}</p>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Aperçu portefeuille ───────────────────── */}
      <section className="border-t border-gray-200 bg-white px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <span className="section-label">Portefeuille</span>
              <h2 className="mt-1.5 text-xl font-serif text-navy">Principales positions</h2>
              <p className="text-[12px] text-gray-400 mt-1">
                Au {new Date(portfolioMeta.dernierePublication).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })} — non temps réel
              </p>
            </div>
            <Link href="/portefeuille" className="text-[12px] text-gray-500 hover:text-navy transition-colors">
              Voir tout →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 pr-6 text-[11px] font-medium text-gray-400 uppercase tracking-wide">Entreprise</th>
                  <th className="text-left py-2 pr-6 text-[11px] font-medium text-gray-400 uppercase tracking-wide">Secteur</th>
                  <th className="text-left py-2 pr-6 text-[11px] font-medium text-gray-400 uppercase tracking-wide">Géographie</th>
                  <th className="text-right py-2 text-[11px] font-medium text-gray-400 uppercase tracking-wide">Poids</th>
                </tr>
              </thead>
              <tbody>
                {topPositions.map((p) => (
                  <tr key={p.ticker} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 pr-6">
                      <span className="font-medium text-navy">{p.entreprise}</span>
                      <span className="ml-2 text-[11px] text-gray-400">{p.ticker}</span>
                    </td>
                    <td className="py-3 pr-6 text-gray-500">{p.secteur}</td>
                    <td className="py-3 pr-6 text-gray-500">{p.geographie}</td>
                    <td className="py-3 text-right font-medium text-navy">{p.poids}&nbsp;%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Dernier rapport ───────────────────────── */}
      {latestRapport && (
        <section className="border-t border-gray-200 bg-gray-50 px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-baseline justify-between mb-8">
              <div>
                <span className="section-label">Rapports annuels</span>
                <h2 className="mt-1.5 text-xl font-serif text-navy">Dernière publication</h2>
              </div>
              <Link href="/rapports" className="text-[12px] text-gray-500 hover:text-navy transition-colors">
                Archives →
              </Link>
            </div>

            <div className="card max-w-xl">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h3 className="text-lg font-serif font-medium text-navy">{latestRapport.titre}</h3>
                <span className="text-[11px] text-gray-400 whitespace-nowrap pt-1">
                  {latestRapport.pages} pages
                </span>
              </div>
              <p className="text-[13px] text-gray-500 leading-relaxed mb-6">{latestRapport.resume}</p>
              <a
                href={latestRapport.fichier}
                className="inline-flex items-center gap-2 text-[13px] font-medium text-navy border border-navy px-4 py-2 hover:bg-navy hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h4a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                Télécharger le PDF
              </a>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
