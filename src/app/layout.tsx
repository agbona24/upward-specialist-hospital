import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Upward Specialist Hospital | Quality Care, Close to Home — Idimu, Lagos",
  description: "Get expert specialist care without travelling far. Upward Specialist Hospital in Idimu, Lagos offers 24/7 emergency services, maternity, surgery, paediatrics and more — with doctors you can trust and a team that treats you like family.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Upward Health",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        <meta name="theme-color" content="#1B5E8C" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="min-h-full bg-[#F8FBFF] font-sans text-[#222222]">
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch(() => {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
