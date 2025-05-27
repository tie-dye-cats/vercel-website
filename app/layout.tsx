import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AdVelocity - Your Ad Growth Partner',
  description: 'AdVelocity transforms your ad spend into measurable business growth. With millions in managed paid media across Facebook, Google, and TikTok, we deliver real results that scale your business.',
  keywords: 'digital marketing, paid advertising, Facebook ads, Google ads, TikTok ads, ad management, marketing agency, ROI optimization',
  authors: [{ name: 'AdVelocity' }],
  openGraph: {
    title: 'AdVelocity - Your Ad Growth Partner',
    description: 'Transform your ad spend into measurable business growth with expert paid media management.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AdVelocity - Your Ad Growth Partner',
    description: 'Transform your ad spend into measurable business growth with expert paid media management.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
} 