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

// GET /api/portfolio
export async function GET() {
  return NextResponse.json(read())
}

// PUT /api/portfolio — mettre à jour les méta + positions complètes
export async function PUT(request: NextRequest) {
  const body = await request.json() as Partial<PortfolioData>
  const data = read()

  if (body.meta) {
    data.meta = { ...data.meta, ...body.meta }
  }
  if (body.positions) {
    data.positions = body.positions
  }

  write(data)

  revalidatePath('/')
  revalidatePath('/portefeuille')

  return NextResponse.json(data)
}

// POST /api/portfolio — ajouter une position
export async function POST(request: NextRequest) {
  const position = await request.json() as Position
  const data = read()

  const exists = data.positions.findIndex((p) => p.ticker === position.ticker)
  if (exists !== -1) {
    return NextResponse.json({ error: 'Un ticker identique existe déjà.' }, { status: 409 })
  }

  data.positions.push(position)
  write(data)

  revalidatePath('/')
  revalidatePath('/portefeuille')

  return NextResponse.json(position, { status: 201 })
}
