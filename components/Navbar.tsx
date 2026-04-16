'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const links = [
  { href: '/', label: 'Accueil' },
  { href: '/philosophie', label: 'Philosophie' },
  { href: '/analyses', label: 'Analyses' },
  { href: '/portefeuille', label: 'Portefeuille' },
  { href: '/rapports', label: 'Rapports annuels' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo + liens desktop */}
        <div className="flex items-center gap-10 h-full">
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <Image
              src="/logo-horizontal.png"
              alt="Connan Investment"
              width={200}
              height={44}
              className="h-11 w-auto"
              priority
            />
            <span className="flex flex-col leading-tight text-[15px] text-navy">
              <span>Connan</span>
              <span>Investment</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1 h-full">
            {links.map(({ href, label }) => {
              const isActive =
                href === '/' ? pathname === '/' : pathname.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  className={`
                    text-[13px] font-medium px-3 h-full flex items-center
                    border-b-2 transition-colors duration-150
                    ${
                      isActive
                        ? 'text-navy border-gold'
                        : 'text-gray-500 border-transparent hover:text-navy'
                    }
                  `}
                >
                  {label}
                </Link>
              )
            })}
          </div>
        </div>

        {/* SIREN (desktop) */}
        <span className="hidden md:block text-[11px] text-gray-400 tracking-wide">
          SIREN&nbsp;991&nbsp;905&nbsp;860
        </span>

        {/* Hamburger (mobile) */}
        <button
          className="md:hidden p-2 text-gray-500 hover:text-navy transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Menu mobile */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          {links.map(({ href, label }) => {
            const isActive =
              href === '/' ? pathname === '/' : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`
                  block px-6 py-3 text-sm font-medium border-l-2 transition-colors
                  ${
                    isActive
                      ? 'text-navy border-gold bg-gray-50'
                      : 'text-gray-500 border-transparent hover:text-navy hover:bg-gray-50'
                  }
                `}
              >
                {label}
              </Link>
            )
          })}
          <div className="px-6 py-3 border-t border-gray-100">
            <span className="text-[11px] text-gray-400">SIREN 991 905 860</span>
          </div>
        </div>
      )}
    </header>
  )
}
