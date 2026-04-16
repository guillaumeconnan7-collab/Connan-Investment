import Link from 'next/link'
import { getAllAnalyses } from '@/lib/analyses'
import { getPositions } from '@/lib/portfolio'
import { getRapportsByYear } from '@/lib/rapports'
import AdminNav from './AdminNav'

export const dynamic = 'force-dynamic'

export default function AdminDashboard() {
  const analyses = getAllAnalyses()
  const positions = getPositions()
  const rapports = getRapportsByYear()

  return (
    <div>
      <AdminNav />
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-serif font-medium text-navy mb-2">Tableau de bord</h1>
        <p className="text-[13px] text-gray-500 mb-10">Gérez les contenus du site Connan Investment.</p>

        <div className="grid md:grid-cols-3 gap-4">
          {/* Analyses */}
          <div className="bg-white border border-gray-200 p-5">
            <p className="text-[11px] text-gray-400 uppercase tracking-wide mb-1">Analyses</p>
            <p className="text-3xl font-serif font-medium text-navy mb-4">{analyses.length}</p>
            <Link
              href="/admin/analyses"
              className="block text-center text-[12px] font-medium text-white bg-navy px-4 py-2 hover:bg-navy-light transition-colors"
            >
              Gérer →
            </Link>
          </div>

          {/* Portefeuille */}
          <div className="bg-white border border-gray-200 p-5">
            <p className="text-[11px] text-gray-400 uppercase tracking-wide mb-1">Positions</p>
            <p className="text-3xl font-serif font-medium text-navy mb-4">{positions.length}</p>
            <Link
              href="/admin/portefeuille"
              className="block text-center text-[12px] font-medium text-white bg-navy px-4 py-2 hover:bg-navy-light transition-colors"
            >
              Gérer →
            </Link>
          </div>

          {/* Rapports */}
          <div className="bg-white border border-gray-200 p-5">
            <p className="text-[11px] text-gray-400 uppercase tracking-wide mb-1">Rapports annuels</p>
            <p className="text-3xl font-serif font-medium text-navy mb-4">{rapports.length}</p>
            <Link
              href="/admin/rapports"
              className="block text-center text-[12px] font-medium text-white bg-navy px-4 py-2 hover:bg-navy-light transition-colors"
            >
              Gérer →
            </Link>
          </div>
        </div>

        {/* Aperçu dernières analyses */}
        <div className="mt-10">
          <h2 className="text-base font-serif text-navy mb-4">Dernières analyses publiées</h2>
          <div className="bg-white border border-gray-200 divide-y divide-gray-100">
            {analyses.slice(0, 5).map((a) => (
              <div key={a.slug} className="flex items-center justify-between px-4 py-3 text-[13px]">
                <div>
                  <span className="font-medium text-navy">{a.titre}</span>
                  <span className="ml-3 text-gray-400">{a.date}</span>
                </div>
                <span className={
                  a.recommandation === 'Achat' ? 'badge-achat' :
                  a.recommandation === 'Neutre' ? 'badge-neutre' : 'badge-suivi'
                }>
                  {a.recommandation}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
