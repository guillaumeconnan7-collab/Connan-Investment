import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Philosophie d'investissement",
  description:
    "La philosophie d'investissement de Connan Investment : analyse fondamentale, approche contrarienne, horizon long terme et discipline sans levier. Inspirée de Graham, Buffett et Munger.",
  keywords: [
    'philosophie investissement',
    'value investing',
    'analyse fondamentale',
    'investissement long terme',
    'approche contrarienne',
    'Benjamin Graham',
    'Warren Buffett',
    'Charlie Munger',
    'marge de sécurité',
    'investissement sans levier',
    'gestion patrimoniale',
    'Howard Marks',
  ],
  openGraph: {
    title: "Philosophie d'investissement — Connan Investment",
    description:
      "Analyse fondamentale, approche contrarienne, horizon long terme et discipline sans levier. Une philosophie inspirée de Graham, Buffett et Munger.",
    url: 'https://connaninvestment.com/philosophie',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: "Philosophie d'investissement — Connan Investment",
    description:
      "Analyse fondamentale, approche contrarienne, horizon long terme et discipline sans levier.",
  },
  alternates: {
    canonical: 'https://connaninvestment.com/philosophie',
  },
}

const principes = [
  {
    titre: "Analyse fondamentale avant tout",
    texte:
      "Nous partons des états financiers. Bilan, compte de résultat, flux de trésorerie : chaque ligne est analysée avec soin. Nous cherchons à comprendre d'où vient la profitabilité, si elle est durable, et si la valeur comptable sous-jacente est solide. Nous lisons aussi les notes de bas de page.",
  },
  {
    titre: "Approche contrarienne",
    texte:
      "Les meilleures opportunités émergent souvent quand le consensus se trompe. Nous cherchons les entreprises injustement délaissées : celles qui souffrent d'un choc sectoriel, d'une déception trimestrielle ou d'une incompréhension du business model. L'inconfort est souvent une bonne boussole.",
  },
  {
    titre: "Horizon long terme",
    texte:
      "Nous pensons en années, pas en trimestres. La plupart des acteurs de marché sont contraints à des horizons courts (reporting, benchmark, pression des clients). Cette contrainte structurelle crée des opportunités pour ceux qui peuvent tenir une position 3, 5, voire 10 ans. Notre structure de capital personnel nous le permet.",
  },
  {
    titre: "Pas de levier",
    texte:
      "Nous n'utilisons jamais l'effet de levier. Le levier force des décisions au pire moment, précisément au creux des marchés quand il faudrait acheter. Il transforme un inconfort temporaire en perte permanente. Nous préférons une performance légèrement réduite à la certitude de survivre à tous les cycles.",
  },
  {
    titre: "Concentration raisonnée",
    texte:
      "Nous ne diversifions pas pour diversifier. Notre portefeuille compte en général 8 à 12 lignes. La diversification excessive dilue la performance et masque la réflexion. Si nous avons une forte conviction sur une idée, nous l'exprimons pleinement. La dispersion n'est pas une vertu en soi.",
  },
  {
    titre: "Psychologie et discipline",
    texte:
      "Les marchés amplifient les émotions humaines : peur et avidité alternent à intervalles prévisibles. Notre edge n'est pas computationnel mais comportemental. Il repose sur la discipline de ne pas vendre au plus bas, la patience d'attendre la bonne opportunité, et l'humilité de reconnaître nos erreurs rapidement.",
  },
]

const influences = [
  { nom: "Benjamin Graham", contribution: "Valeur intrinsèque, marge de sécurité" },
  { nom: "Warren Buffett", contribution: "Franchise économique, allocateur de capital" },
  { nom: "Charlie Munger", contribution: "Modèles mentaux, inversion, pensée pluridisciplinaire" },
  { nom: "Philip Fisher", contribution: "Qualité du management, croissance durable" },
  { nom: "Howard Marks", contribution: "Cycles, risk-adjusted thinking, second-level thinking" },
  { nom: "Prem Watsa", contribution: "Underwriting, gestion du flottant à la Buffett" },
]

export default function PhilosophiePage() {
  return (
    <div className="px-6 py-16 md:py-20">
      <div className="max-w-2xl mx-auto">
        {/* En-tête */}
        <span className="section-label">Qui sommes-nous</span>
        <h1 className="mt-3 text-3xl font-serif font-medium text-navy leading-tight">
          Une philosophie, pas une stratégie
        </h1>
        <div className="divider-gold mt-4 mb-6" />
        <p className="text-[15px] text-gray-500 leading-relaxed">
          Connan Investment est une société d&rsquo;investissement personnel fondée et gérée par
          Guillaume Connan. Le capital est unique et entièrement personnel : il n&rsquo;est pas
          ouvert à des tiers. Ce site a pour vocation de partager notre réflexion à titre informatif
          et pédagogique, à travers nos analyses, la composition de notre portefeuille et nos rapports annuels.
        </p>

        <div className="mt-8 pl-4 border-l-2 border-gold">
          <p className="text-[14px] text-gray-500 italic leading-relaxed">
            &laquo;&nbsp;Investir, c&rsquo;est déployer du capital aujourd&rsquo;hui pour recevoir
            davantage demain. Tout le reste est spéculation.&nbsp;&raquo;
          </p>
          <p className="mt-2 text-[12px] text-gray-400">— Guillaume Connan</p>
        </div>

        {/* Principes */}
        <div className="mt-14">
          <h2 className="text-xl font-serif text-navy mb-8">Nos principes</h2>
          <div className="flex flex-col gap-8">
            {principes.map((p, i) => (
              <div key={i} className="flex gap-5">
                <div className="flex-shrink-0 w-6 mt-0.5">
                  <span className="text-[12px] font-medium text-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-navy mb-1.5">{p.titre}</h3>
                  <p className="text-[14px] text-gray-500 leading-relaxed">{p.texte}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Influences */}
        <div className="mt-14">
          <h2 className="text-xl font-serif text-navy mb-6">Influences intellectuelles</h2>
          <p className="text-[14px] text-gray-500 leading-relaxed mb-6">
            Notre pensée est construite sur les épaules de géants. Ces investisseurs et penseurs ont
            façonné notre cadre d&rsquo;analyse.
          </p>
          <div className="border border-gray-200 divide-y divide-gray-100">
            {influences.map(({ nom, contribution }) => (
              <div key={nom} className="flex items-baseline justify-between px-5 py-3.5">
                <span className="text-[14px] font-medium text-navy">{nom}</span>
                <span className="text-[12px] text-gray-400 text-right max-w-xs">{contribution}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Avertissement */}
        <div className="mt-14 p-5 bg-gray-50 border border-gray-200 text-[12px] text-gray-400 leading-relaxed">
          <strong className="text-gray-500">Avertissement :</strong> Ce site est publié à titre
          informatif uniquement. Il ne constitue pas un conseil en investissement, une sollicitation
          ou une offre. Connan Investment est une société d&rsquo;investissement personnel dont le
          capital n&rsquo;est pas accessible aux tiers. Les performances passées ne préjugent pas des
          performances futures. Tout investissement comporte un risque de perte en capital.
        </div>
      </div>
    </div>
  )
}
