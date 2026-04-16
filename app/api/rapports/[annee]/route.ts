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

interface Props {
  params: Promise<{ annee: string }>
}

// PUT /api/rapports/[annee] — modifier un rapport
export async function PUT(request: NextRequest, { params }: Props) {
  const { annee } = await params
  const anneeNum = parseInt(annee, 10)
  const body = await request.json() as Partial<Rapport>
  const data = read()

  const index = data.findIndex((r) => r.annee === anneeNum)
  if (index === -1) {
    return NextResponse.json({ error: 'Rapport introuvable.' }, { status: 404 })
  }

  data[index] = { ...data[index], ...body }
  write(data)

  revalidatePath('/')
  revalidatePath('/rapports')

  return NextResponse.json(data[index])
}

// DELETE /api/rapports/[annee]
export async function DELETE(_request: NextRequest, { params }: Props) {
  const { annee } = await params
  const anneeNum = parseInt(annee, 10)
  const data = read()

  const filtered = data.filter((r) => r.annee !== anneeNum)
  if (filtered.length === data.length) {
    return NextResponse.json({ error: 'Rapport introuvable.' }, { status: 404 })
  }

  write(filtered)

  revalidatePath('/')
  revalidatePath('/rapports')

  return NextResponse.json({ ok: true })
}
