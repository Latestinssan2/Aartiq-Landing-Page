import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { APP_INFO } from "@/lib/version";
import { getVersionFromPackage } from "@/lib/version-server";

const APP_VERSION = getVersionFromPackage();

const outfit = Outfit({ 
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
});

const SITE_URL = 'https://aartiq.ponsrischool.in';
const LOGO_URL = `${SITE_URL}/logo-transparent.png`;

export const viewport: Viewport = {
  themeColor: "#03040b",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "Aartiq",
  category: "technology",
  title: {
    default: `Aartiq - Open Source AI-Integrated Browser with Local LLM & OS Automation`,
    template: `%s | Aartiq - AI-Integrated Browser`,
  },
  description: "Aartiq is a local-first, open-source AI-native browser with a built-in assistant, local LLM support (Ollama), permission-gated OS automation, and end-to-end encrypted cross-device sync. Built by Latestinssan (Ponsri School) with Electron, Next.js, and TypeScript.",
  keywords: [
    "Aartiq", "Aartiq Browser", "AI Browser", "Autonomous Browser",
    "Browser Automation", "Electron Browser", "AI Agent",
    "Local LLM", "Ollama Browser", "Privacy Browser", "Open Source Browser",
    "E2EE Sync", "Cross-Platform Browser", "OS Automation",
    "Browser AI Agent", "macOS Browser",
    "Windows Browser", "Linux Browser", "Android Browser",
    "Productivity Browser", "AI Assistant Browser",
    "Permission-Gated Automation", "Secure Browser",
    "AI-Integrated Browser", "AI Task Agent",
    "PONSRISCHOOL BROWSER", "Ponsri School Browser", "AARTIQ PONSRISCHOOL",
    "Latestinssan",
    "aart", "aartiq",
    "aarti", "aarti browser", "local first browser",
    "privacy first AI browser", "open source AI automation"
  ],
  authors: [
    { name: "Latestinssan", url: "https://github.com/Latestinssan" },
    { name: "Latestinssan", url: "https://github.com/Latestinssan" }
  ],
  creator: "Latestinssan",
  publisher: "Aartiq",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Aartiq - Open Source AI-Integrated Browser",
    description: "An open-source browser with a built-in AI assistant, local LLM support, and cross-device sync. Features permission-gated OS automation and local-first architecture.",
    url: SITE_URL,
    siteName: 'Aartiq',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aartiq - Open Source AI-Integrated Browser',
    description: 'Open-source browser with a built-in AI assistant, local LLM support, and cross-device sync.',
    creator: '@Latestinssan',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'llms.txt': `${SITE_URL}/llms.txt`,
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      'en': SITE_URL,
      'x-default': SITE_URL,
    },
  },
  verification: {
    google: ['BgnZqDgMLWR3GCOKwPz1U1qh8PSetoVcIc7DsrEy_iA', 'BuPrG5ROAefeU7rpMmWDlhk1-zm2_Y3mHRgNy4XkDyU'],
  },
    icons: [
    { rel: "icon", url: "/favicon.ico" },
    { rel: "apple-touch-icon", url: "/logo-transparent.png" },
    { rel: "manifest", url: "/manifest.json" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script type="module" src="https://get.microsoft.com/badge/ms-store-badge.bundled.js"></script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Aartiq",
              "alternateName": "Aartiq Browser",
              "url": SITE_URL,
              "image": LOGO_URL,
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": `${SITE_URL}/search?q={search_term_string}`
                },
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Aartiq",
              "alternateName": ["Aartiq Browser", "Ponsri School Browser", "PONSRISCHOOL BROWSER"],
              "url": SITE_URL,
              "logo": LOGO_URL,
              "image": LOGO_URL,
              "founder": {
                "@type": "Person",
                "name": "Latestinssan",
                "url": "https://github.com/Latestinssan",
                "sameAs": [
                  "https://github.com/Latestinssan",
                  "https://github.com/Latestinssan"
                ]
              },
              "sameAs": [
                "https://github.com/Latestinssan/Aartiq",
                "https://aartiq.ponsrischool.in"
              ]
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": APP_INFO.name,
              "alternateName": APP_INFO.fullName,
              "description": "Open-source browser with a built-in AI assistant, background scheduling, local LLM support, and local-first cross-device sync.",
              "url": SITE_URL,
              "image": LOGO_URL,
              "applicationCategory": "UtilityApplication",
              "operatingSystem": ["Windows", "macOS", "Linux", "Android"],
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock"
              },
              "author": {
                "@type": "Person",
                "name": "Latestinssan",
                "url": "https://github.com/Latestinssan",
                "memberOf": {
                  "@type": "Organization",
                  "name": "Aartiq Team"
                }
              },
              "downloadUrl": `${SITE_URL}/downloads`,
              "softwareVersion": APP_VERSION.version,
              "releaseNotes": "https://github.com/Latestinssan/Aartiq/releases",
              "featureList": [
                "AI Agent Control",
                "Local LLM Support (Ollama)",
                "Shell Command Execution",
                "Background Scheduling",
                "Six-Layer Security",
                "Cross-Device Sync",
                "PDF Generation",
                "Open Source"
              ]
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TechArticle",
              "headline": `${APP_INFO.name} Documentation`,
              "description": "Documentation for Aartiq — installation, AI commands, API reference, security model, and developer guides.",
              "url": `${SITE_URL}/docs`,
              "datePublished": "2024-01-01",
              "dateModified": "2026-04-06",
              "author": {
                "@type": "Person",
                "name": "Latestinssan",
                "url": "https://github.com/Latestinssan"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Aartiq Team",
                "logo": {
                  "@type": "ImageObject",
                  "url": LOGO_URL
                }
              },
              "about": {
                "@type": "SoftwareApplication",
                "name": APP_INFO.name,
                "applicationCategory": "UtilityApplication",
                "operatingSystem": ["Windows", "macOS", "Linux", "Android"]
              },
              "proficiencyLevel": "Beginner",
              "genre": ["Documentation", "Technical Reference", "Developer Guide"]
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              "name": `${APP_INFO.name} Documentation Index`,
              "description": "Index of all documentation pages for Aartiq",
              "url": `${SITE_URL}/docs`,
              "mainEntity": {
                "@type": "ItemList",
                "itemListElement": [
                  {"@type": "ListItem", "position": 1, "name": "Getting Started", "url": `${SITE_URL}/docs/getting-started`},
                  {"@type": "ListItem", "position": 2, "name": "Overview", "url": `${SITE_URL}/docs/overview`},
                  {"@type": "ListItem", "position": 3, "name": "AI Commands", "url": `${SITE_URL}/docs/ai-commands`},
                  {"@type": "ListItem", "position": 4, "name": "Security", "url": `${SITE_URL}/docs/security`},
                  {"@type": "ListItem", "position": 5, "name": "Automation", "url": `${SITE_URL}/docs/automation`},
                  {"@type": "ListItem", "position": 6, "name": "Cloud Sync", "url": `${SITE_URL}/docs/cloud-sync`},
                  {"@type": "ListItem", "position": 7, "name": "Plugins", "url": `${SITE_URL}/docs/plugins`},
                  {"@type": "ListItem", "position": 8, "name": "API Reference", "url": `${SITE_URL}/docs/api-reference`}
                ]
              }
            })
          }}
        />
      </head>
      <body className={`${outfit.variable} font-outfit antialiased bg-[#03040b] text-white`}>
        {children}
      </body>
    </html>
  );
}
