import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Professional Agency Website',
  description: 'Modern professional agency website built with Next.js',
  keywords: ['agency', 'professional', 'web development', 'design'],
  authors: [{ name: 'Your Agency' }],
  openGraph: {
    title: 'Professional Agency Website',
    description: 'Modern professional agency website built with Next.js',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} dark`}>
        {children}
      </body>
    </html>
  )
} 