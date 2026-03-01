import type { Metadata } from 'next'
import { Bebas_Neue, Montserrat, Inter } from 'next/font/google'
import './globals.css'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Help Us Put a Book in a Child's Hands | Ready for School Peru",
  description:
    'Help us raise $1,000 to provide books and backpacks to children in rural Peru. Every donation makes a difference. Plus — we\'re donating a jungle gym playground!',
  openGraph: {
    title: "Help Us Put a Book in a Child's Hands",
    description:
      'Help Ready for School Peru provide books and backpacks to children who need them most.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${montserrat.variable} ${inter.variable}`}
    >
      <body className="font-inter bg-forest-light text-white antialiased">
        {children}
      </body>
    </html>
  )
}
