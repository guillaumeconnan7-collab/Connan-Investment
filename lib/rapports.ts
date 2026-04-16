import fs from 'fs'
import path from 'path'

export interface Rapport {
  annee: number
  titre: string
  resume: string
  fichier: string
  publie: string
  pages: number
  rendementPortefeuille: string
  rendementComparaison: string
}

const dataPath = path.join(process.cwd(), 'data', 'rapports.json')

function readRapports(): Rapport[] {
  const raw = fs.readFileSync(dataPath, 'utf-8')
  return JSON.parse(raw) as Rapport[]
}

export function getRapportsByYear(): Rapport[] {
  return readRapports().sort((a, b) => b.annee - a.annee)
}
