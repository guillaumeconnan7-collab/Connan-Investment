'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Position, PortfolioMeta } from '@/lib/portfolio'

interface PortfolioData {
  meta: PortfolioMeta
  positions: Position[]
}

interface Props {
  initialData: PortfolioData
}

const emptyPosition: Omit<Position, 'poids'> & { poids: string } = {
  entreprise: '',
  ticker: '',
  bourse: '',
  secteur: '',
  geographie: '',
  poids: '',
  dateEntree: '',
  these: '',
}

export default function PortefeuilleClient({ initialData }: Props) {
  const router = useRouter()
  const [data, setData] = useState(initialData)
  const [meta, setMeta] = useState(initialData.meta)
  const [metaDirty, setMetaDirty] = useState(false)
  const [metaLoading, setMetaLoading] = useState(false)

  const [showForm, setShowForm] = useState(false)
  const [editTicker, setEditTicker] = useState<string | null>(null)
  const [form, setForm] = useState(emptyPosition)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function field(key: keyof typeof emptyPosition) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }))
    }
  }

  function metaField(key: keyof PortfolioMeta) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setMeta((m) => ({ ...m, [key]: key === 'nombrePositions' || key === 'liquidites' ? Number(e.target.value) : e.target.value }))
      setMetaDirty(true)
    }
  }

  async function saveMeta(e: React.FormEvent) {
    e.preventDefault()
    setMetaLoading(true)
    await fetch('/api/portfolio', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ meta }),
    })
    setMetaLoading(false)
    setMetaDirty(false)
    router.refresh()
  }

  function openNew() {
    setForm(emptyPosition)
    setEditTicker(null)
    setError('')
    setShowForm(true)
  }

  function openEdit(p: Position) {
    setForm({ ...p, poids: String(p.poids) })
    setEditTicker(p.ticker)
    setError('')
    setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const payload: Position = { ...form, poids: Number(form.poids) }

    const url = editTicker ? `/api/portfolio/${editTicker}` : '/api/portfolio'
    const method = editTicker ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    setLoading(false)

    if (!res.ok) {
      const d = await res.json()
      setError(d.error ?? 'Erreur lors de la sauvegarde.')
      return
    }

    setShowForm(false)
    const refreshed = await fetch('/api/portfolio')
    const refreshedData: PortfolioData = await refreshed.json()
    setData(refreshedData)
    router.refresh()
  }

  async function handleDelete(ticker: string) {
    if (!confirm(`Supprimer la position ${ticker} ?`)) return
    await fetch(`/api/portfolio/${ticker}`, { method: 'DELETE' })
    const refreshed = await fetch('/api/portfolio')
    setData(await refreshed.json())
    router.refresh()
  }

  const totalPoids = data.positions.reduce((s, p) => s + p.poids, 0)

  return (
    <div className="flex flex-col gap-8">
      {/* Méta portefeuille */}
      <section className="bg-white border border-gray-200 p-6">
        <h2 className="text-base font-serif text-navy mb-4">Informations de publication</h2>
        <form onSubmit={saveMeta} className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-medium text-gray-600">Date de dernière publication</label>
            <input type="date" value={meta.dernierePublication} onChange={metaField('dernierePublication')} className="admin-input" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-medium text-gray-600">Rendement annualisé (texte)</label>
            <input type="text" value={meta.rendementAnnualise} onChange={metaField('rendementAnnualise')} className="admin-input" placeholder="ex: +14,2 %" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-medium text-gray-600">Nombre de positions affiché</label>
            <input type="number" min={0} value={meta.nombrePositions} onChange={metaField('nombrePositions')} className="admin-input" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-medium text-gray-600">Liquidités (%)</label>
            <input type="number" min={0} max={100} value={meta.liquidites} onChange={metaField('liquidites')} className="admin-input" />
          </div>
          <div className="col-span-2">
            <button
              type="submit"
              disabled={!metaDirty || metaLoading}
              className="text-[13px] font-medium text-white bg-navy px-5 py-2.5 hover:bg-navy-light transition-colors disabled:opacity-40"
            >
              {metaLoading ? 'Enregistrement…' : 'Enregistrer les méta'}
            </button>
          </div>
        </form>
      </section>

      {/* Positions */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-serif text-navy">
            Positions <span className="text-gray-400 font-sans text-[13px] font-normal">({totalPoids} % investi)</span>
          </h2>
          {!showForm && (
            <button
              onClick={openNew}
              className="text-[12px] font-medium text-white bg-navy px-4 py-2 hover:bg-navy-light transition-colors"
            >
              + Ajouter
            </button>
          )}
        </div>

        {/* Formulaire */}
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-6 mb-4 flex flex-col gap-4">
            <h3 className="text-sm font-medium text-navy">{editTicker ? 'Modifier la position' : 'Nouvelle position'}</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-medium text-gray-600">Entreprise *</label>
                <input type="text" required value={form.entreprise} onChange={field('entreprise')} className="admin-input" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-medium text-gray-600">Ticker *</label>
                <input type="text" required value={form.ticker} onChange={field('ticker')} className="admin-input" placeholder="ex: BRK.B" disabled={!!editTicker} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-medium text-gray-600">Bourse *</label>
                <input type="text" required value={form.bourse} onChange={field('bourse')} className="admin-input" placeholder="ex: NYSE" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-medium text-gray-600">Secteur *</label>
                <input type="text" required value={form.secteur} onChange={field('secteur')} className="admin-input" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-medium text-gray-600">Géographie *</label>
                <input type="text" required value={form.geographie} onChange={field('geographie')} className="admin-input" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-medium text-gray-600">Poids (%) *</label>
                <input type="number" required min={0} max={100} step={0.1} value={form.poids} onChange={field('poids')} className="admin-input" />
              </div>
              <div className="flex flex-col gap-1 col-span-2">
                <label className="text-[12px] font-medium text-gray-600">Date d'entrée (YYYY-MM) *</label>
                <input type="month" required value={form.dateEntree} onChange={field('dateEntree')} className="admin-input" />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-medium text-gray-600">Résumé de thèse *</label>
              <textarea required rows={3} value={form.these} onChange={field('these')} className="admin-input resize-y" />
            </div>

            {error && (
              <p className="text-[12px] text-red-600 bg-red-50 border border-red-200 px-3 py-2">{error}</p>
            )}

            <div className="flex gap-3">
              <button type="submit" disabled={loading} className="text-[13px] font-medium text-white bg-navy px-5 py-2.5 hover:bg-navy-light transition-colors disabled:opacity-50">
                {loading ? 'Enregistrement…' : editTicker ? 'Mettre à jour' : 'Ajouter'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="text-[13px] font-medium text-gray-500 border border-gray-300 px-5 py-2.5 hover:border-gray-500 transition-colors">
                Annuler
              </button>
            </div>
          </form>
        )}

        {/* Tableau */}
        <div className="bg-white border border-gray-200 divide-y divide-gray-100">
          {data.positions.length === 0 && (
            <p className="px-4 py-6 text-[13px] text-gray-400 text-center">Aucune position.</p>
          )}
          {data.positions
            .slice()
            .sort((a, b) => b.poids - a.poids)
            .map((p) => (
              <div key={p.ticker} className="flex items-center justify-between px-4 py-3.5 gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-medium text-[13px] text-navy">{p.entreprise}</span>
                    <span className="text-[11px] text-gray-400 font-mono">{p.ticker}</span>
                    <span className="text-[11px] font-medium text-navy">{p.poids} %</span>
                  </div>
                  <p className="text-[11px] text-gray-400">{p.secteur} · {p.geographie} · depuis {p.dateEntree}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => openEdit(p)}
                    className="text-[12px] text-gray-500 border border-gray-300 px-3 py-1 hover:border-navy hover:text-navy transition-colors"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(p.ticker)}
                    className="text-[12px] text-red-500 border border-red-200 px-3 py-1 hover:bg-red-50 transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  )
}
