import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  title: {
    default: 'Connan Investment',
    template: '%s — Connan Investment',
  },
  description:
    "Analyses value investing, portefeuille et rapports annuels. Société d'investissement fondée sur l'analyse fondamentale, Paris.",
  keywords: [
    'value investing',
    'investissement',
    'analyse fondamentale',
    'portefeuille',
    'rapports annuels',
    'Paris',
    'Connan Investment',
  ],
  authors: [{ name: 'Guillaume Connan' }],
  openGraph: {
    title: 'Connan Investment',
    description: 'Analyses value investing, portefeuille et rapports annuels.',
    url: 'https://connaninvestment.com',
    siteName: 'Connan Investment',
    locale: 'fr_FR',
    type: 'website',
    images: [{ url: '/logo-horizontal.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Connan Investment',
    description: 'Analyses value investing, portefeuille et rapports annuels.',
    images: ['/logo-horizontal.png'],
  },
  icons: {
    icon: '/logo-horizontal.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable}`}>
      <body
        className="font-sans min-h-screen flex flex-col"
        style={{ fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif' }}
      >
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
