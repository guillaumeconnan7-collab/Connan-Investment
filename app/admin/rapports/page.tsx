import { getRapportsByYear } from '@/lib/rapports'
import AdminNav from '../AdminNav'
import RapportsClient from './RapportsClient'

export const dynamic = 'force-dynamic'

export default function AdminRapportsPage() {
  const rapports = getRapportsByYear()
  return (
    <div>
      <AdminNav />
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-serif font-medium text-navy mb-8">Rapports annuels</h1>
        <RapportsClient initialRapports={rapports} />
      </main>
    </div>
  )
}
