import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Telegram Games Hub',
  description: 'Play multiple games inside Telegram',
  viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#0a0e27" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <script src="https://telegram.org/js/telegram-web-app.js"></script>
      </head>
      <body className="game-container">
        {children}
      </body>
    </html>
  )
}
