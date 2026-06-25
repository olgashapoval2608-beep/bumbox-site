import type { Metadata, Viewport } from "next";
import { Unbounded, Manrope, JetBrains_Mono } from "next/font/google";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import "./globals.css";

/* Ukrainian band → a Ukrainian variable display face. Unbounded carries the
   БУМБОКС wordmark; Manrope is the warm body grotesque; JetBrains Mono is the
   counter/VU/utility face for years, track numbers and signal cues. */
const display = Unbounded({
  subsets: ["latin", "cyrillic"],
  variable: "--font-display",
  display: "swap",
});
const sans = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-mono",
  display: "swap",
});

const SITE_URL = "https://bumbox.band";
const DESCRIPTION =
  "Бумбокс — український гурт, що народився у київській кухні 2004 року і став голосом покоління. Музика, концерти, історія та архів у кінематографічному форматі.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "БУМБОКС — Аналоговий сигнал",
    template: "%s · БУМБОКС",
  },
  description: DESCRIPTION,
  keywords: [
    "Бумбокс",
    "Boombox",
    "BoomBox",
    "Андрій Хливнюк",
    "український гурт",
    "Ukrainian band",
    "Рубікон",
    "Меломанія",
    "концерти",
    "Червона калина",
  ],
  authors: [{ name: "БУМБОКС" }],
  openGraph: {
    type: "website",
    locale: "uk_UA",
    url: SITE_URL,
    siteName: "БУМБОКС",
    title: "БУМБОКС — Аналоговий сигнал",
    description: DESCRIPTION,
    images: [
      {
        url: "/media/band-group.jpg",
        width: 1280,
        height: 720,
        alt: "Гурт Бумбокс",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "БУМБОКС — Аналоговий сигнал",
    description: DESCRIPTION,
    images: ["/media/band-group.jpg"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },
};

export const viewport: Viewport = {
  themeColor: "#0b0a09",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="uk"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <body className="grain">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MusicGroup",
              name: "Бумбокс",
              alternateName: "BoomBox",
              foundingDate: "2004",
              foundingLocation: "Київ, Україна",
              genre: ["Funk", "Hip hop", "Soul", "Rock"],
              url: SITE_URL,
              image: `${SITE_URL}/media/band-group.jpg`,
              description: DESCRIPTION,
              sameAs: [
                "https://www.instagram.com/boombox.ua/",
                "https://www.youtube.com/user/familyboombox",
                "https://open.spotify.com/search/Бумбокс",
              ],
            }),
          }}
        />
        <a
          href="#music"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-signal focus:px-5 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:tracking-widest focus:text-bone"
        >
          Перейти до змісту
        </a>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
