import { getAllAnalyses } from '@/lib/analyses'
import AdminNav from '../AdminNav'
import AnalysesClient from './AnalysesClient'

export const dynamic = 'force-dynamic'

export default function AdminAnalysesPage() {
  const analyses = getAllAnalyses()
  return (
    <div>
      <AdminNav />
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-serif font-medium text-navy mb-8">Analyses</h1>
        <AnalysesClient initialAnalyses={analyses} />
      </main>
    </div>
  )
}
