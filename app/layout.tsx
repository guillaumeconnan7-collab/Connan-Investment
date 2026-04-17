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

const BASE_URL = 'https://connaninvestment.com'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Connan Investment — Value Investing & Analyse Fondamentale',
    template: '%s — Connan Investment',
  },
  description:
    "Connan Investment publie des analyses d'entreprises selon les principes du value investing : analyse fondamentale, thèses d'investissement long terme et rapports annuels. Capital personnel, sans effet de levier.",
  keywords: [
    'value investing',
    'analyse fondamentale',
    'investissement long terme',
    'portefeuille actions',
    'analyse financière',
    'thèse investissement',
    'Connan Investment',
    'Guillaume Connan',
    'rapports annuels',
    'investissement sans levier',
    'analyse boursière',
    'Benjamin Graham',
    'Warren Buffett',
  ],
  authors: [{ name: 'Guillaume Connan', url: BASE_URL }],
  creator: 'Guillaume Connan',
  publisher: 'Connan Investment',
  openGraph: {
    title: 'Connan Investment — Value Investing & Analyse Fondamentale',
    description:
      "Analyses d'entreprises, portefeuille et rapports annuels. Approche value investing fondée sur l'analyse fondamentale et l'horizon long terme.",
    url: BASE_URL,
    siteName: 'Connan Investment',
    locale: 'fr_FR',
    type: 'website',
    images: [
      {
        url: '/logo-horizontal.png',
        width: 1200,
        height: 630,
        alt: 'Connan Investment — Value Investing',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Connan Investment — Value Investing & Analyse Fondamentale',
    description:
      "Analyses d'entreprises, portefeuille et rapports annuels. Approche value investing fondée sur l'analyse fondamentale.",
    images: ['/logo-horizontal.png'],
    creator: '@connaninvest',
  },
  icons: {
    icon: '/logo-horizontal.png',
  },
  alternates: {
    canonical: BASE_URL,
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
