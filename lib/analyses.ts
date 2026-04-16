import fs from 'fs'
import path from 'path'

export type Section =
  | { type: "paragraph"; text: string }
  | { type: "list"; title: string; items: string[] }
  | { type: "metrics"; items: { label: string; value: string; note?: string }[] }

export interface Analyse {
  slug: string
  titre: string
  entreprise: string
  ticker: string
  bourse: string
  secteur: string
  geographie: string
  date: string
  resume: string
  recommandation: "Achat" | "Neutre" | "Suivi"
  sections: {
    description: Section[]
    these: Section[]
    points_cles: string[]
    risques: string[]
    conclusion: string
  }
}

const dataPath = path.join(process.cwd(), 'data', 'analyses.json')

function readAnalyses(): Analyse[] {
  const raw = fs.readFileSync(dataPath, 'utf-8')
  return JSON.parse(raw) as Analyse[]
}

export function getAllAnalyses(): Analyse[] {
  return readAnalyses().sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

export function getAnalyseBySlug(slug: string): Analyse | undefined {
  return readAnalyses().find((a) => a.slug === slug)
}
