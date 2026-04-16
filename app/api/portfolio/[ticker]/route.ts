import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { revalidatePath } from 'next/cache'
import type { Position, PortfolioMeta } from '@/lib/portfolio'

const dataPath = path.join(process.cwd(), 'data', 'portfolio.json')

interface PortfolioData {
  meta: PortfolioMeta
  positions: Position[]
}

function read(): PortfolioData {
  return JSON.parse(fs.readFileSync(dataPath, 'utf-8')) as PortfolioData
}

function write(data: PortfolioData) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8')
}

interface Props {
  params: Promise<{ ticker: string }>
}

// PUT /api/portfolio/[ticker] — modifier une position
export async function PUT(request: NextRequest, { params }: Props) {
  const { ticker } = await params
  const body = await request.json() as Partial<Position>
  const data = read()

  const index = data.positions.findIndex((p) => p.ticker === ticker)
  if (index === -1) {
    return NextResponse.json({ error: 'Position introuvable.' }, { status: 404 })
  }

  data.positions[index] = { ...data.positions[index], ...body }
  write(data)

  revalidatePath('/')
  revalidatePath('/portefeuille')

  return NextResponse.json(data.positions[index])
}

// DELETE /api/portfolio/[ticker] — supprimer une position
export async function DELETE(_request: NextRequest, { params }: Props) {
  const { ticker } = await params
  const data = read()

  const filtered = data.positions.filter((p) => p.ticker !== ticker)
  if (filtered.length === data.positions.length) {
    return NextResponse.json({ error: 'Position introuvable.' }, { status: 404 })
  }

  data.positions = filtered
  write(data)

  revalidatePath('/')
  revalidatePath('/portefeuille')

  return NextResponse.json({ ok: true })
}
