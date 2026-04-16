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

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// GET /api/analyses
export async function GET() {
  return NextResponse.json(read())
}

// POST /api/analyses — créer une analyse
export async function POST(request: NextRequest) {
  const body = await request.json() as Partial<Analyse> & {
    descriptionText?: string
    theseText?: string
    points_cles_text?: string
    risques_text?: string
  }

  const slug = body.slug || slugify(body.titre ?? '')

  // Vérifie l'unicité du slug
  const existing = read()
  if (existing.find((a) => a.slug === slug)) {
    return NextResponse.json({ error: 'Un slug identique existe déjà.' }, { status: 409 })
  }

  // Construit l'objet Analyse depuis le formulaire simplifié
  const analyse: Analyse = {
    slug,
    titre: body.titre ?? '',
    entreprise: body.entreprise ?? '',
    ticker: body.ticker ?? '',
    bourse: body.bourse ?? '',
    secteur: body.secteur ?? '',
    geographie: body.geographie ?? '',
    date: body.date ?? new Date().toISOString().slice(0, 10),
    resume: body.resume ?? '',
    recommandation: body.recommandation ?? 'Neutre',
    sections: {
      description: (body.descriptionText ?? '')
        .split('\n\n')
        .filter(Boolean)
        .map((text) => ({ type: 'paragraph' as const, text: text.trim() })),
      these: (body.theseText ?? '')
        .split('\n\n')
        .filter(Boolean)
        .map((text) => ({ type: 'paragraph' as const, text: text.trim() })),
      points_cles: (body.points_cles_text ?? '')
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      risques: (body.risques_text ?? '')
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      conclusion: body.sections?.conclusion ?? '',
    },
  }

  existing.push(analyse)
  write(existing)

  revalidatePath('/')
  revalidatePath('/analyses')
  revalidatePath(`/analyses/${slug}`)

  return NextResponse.json(analyse, { status: 201 })
}
