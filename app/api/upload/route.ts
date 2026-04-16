import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// POST /api/upload — upload d'un PDF vers public/rapports/
export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'Aucun fichier fourni.' }, { status: 400 })
  }

  if (file.type !== 'application/pdf') {
    return NextResponse.json({ error: 'Seuls les fichiers PDF sont acceptés.' }, { status: 400 })
  }

  const fileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-')
  const destDir = path.join(process.cwd(), 'public', 'rapports')

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true })
  }

  const destPath = path.join(destDir, fileName)
  const buffer = Buffer.from(await file.arrayBuffer())
  fs.writeFileSync(destPath, buffer)

  return NextResponse.json({ path: `/rapports/${fileName}` }, { status: 201 })
}
