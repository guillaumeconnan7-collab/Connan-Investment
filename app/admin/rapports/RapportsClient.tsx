'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Rapport } from '@/lib/rapports'

interface Props {
  initialRapports: Rapport[]
}

const emptyForm = {
  annee: new Date().getFullYear(),
  titre: '',
  resume: '',
  fichier: '',
  publie: new Date().toISOString().slice(0, 10),
  pages: 0,
  rendementPortefeuille: '',
  rendementComparaison: 'MSCI World (EUR)',
}

type FormState = typeof emptyForm

export default function RapportsClient({ initialRapports }: Props) {
  const router = useRouter()
  const [rapports, setRapports] = useState(initialRapports)
  const [showForm, setShowForm] = useState(false)
  const [editAnnee, setEditAnnee] = useState<number | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function field(key: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const val = key === 'annee' || key === 'pages' ? Number(e.target.value) : e.target.value
      setForm((f) => ({ ...f, [key]: val }))
    }
  }

  function openNew() {
    setForm(emptyForm)
    setEditAnnee(null)
    setError('')
    setShowForm(true)
  }

  function openEdit(r: Rapport) {
    setForm({ ...r })
    setEditAnnee(r.annee)
    setError('')
    setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!form.fichier) {
      setError('Veuillez saisir le chemin du fichier PDF.')
      return
    }

    setLoading(true)
    const payload: Rapport = { ...form }

    const url = editAnnee ? `/api/rapports/${editAnnee}` : '/api/rapports'
    const method = editAnnee ? 'PUT' : 'POST'

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
    const listRes = await fetch('/api/rapports')
    const list: Rapport[] = await listRes.json()
    setRapports(list.sort((a, b) => b.annee - a.annee))
    router.refresh()
  }

  async function handleDelete(annee: number) {
    if (!confirm(`Supprimer le rapport ${annee} ?`)) return
    await fetch(`/api/rapports/${annee}`, { method: 'DELETE' })
    setRapports((prev) => prev.filter((r) => r.annee !== annee))
    router.refresh()
  }

  return (
    <div>
      {!showForm && (
        <div className="mb-6">
          <button
            onClick={openNew}
            className="text-[13px] font-medium text-white bg-navy px-5 py-2.5 hover:bg-navy-light transition-colors"
          >
            + Nouveau rapport
          </button>
        </div>
      )}

      {/* Formulaire */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-6 mb-8 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-serif font-medium text-navy">
              {editAnnee ? `Modifier le rapport ${editAnnee}` : 'Nouveau rapport annuel'}
            </h2>
            <button type="button" onClick={() => setShowForm(false)} className="text-[12px] text-gray-400 hover:text-gray-700">
              Annuler
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-medium text-gray-600">Année *</label>
              <input type="number" required min={2000} max={2100} value={form.annee} onChange={field('annee')} className="admin-input" disabled={!!editAnnee} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-medium text-gray-600">Titre *</label>
              <input type="text" required value={form.titre} onChange={field('titre')} className="admin-input" placeholder="ex: Rapport Annuel 2025" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-medium text-gray-600">Date de publication *</label>
              <input type="date" required value={form.publie} onChange={field('publie')} className="admin-input" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-medium text-gray-600">Nombre de pages</label>
              <input type="number" min={0} value={form.pages} onChange={field('pages')} className="admin-input" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-medium text-gray-600">Performance portefeuille</label>
              <input type="text" value={form.rendementPortefeuille} onChange={field('rendementPortefeuille')} className="admin-input" placeholder="ex: +12,4 %" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-medium text-gray-600">Benchmark</label>
              <input type="text" value={form.rendementComparaison} onChange={field('rendementComparaison')} className="admin-input" placeholder="ex: MSCI World (EUR)" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-medium text-gray-600">Résumé *</label>
            <textarea required rows={4} value={form.resume} onChange={field('resume')} className="admin-input resize-y" />
          </div>

          {/* Chemin PDF */}
          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-medium text-gray-600">Chemin du fichier PDF *</label>
            <input
              type="text"
              required
              value={form.fichier}
              onChange={field('fichier')}
              className="admin-input font-mono"
              placeholder="ex: /rapports/rapport-s1-2026.pdf"
            />
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 px-3 py-2.5">
              <svg className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-[11px] text-amber-700 leading-relaxed">
                Le site est hébergé sur <strong>Vercel</strong> — l&rsquo;upload direct n&rsquo;est pas possible.
                Place ton PDF dans <code className="bg-amber-100 px-1">public/rapports/</code> du repo GitHub,
                pousse sur main, puis saisis le chemin ici (ex&nbsp;: <code className="bg-amber-100 px-1">/rapports/rapport-s1-2026.pdf</code>).
              </p>
            </div>
          </div>

          {error && (
            <p className="text-[12px] text-red-600 bg-red-50 border border-red-200 px-3 py-2">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading || uploading}
              className="text-[13px] font-medium text-white bg-navy px-5 py-2.5 hover:bg-navy-light transition-colors disabled:opacity-50"
            >
              {loading ? 'Enregistrement…' : editAnnee ? 'Mettre à jour' : 'Publier'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-[13px] font-medium text-gray-500 border border-gray-300 px-5 py-2.5 hover:border-gray-500 transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {/* Liste */}
      <div className="bg-white border border-gray-200 divide-y divide-gray-100">
        {rapports.length === 0 && (
          <p className="px-4 py-6 text-[13px] text-gray-400 text-center">Aucun rapport publié.</p>
        )}
        {rapports.map((r) => (
          <div key={r.annee} className="flex items-center justify-between px-4 py-4 gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <span className="font-serif text-lg font-medium text-navy">{r.annee}</span>
                <span className="text-[13px] text-gray-600">{r.titre}</span>
              </div>
              <p className="text-[11px] text-gray-400">
                {r.pages} pages · Publié le {r.publie}
                {r.rendementPortefeuille && ` · Perf: ${r.rendementPortefeuille}`}
              </p>
              <p className="text-[11px] text-gray-400 font-mono mt-0.5">{r.fichier}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {r.fichier && (
                <a
                  href={r.fichier}
                  target="_blank"
                  className="text-[12px] text-gray-400 hover:text-navy px-2 py-1 transition-colors"
                >
                  PDF ↗
                </a>
              )}
              <button
                onClick={() => openEdit(r)}
                className="text-[12px] text-gray-500 border border-gray-300 px-3 py-1 hover:border-navy hover:text-navy transition-colors"
              >
                Modifier
              </button>
              <button
                onClick={() => handleDelete(r.annee)}
                className="text-[12px] text-red-500 border border-red-200 px-3 py-1 hover:bg-red-50 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
