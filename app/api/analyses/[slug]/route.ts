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

// PUT /api/analyses/[slug] — mettre à jour
export async function PUT(request: NextRequest, { params }: Props) {
  const { slug } = await params
  const body = await request.json() as Partial<Analyse> & {
    descriptionText?: string
    theseText?: string
    points_cles_text?: string
    risques_text?: string
  }

  const data = read()
  const index = data.findIndex((a) => a.slug === slug)
  if (index === -1) {
    return NextResponse.json({ error: 'Analyse introuvable.' }, { status: 404 })
  }

  const updated: Analyse = {
    ...data[index],
    titre: body.titre ?? data[index].titre,
    entreprise: body.entreprise ?? data[index].entreprise,
    ticker: body.ticker ?? data[index].ticker,
    bourse: body.bourse ?? data[index].bourse,
    secteur: body.secteur ?? data[index].secteur,
    geographie: body.geographie ?? data[index].geographie,
    date: body.date ?? data[index].date,
    resume: body.resume ?? data[index].resume,
    recommandation: body.recommandation ?? data[index].recommandation,
    sections: {
      description: body.descriptionText !== undefined
        ? body.descriptionText.split('\n\n').filter(Boolean).map((text) => ({ type: 'paragraph' as const, text: text.trim() }))
        : data[index].sections.description,
      these: body.theseText !== undefined
        ? body.theseText.split('\n\n').filter(Boolean).map((text) => ({ type: 'paragraph' as const, text: text.trim() }))
        : data[index].sections.these,
      points_cles: body.points_cles_text !== undefined
        ? body.points_cles_text.split('\n').map((s) => s.trim()).filter(Boolean)
        : data[index].sections.points_cles,
      risques: body.risques_text !== undefined
        ? body.risques_text.split('\n').map((s) => s.trim()).filter(Boolean)
        : data[index].sections.risques,
      conclusion: body.sections?.conclusion ?? data[index].sections.conclusion,
    },
  }

  data[index] = updated
  write(data)

  revalidatePath('/')
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
    return NextResponse.json({ error: 'Analyse introuvable.' }, { status: 404 })
  }

  write(filtered)

  revalidatePath('/')
  revalidatePath('/analyses')

  return NextResponse.json({ ok: true })
}
