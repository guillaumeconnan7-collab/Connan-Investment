import fs from 'fs'
import path from 'path'

export interface Position {
  entreprise: string
  ticker: string
  bourse: string
  secteur: string
  geographie: string
  poids: number
  dateEntree: string // YYYY-MM
  these: string
}

export interface PortfolioMeta {
  dernierePublication: string
  rendementAnnualise: string
  nombrePositions: number
  liquidites: number
}

interface PortfolioData {
  meta: PortfolioMeta
  positions: Position[]
}

const dataPath = path.join(process.cwd(), 'data', 'portfolio.json')

function readPortfolio(): PortfolioData {
  const raw = fs.readFileSync(dataPath, 'utf-8')
  return JSON.parse(raw) as PortfolioData
}

export function getPortfolioMeta(): PortfolioMeta {
  return readPortfolio().meta
}

export function getPositions(): Position[] {
  return readPortfolio().positions
}

// Rétro-compatibilité avec les pages existantes
export function getPortfolioData(): PortfolioData {
  return readPortfolio()
}

export function getSecteurBreakdown(): { secteur: string; poids: number }[] {
  const pos = getPositions()
  const map: Record<string, number> = {}
  for (const p of pos) {
    map[p.secteur] = (map[p.secteur] ?? 0) + p.poids
  }
  return Object.entries(map)
    .map(([secteur, poids]) => ({ secteur, poids }))
    .sort((a, b) => b.poids - a.poids)
}

export function getGeographieBreakdown(): { geo: string; poids: number }[] {
  const pos = getPositions()
  const map: Record<string, number> = {}
  for (const p of pos) {
    map[p.geographie] = (map[p.geographie] ?? 0) + p.poids
  }
  return Object.entries(map)
    .map(([geo, poids]) => ({ geo, poids }))
    .sort((a, b) => b.poids - a.poids)
}
