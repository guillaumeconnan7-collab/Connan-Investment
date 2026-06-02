import fs from 'fs'
import path from 'path'

export interface Analyse {
  slug: string
  titre: string
  categorie: string
  date: string
  resume: string
  contenu: string[]
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
