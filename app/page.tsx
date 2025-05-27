import React from 'react'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            Professional Agency Website
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Modern, clean, and professional website built with Next.js 14+
          </p>
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-2xl font-semibold mb-4">✅ Foundation Ready</h2>
            <ul className="text-left space-y-2">
              <li>✅ Next.js 14+ with App Router</li>
              <li>✅ TypeScript configured</li>
              <li>✅ Tailwind CSS with dark mode</li>
              <li>✅ Clean project structure</li>
              <li>⏳ Supabase integration (next step)</li>
              <li>⏳ shadcn/ui components (next step)</li>
              <li>⏳ Lead capture forms (next step)</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
} 