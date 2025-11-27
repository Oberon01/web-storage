import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Web Storage - Documents & Media',
  description: 'Store and manage your documents and media files',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
