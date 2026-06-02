'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Analyse } from '@/lib/analyses'

interface Props {
  initialAnalyses: Analyse[]
}

const CATEGORIES_SUGGESTIONS = ['Analyse', 'Essai', 'Réflexion', 'Note de marché', 'Autre']

const emptyForm = {
  titre: '',
  categorie: '',
  date: new Date().toISOString().slice(0, 10),
  resume: '',
  contenuText: '',
}

type FormState = typeof emptyForm

export default function AnalysesClient({ initialAnalyses }: Props) {
  const router = useRouter()
  const [articles, setArticles] = useState(initialAnalyses)
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
    setForm({
      titre: a.titre,
      categorie: a.categorie,
      date: a.date,
      resume: a.resume,
      contenuText: a.contenu.join('\n\n'),
    })
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

    const url = editSlug ? `/api/analyses/${editSlug}` : '/api/analyses'
    const method = editSlug ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    setLoading(false)

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? 'Erreur lors de la sauvegarde.')
      return
    }

    setShowForm(false)
    router.refresh()

    const listRes = await fetch('/api/analyses')
    setArticles(await listRes.json())
  }

  async function handleDelete(slug: string) {
    if (!confirm('Supprimer cette publication définitivement ?')) return
    await fetch(`/api/analyses/${slug}`, { method: 'DELETE' })
    setArticles((prev) => prev.filter((a) => a.slug !== slug))
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
            + Nouvelle publication
          </button>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-6 mb-8 flex flex-col gap-5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-serif font-medium text-navy">
              {editSlug ? 'Modifier la publication' : 'Nouvelle publication'}
            </h2>
            <button type="button" onClick={() => setShowForm(false)} className="text-[12px] text-gray-400 hover:text-gray-700">
              Annuler
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Titre" required>
              <input type="text" required value={form.titre} onChange={field('titre')} className="admin-input" />
            </FormField>

            <FormField label="Catégorie" required hint="ex : Analyse, Essai, Réflexion…">
              <input
                type="text"
                required
                list="categories"
                value={form.categorie}
                onChange={field('categorie')}
                className="admin-input"
                placeholder="Analyse"
              />
              <datalist id="categories">
                {CATEGORIES_SUGGESTIONS.map((c) => <option key={c} value={c} />)}
              </datalist>
            </FormField>

            <FormField label="Date de publication" required>
              <input type="date" required value={form.date} onChange={field('date')} className="admin-input" />
            </FormField>
          </div>

          <FormField label="Résumé (chapeau)" required>
            <textarea required rows={3} value={form.resume} onChange={field('resume')} className="admin-input resize-y" placeholder="Une phrase ou deux qui résument l'article…" />
          </FormField>

          <FormField label="Contenu" required hint="Séparer les paragraphes par une ligne vide">
            <textarea
              required
              rows={16}
              value={form.contenuText}
              onChange={field('contenuText')}
              className="admin-input resize-y font-mono text-[13px]"
              placeholder={"Premier paragraphe…\n\nDeuxième paragraphe…"}
            />
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

      {/* Liste */}
      <div className="bg-white border border-gray-200 divide-y divide-gray-100">
        {articles.length === 0 && (
          <p className="px-4 py-6 text-[13px] text-gray-400 text-center">Aucune publication.</p>
        )}
        {articles.map((a) => (
          <div key={a.slug} className="flex items-center justify-between px-4 py-3.5 gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-0.5">
                <span className="font-medium text-[13px] text-navy truncate">{a.titre}</span>
                <span className="text-[10px] font-medium uppercase tracking-wide text-brand-blue flex-shrink-0">
                  {a.categorie}
                </span>
              </div>
              <p className="text-[11px] text-gray-400">{a.date}</p>
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
