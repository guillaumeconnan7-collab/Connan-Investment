import { getPortfolioData } from '@/lib/portfolio'
import AdminNav from '../AdminNav'
import PortefeuilleClient from './PortefeuilleClient'

export const dynamic = 'force-dynamic'

export default function AdminPortefeuillePage() {
  const data = getPortfolioData()
  return (
    <div>
      <AdminNav />
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-serif font-medium text-navy mb-8">Portefeuille</h1>
        <PortefeuilleClient initialData={data} />
      </main>
    </div>
  )
}
