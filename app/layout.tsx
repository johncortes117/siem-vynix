import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'

export const metadata: Metadata = {
  title: 'Centinela',
  description: 'SIEM',
  generator: '...',
  icons: {
    icon: '/logo-centinela.png', // Added favicon
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="h-full w-full bg-background text-foreground flex justify-center">
        <div className="w-full max-w-[1600px]">
          <main className="min-h-screen w-full">
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </main>
        </div>
      </body>
    </html>
  )
}
