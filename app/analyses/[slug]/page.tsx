import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAnalyseBySlug, type Section } from '@/lib/analyses'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const analyse = getAnalyseBySlug(slug)
  if (!analyse) return {}

  const title = analyse.titre
  const description = analyse.resume
  const url = `https://connaninvestment.com/analyses/${slug}`

  return {
    title,
    description,
    keywords: [
      analyse.entreprise,
      analyse.ticker,
      analyse.secteur,
      analyse.geographie,
      'value investing',
      'analyse fondamentale',
      'thèse d\'investissement',
      'analyse financière',
      'investissement long terme',
      analyse.recommandation === 'Achat' ? 'recommandation achat' : 'analyse boursière',
    ],
    authors: [{ name: 'Guillaume Connan', url: 'https://connaninvestment.com' }],
    openGraph: {
      title: `${title} — Connan Investment`,
      description,
      url,
      type: 'article',
      publishedTime: analyse.date,
      authors: ['Guillaume Connan'],
      tags: [analyse.secteur, analyse.geographie, 'value investing', 'analyse fondamentale'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} — Connan Investment`,
      description,
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

function RenderSections({ sections }: { sections: Section[] }) {
  return (
    <div className="flex flex-col gap-5">
      {sections.map((s, i) => {
        if (s.type === 'paragraph') {
          return (
            <p key={i} className="text-[14px] text-gray-600 leading-relaxed">
              {s.text}
            </p>
          )
        }
        if (s.type === 'list') {
          return (
            <div key={i}>
              {s.title && (
                <p className="text-[13px] font-semibold text-navy mb-2">{s.title}</p>
              )}
              <ul className="flex flex-col gap-1.5">
                {s.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-[14px] text-gray-600">
                    <span className="text-gold mt-1 flex-shrink-0">—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )
        }
        if (s.type === 'metrics') {
          return (
            <div key={i} className="border border-gray-200 divide-y divide-gray-100">
              {s.items.map((item, j) => (
                <div key={j} className="flex items-baseline justify-between px-4 py-2.5 text-[13px]">
                  <span className="text-gray-500">{item.label}</span>
                  <div className="text-right">
                    <span className="font-medium text-navy">{item.value}</span>
                    {item.note && (
                      <span className="ml-2 text-[11px] text-gray-400">{item.note}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        }
        return null
      })}
    </div>
  )
}

export default async function AnalysePage({ params }: Props) {
  const { slug } = await params
  const analyse = getAnalyseBySlug(slug)
  if (!analyse) notFound()

  return (
    <div className="px-6 py-12 md:py-16">
      <div className="max-w-2xl mx-auto">
        {/* Fil d'Ariane */}
        <nav className="flex items-center gap-2 text-[12px] text-gray-400 mb-8">
          <Link href="/" className="hover:text-navy transition-colors">Accueil</Link>
          <span>/</span>
          <Link href="/analyses" className="hover:text-navy transition-colors">Analyses</Link>
          <span>/</span>
          <span className="text-gray-600">{analyse.entreprise}</span>
        </nav>

        {/* En-tête */}
        <header className="mb-10">
          <div className="flex items-start justify-between gap-4 mb-3">
            <span className="section-label">{analyse.secteur} · {analyse.geographie}</span>
            <span
              className={
                analyse.recommandation === 'Achat'
                  ? 'badge-achat'
                  : analyse.recommandation === 'Neutre'
                    ? 'badge-neutre'
                    : 'badge-suivi'
              }
            >
              {analyse.recommandation}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-serif font-medium text-navy leading-tight mb-2">
            {analyse.titre}
          </h1>

          <div className="flex items-center gap-4 text-[12px] text-gray-400 mb-6">
            <span>{analyse.ticker} · {analyse.bourse}</span>
            <span>·</span>
            <time dateTime={analyse.date}>{formatDate(analyse.date)}</time>
          </div>

          <div className="divider-gold" />

          <p className="mt-6 text-[15px] text-gray-500 leading-relaxed border-l-2 border-gold pl-4 italic">
            {analyse.resume}
          </p>
        </header>

        {/* Sections */}
        <div className="flex flex-col gap-10">
          {/* Description du business */}
          <section>
            <h2 className="text-lg font-serif text-navy mb-4 pb-2 border-b border-gray-200">
              Description de l&rsquo;entreprise
            </h2>
            <RenderSections sections={analyse.sections.description} />
          </section>

          {/* Thèse d'investissement */}
          <section>
            <h2 className="text-lg font-serif text-navy mb-4 pb-2 border-b border-gray-200">
              Thèse d&rsquo;investissement
            </h2>
            <RenderSections sections={analyse.sections.these} />
          </section>

          {/* Points clés */}
          <section>
            <h2 className="text-lg font-serif text-navy mb-4 pb-2 border-b border-gray-200">
              Points clés
            </h2>
            <ul className="flex flex-col gap-2.5">
              {analyse.sections.points_cles.map((point, i) => (
                <li key={i} className="flex items-start gap-3 text-[14px] text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0 mt-2" />
                  {point}
                </li>
              ))}
            </ul>
          </section>

          {/* Risques */}
          <section>
            <h2 className="text-lg font-serif text-navy mb-4 pb-2 border-b border-gray-200">
              Principaux risques
            </h2>
            <ul className="flex flex-col gap-2.5">
              {analyse.sections.risques.map((risque, i) => (
                <li key={i} className="flex items-start gap-3 text-[14px] text-gray-600">
                  <span className="text-gray-300 flex-shrink-0 mt-0.5">→</span>
                  {risque}
                </li>
              ))}
            </ul>
          </section>

          {/* Conclusion */}
          <section>
            <h2 className="text-lg font-serif text-navy mb-4 pb-2 border-b border-gray-200">
              Conclusion
            </h2>
            <p className="text-[14px] text-gray-600 leading-relaxed">{analyse.sections.conclusion}</p>
          </section>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-[11px] text-gray-400 leading-relaxed">
          <strong className="text-gray-500">Avertissement :</strong> Cette analyse est publiée à
          titre informatif uniquement. Elle reflète l&rsquo;opinion de Connan Investment à la date
          de publication et peut évoluer sans préavis. Elle ne constitue pas un conseil en
          investissement ni une sollicitation. Tout investissement comporte un risque de perte en
          capital. Les performances passées ne préjugent pas des performances futures.
        </div>

        {/* Navigation */}
        <div className="mt-8">
          <Link
            href="/analyses"
            className="text-[13px] font-medium text-navy hover:text-navy-light transition-colors"
          >
            ← Retour aux analyses
          </Link>
        </div>
      </div>
    </div>
  )
}
