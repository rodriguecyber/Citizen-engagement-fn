import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthCheck } from '@/components/auth/auth-check'


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Citizen Engagement Platform",
  description: "A platform for citizen engagement and complaint management",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthCheck />
        <ThemeProvider attribute="class" defaultTheme="dark">

          {children}
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}
