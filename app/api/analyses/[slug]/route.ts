import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { revalidatePath } from 'next/cache'
import type { Analyse } from '@/lib/analyses'

const dataPath = path.join(process.cwd(), 'data', 'analyses.json')

function read(): Analyse[] {
  return JSON.parse(fs.readFileSync(dataPath, 'utf-8')) as Analyse[]
}

function write(data: Analyse[]) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8')
}

interface Props {
  params: Promise<{ slug: string }>
}

// PUT /api/analyses/[slug]
export async function PUT(request: NextRequest, { params }: Props) {
  const { slug } = await params
  const body = await request.json() as {
    titre?: string
    categorie?: string
    date?: string
    resume?: string
    contenuText?: string
  }

  const data = read()
  const index = data.findIndex((a) => a.slug === slug)
  if (index === -1) {
    return NextResponse.json({ error: 'Publication introuvable.' }, { status: 404 })
  }

  const updated: Analyse = {
    ...data[index],
    titre: body.titre ?? data[index].titre,
    categorie: body.categorie ?? data[index].categorie,
    date: body.date ?? data[index].date,
    resume: body.resume ?? data[index].resume,
    contenu: body.contenuText !== undefined
      ? body.contenuText.split('\n\n').map((p) => p.trim()).filter(Boolean)
      : data[index].contenu,
  }

  data[index] = updated
  write(data)

  revalidatePath('/analyses')
  revalidatePath(`/analyses/${slug}`)

  return NextResponse.json(updated)
}

// DELETE /api/analyses/[slug]
export async function DELETE(_request: NextRequest, { params }: Props) {
  const { slug } = await params
  const data = read()
  const filtered = data.filter((a) => a.slug !== slug)

  if (filtered.length === data.length) {
    return NextResponse.json({ error: 'Publication introuvable.' }, { status: 404 })
  }

  write(filtered)

  revalidatePath('/analyses')

  return NextResponse.json({ ok: true })
}
