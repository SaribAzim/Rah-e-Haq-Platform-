'use client'

import './globals.css'
import CustomCursor from '@/components/CustomCursor'
import ScrollProgress from '@/components/ScrollProgress'
import FloatingActionButton from '@/components/FloatingActionButton'
import Chatbot from '@/components/Chatbot'
import { ThemeProvider } from '@/components/ThemeProvider'
import { LanguageProvider } from '@/lib/LanguageContext'

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Rah-E-Haq | Bringing Hope To Those In Need</title>
        <meta name="description" content="Join Rah-E-Haq in our mission to bring hope and support to communities in need across Pakistan." />
        <meta name="theme-color" content="#059669" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Rah-E-Haq" />
      </head>
      <body className="antialiased bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <LanguageProvider>
            <ScrollProgress />
            <CustomCursor />
            {children}
            <FloatingActionButton />
            <Chatbot />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
