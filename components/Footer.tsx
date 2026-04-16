import Link from 'next/link'

const navLinks = [
  { href: '/philosophie', label: 'Philosophie' },
  { href: '/analyses', label: 'Analyses' },
  { href: '/portefeuille', label: 'Portefeuille' },
  { href: '/rapports', label: 'Rapports annuels' },
]

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-24">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          {/* Colonne gauche */}
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-[13px] font-semibold text-navy">Connan Investment</p>
              <p className="text-[12px] text-gray-400 mt-0.5">Paris, France — SIREN 991 905 860</p>
            </div>

            <nav className="flex flex-col gap-1.5">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-[12px] text-gray-500 hover:text-navy transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>

            <a
              href="mailto:connan.investment.partnership@gmail.com"
              className="text-[13px] text-navy hover:underline underline-offset-2 transition-colors"
            >
              connan.investment.partnership@gmail.com
            </a>
          </div>

          {/* Disclaimer */}
          <p className="text-[11px] text-gray-400 leading-relaxed flex-1 md:pl-8 md:pt-1">
            Connan Investment est une société d&rsquo;investissement personnel. Le capital n&rsquo;est
            pas ouvert aux tiers&nbsp;: la société n&rsquo;est pas à la recherche de nouveaux
            actionnaires. Ce site est publié à titre informatif uniquement et ne constitue pas un
            conseil en investissement ni une sollicitation. Les performances passées ne préjugent pas
            des performances futures.
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-[11px] text-gray-300">
            © {new Date().getFullYear()} Connan Investment — Tous droits réservés
          </p>
        </div>
      </div>
    </footer>
  )
}
