'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Analyse } from '@/lib/analyses'

interface Props {
  initialAnalyses: Analyse[]
}

const RECO_OPTIONS = ['Achat', 'Neutre', 'Suivi'] as const

function sectionsToForm(a: Analyse) {
  const descParas = a.sections.description
    .filter((s) => s.type === 'paragraph')
    .map((s) => (s as { type: 'paragraph'; text: string }).text)
    .join('\n\n')

  const theseParas = a.sections.these
    .filter((s) => s.type === 'paragraph')
    .map((s) => (s as { type: 'paragraph'; text: string }).text)
    .join('\n\n')

  return {
    titre: a.titre,
    entreprise: a.entreprise,
    ticker: a.ticker,
    bourse: a.bourse,
    secteur: a.secteur,
    geographie: a.geographie,
    date: a.date,
    resume: a.resume,
    recommandation: a.recommandation,
    descriptionText: descParas,
    theseText: theseParas,
    points_cles_text: a.sections.points_cles.join('\n'),
    risques_text: a.sections.risques.join('\n'),
    conclusion: a.sections.conclusion,
  }
}

const emptyForm = {
  titre: '',
  entreprise: '',
  ticker: '',
  bourse: '',
  secteur: '',
  geographie: '',
  date: new Date().toISOString().slice(0, 10),
  resume: '',
  recommandation: 'Neutre' as 'Achat' | 'Neutre' | 'Suivi',
  descriptionText: '',
  theseText: '',
  points_cles_text: '',
  risques_text: '',
  conclusion: '',
}

type FormState = typeof emptyForm

export default function AnalysesClient({ initialAnalyses }: Props) {
  const router = useRouter()
  const [analyses, setAnalyses] = useState(initialAnalyses)
  const [showForm, setShowForm] = useState(false)
  const [editSlug, setEditSlug] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function openNew() {
    setForm(emptyForm)
    setEditSlug(null)
    setError('')
    setShowForm(true)
  }

  function openEdit(a: Analyse) {
    setForm(sectionsToForm(a))
    setEditSlug(a.slug)
    setError('')
    setShowForm(true)
  }

  function field(key: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const payload = {
      ...form,
      sections: { conclusion: form.conclusion },
    }

    const url = editSlug ? `/api/analyses/${editSlug}` : '/api/analyses'
    const method = editSlug ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    setLoading(false)

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? 'Erreur lors de la sauvegarde.')
      return
    }

    setShowForm(false)
    router.refresh()

    // Rafraîchit la liste côté client
    const listRes = await fetch('/api/analyses')
    setAnalyses(await listRes.json())
  }

  async function handleDelete(slug: string) {
    if (!confirm('Supprimer cette analyse définitivement ?')) return
    await fetch(`/api/analyses/${slug}`, { method: 'DELETE' })
    setAnalyses((prev) => prev.filter((a) => a.slug !== slug))
    router.refresh()
  }

  return (
    <div>
      {/* Bouton Nouvelle analyse */}
      {!showForm && (
        <div className="mb-6">
          <button
            onClick={openNew}
            className="text-[13px] font-medium text-white bg-navy px-5 py-2.5 hover:bg-navy-light transition-colors"
          >
            + Nouvelle analyse
          </button>
        </div>
      )}

      {/* Formulaire */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-6 mb-8 flex flex-col gap-5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-serif font-medium text-navy">
              {editSlug ? 'Modifier l\'analyse' : 'Nouvelle analyse'}
            </h2>
            <button type="button" onClick={() => setShowForm(false)} className="text-[12px] text-gray-400 hover:text-gray-700">
              Annuler
            </button>
          </div>

          {/* Champs de base */}
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Titre" required>
              <input type="text" required value={form.titre} onChange={field('titre')} className="admin-input" />
            </FormField>
            <FormField label="Entreprise" required>
              <input type="text" required value={form.entreprise} onChange={field('entreprise')} className="admin-input" />
            </FormField>
            <FormField label="Ticker" required>
              <input type="text" required value={form.ticker} onChange={field('ticker')} className="admin-input" placeholder="ex: MUV2" />
            </FormField>
            <FormField label="Bourse" required>
              <input type="text" required value={form.bourse} onChange={field('bourse')} className="admin-input" placeholder="ex: Xetra" />
            </FormField>
            <FormField label="Secteur" required>
              <input type="text" required value={form.secteur} onChange={field('secteur')} className="admin-input" />
            </FormField>
            <FormField label="Pays / Géographie" required>
              <input type="text" required value={form.geographie} onChange={field('geographie')} className="admin-input" />
            </FormField>
            <FormField label="Date de publication" required>
              <input type="date" required value={form.date} onChange={field('date')} className="admin-input" />
            </FormField>
            <FormField label="Recommandation" required>
              <select required value={form.recommandation} onChange={field('recommandation')} className="admin-input">
                {RECO_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </FormField>
          </div>

          <FormField label="Résumé (chapeau)" required>
            <textarea required rows={3} value={form.resume} onChange={field('resume')} className="admin-input resize-y" />
          </FormField>

          <FormField label="Description de l'entreprise" hint="Séparer les paragraphes par une ligne vide">
            <textarea rows={5} value={form.descriptionText} onChange={field('descriptionText')} className="admin-input resize-y" />
          </FormField>

          <FormField label="Thèse d'investissement" hint="Séparer les paragraphes par une ligne vide">
            <textarea rows={5} value={form.theseText} onChange={field('theseText')} className="admin-input resize-y" />
          </FormField>

          <FormField label="Points clés" hint="Un point par ligne">
            <textarea rows={5} value={form.points_cles_text} onChange={field('points_cles_text')} className="admin-input resize-y" placeholder="Premier point clé&#10;Deuxième point clé&#10;..." />
          </FormField>

          <FormField label="Risques" hint="Un risque par ligne">
            <textarea rows={4} value={form.risques_text} onChange={field('risques_text')} className="admin-input resize-y" placeholder="Premier risque&#10;Deuxième risque&#10;..." />
          </FormField>

          <FormField label="Conclusion" required>
            <textarea required rows={4} value={form.conclusion} onChange={field('conclusion')} className="admin-input resize-y" />
          </FormField>

          {error && (
            <p className="text-[12px] text-red-600 bg-red-50 border border-red-200 px-3 py-2">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="text-[13px] font-medium text-white bg-navy px-5 py-2.5 hover:bg-navy-light transition-colors disabled:opacity-50"
            >
              {loading ? 'Enregistrement…' : editSlug ? 'Mettre à jour' : 'Publier'}
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

      {/* Liste des analyses */}
      <div className="bg-white border border-gray-200 divide-y divide-gray-100">
        {analyses.length === 0 && (
          <p className="px-4 py-6 text-[13px] text-gray-400 text-center">Aucune analyse publiée.</p>
        )}
        {analyses.map((a) => (
          <div key={a.slug} className="flex items-center justify-between px-4 py-3.5 gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-0.5">
                <span className="font-medium text-[13px] text-navy truncate">{a.titre}</span>
                <span className={
                  a.recommandation === 'Achat' ? 'badge-achat' :
                  a.recommandation === 'Neutre' ? 'badge-neutre' : 'badge-suivi'
                }>
                  {a.recommandation}
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                {a.ticker} · {a.secteur} · {a.date}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <a
                href={`/analyses/${a.slug}`}
                target="_blank"
                className="text-[12px] text-gray-400 hover:text-navy px-2 py-1 transition-colors"
              >
                Voir ↗
              </a>
              <button
                onClick={() => openEdit(a)}
                className="text-[12px] text-gray-500 border border-gray-300 px-3 py-1 hover:border-navy hover:text-navy transition-colors"
              >
                Modifier
              </button>
              <button
                onClick={() => handleDelete(a.slug)}
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

function FormField({ label, hint, required, children }: {
  label: string
  hint?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[12px] font-medium text-gray-600">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
        {hint && <span className="ml-2 font-normal text-gray-400">({hint})</span>}
      </label>
      {children}
    </div>
  )
}
