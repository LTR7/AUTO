import type { Metadata, Viewport } from "next";
import { siteConfig } from "@/constants/site";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  keywords: [
    "agentic AI",
    "autonomous systems",
    "AI agents",
    "AI club",
    "multi-agent systems",
    "AI orchestration",
    "builders",
  ],
  authors: [{ name: siteConfig.name }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#080c18" },
  ],
};

// Runs before paint: applies the persisted/system theme to avoid a flash.
const themeInitScript = `(function(){try{var s=localStorage.getItem('auto-theme');var m='system';if(s){m=(JSON.parse(s).state||{}).mode||'system';}var d=m==='dark'||(m!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var r=document.documentElement;r.classList.toggle('dark',d);r.style.colorScheme=d?'dark':'light';}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-pill focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-white"
        >
          Skip to content
        </a>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <Nav />
        <ScrollReveal />
        {children}
        <Footer />
      </body>
    </html>
  );
}
