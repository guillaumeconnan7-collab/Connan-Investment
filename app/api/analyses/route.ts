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
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// GET /api/analyses
export async function GET() {
  return NextResponse.json(read())
}

// POST /api/analyses
export async function POST(request: NextRequest) {
  const body = await request.json() as {
    titre?: string
    categorie?: string
    date?: string
    resume?: string
    contenuText?: string
    slug?: string
  }

  const slug = body.slug || slugify(body.titre ?? '')

  const existing = read()
  if (existing.find((a) => a.slug === slug)) {
    return NextResponse.json({ error: 'Un slug identique existe déjà.' }, { status: 409 })
  }

  const article: Analyse = {
    slug,
    titre: body.titre ?? '',
    categorie: body.categorie ?? '',
    date: body.date ?? new Date().toISOString().slice(0, 10),
    resume: body.resume ?? '',
    contenu: (body.contenuText ?? '')
      .split('\n\n')
      .map((p) => p.trim())
      .filter(Boolean),
  }

  existing.push(article)
  write(existing)

  revalidatePath('/analyses')
  revalidatePath(`/analyses/${slug}`)

  return NextResponse.json(article, { status: 201 })
}
