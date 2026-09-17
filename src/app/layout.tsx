import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/layout/theme-toggle";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

// Inter carries body copy and UI chrome; Space Grotesk gives headings a
// sharper, technical edge without drifting into "futuristic" gimmick territory.
const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "600", "700"],
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0c" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "ZKR Resume AI — Build Professional Resumes with AI",
    template: "%s | ZKR Resume AI",
  },
  description:
    "Create stunning, ATS-optimized resumes in minutes with AI assistance. Stand out and land your dream job.",
  keywords: [
    "resume builder",
    "AI resume",
    "professional resume",
    "ATS friendly",
    "cover letter",
    "career",
  ],
  authors: [{ name: "ZKR", url: "https://x.com/zkr_ad" }],
  creator: "ZKR",
  // Single real brand asset — no generated/placeholder icon.
  icons: {
    icon: "/logo/zkr.jpg",
    shortcut: "/logo/zkr.jpg",
    apple: "/logo/zkr.jpg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "ZKR Resume AI",
    title: "ZKR Resume AI — Build Professional Resumes with AI",
    description:
      "Create stunning, ATS-optimized resumes in minutes with AI assistance.",
    images: [{ url: "/logo/zkr.jpg", width: 1170, height: 1166, alt: "ZKR Resume AI" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ZKR Resume AI — Build Professional Resumes with AI",
    description:
      "Create stunning, ATS-optimized resumes in minutes with AI assistance.",
    creator: "@zkr_ad",
    images: ["/logo/zkr.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}