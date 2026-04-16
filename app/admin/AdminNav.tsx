'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const navLinks = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/analyses', label: 'Analyses' },
  { href: '/admin/portefeuille', label: 'Portefeuille' },
  { href: '/admin/rapports', label: 'Rapports' },
]

export default function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth', { method: 'DELETE' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <header className="bg-navy text-white">
      <nav className="max-w-4xl mx-auto px-6 h-12 flex items-center justify-between">
        <div className="flex items-center gap-1">
          {navLinks.map(({ href, label }) => {
            const isActive = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={`text-[12px] font-medium px-3 py-1.5 transition-colors ${
                  isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            target="_blank"
            className="text-[12px] text-white/60 hover:text-white transition-colors"
          >
            Voir le site ↗
          </Link>
          <button
            onClick={handleLogout}
            className="text-[12px] text-white/60 hover:text-white transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </nav>
    </header>
  )
}
