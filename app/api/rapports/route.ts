import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { revalidatePath } from 'next/cache'
import type { Rapport } from '@/lib/rapports'

const dataPath = path.join(process.cwd(), 'data', 'rapports.json')

function read(): Rapport[] {
  return JSON.parse(fs.readFileSync(dataPath, 'utf-8')) as Rapport[]
}

function write(data: Rapport[]) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8')
}

// GET /api/rapports
export async function GET() {
  return NextResponse.json(read())
}

// POST /api/rapports — ajouter un rapport
export async function POST(request: NextRequest) {
  const rapport = await request.json() as Rapport
  const data = read()

  if (data.find((r) => r.annee === rapport.annee)) {
    return NextResponse.json({ error: 'Un rapport pour cette année existe déjà.' }, { status: 409 })
  }

  data.push(rapport)
  write(data)

  revalidatePath('/')
  revalidatePath('/rapports')

  return NextResponse.json(rapport, { status: 201 })
}
