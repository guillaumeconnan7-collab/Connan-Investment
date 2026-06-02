import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAnalyseBySlug } from '@/lib/analyses'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = getAnalyseBySlug(slug)
  if (!article) return {}

  const url = `https://connaninvestment.com/analyses/${slug}`

  return {
    title: article.titre,
    description: article.resume,
    authors: [{ name: 'Guillaume Connan', url: 'https://connaninvestment.com' }],
    openGraph: {
      title: `${article.titre} — Connan Investment`,
      description: article.resume,
      url,
      type: 'article',
      publishedTime: article.date,
      authors: ['Guillaume Connan'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${article.titre} — Connan Investment`,
      description: article.resume,
    },
    alternates: {
      canonical: url,
    },
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = getAnalyseBySlug(slug)
  if (!article) notFound()

  return (
    <div className="px-6 py-12 md:py-16">
      <div className="max-w-2xl mx-auto">
        {/* Fil d'Ariane */}
        <nav className="flex items-center gap-2 text-[12px] text-gray-400 mb-8">
          <Link href="/" className="hover:text-navy transition-colors">Accueil</Link>
          <span>/</span>
          <Link href="/analyses" className="hover:text-navy transition-colors">Publications</Link>
          <span>/</span>
          <span className="text-gray-600 truncate">{article.titre}</span>
        </nav>

        {/* En-tête */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="section-label">{article.categorie}</span>
            <span className="text-[11px] text-gray-300">·</span>
            <time className="text-[11px] text-gray-400" dateTime={article.date}>
              {formatDate(article.date)}
            </time>
          </div>

          <h1 className="text-2xl md:text-3xl font-serif font-medium text-navy leading-tight mb-6">
            {article.titre}
          </h1>

          <div className="divider-gold" />

          <p className="mt-6 text-[15px] text-gray-500 leading-relaxed border-l-2 border-gold pl-4 italic">
            {article.resume}
          </p>
        </header>

        {/* Corps de l'article */}
        <div className="flex flex-col gap-5">
          {article.contenu.map((para, i) => (
            <p key={i} className="text-[14px] text-gray-600 leading-relaxed">
              {para}
            </p>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-[11px] text-gray-400 leading-relaxed">
          <strong className="text-gray-500">Avertissement :</strong> Ce texte est publié à titre
          informatif uniquement. Il reflète l&rsquo;opinion de l&rsquo;auteur à la date de
          publication et peut évoluer sans préavis. Il ne constitue pas un conseil en investissement
          ni une sollicitation. Tout investissement comporte un risque de perte en capital.
        </div>

        {/* Retour */}
        <div className="mt-8">
          <Link
            href="/analyses"
            className="text-[13px] font-medium text-navy hover:text-navy-light transition-colors"
          >
            ← Retour aux publications
          </Link>
        </div>
      </div>
    </div>
  )
}
