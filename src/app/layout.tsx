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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#F8FBFF] font-sans text-[#222222]">{children}</body>
    </html>
  );
}
