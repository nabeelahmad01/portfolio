import { Playfair_Display, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata = {
  title: "Nabil Ahmad | Full-Stack Developer & AI Automation Specialist",
  description: "Premium full-stack web developer and AI automation engineer specializing in custom ChatGPT bots, Twilio voice lines, semantic smart search, and conversion-optimized websites.",
  keywords: ["full-stack developer", "AI automation", "chatbot developer", "n8n automation", "Next.js developer", "Twilio voice bot", "semantic search"],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${plusJakarta.variable} ${jetbrains.variable}`}>
      <head>
        <link rel="icon" href="/favicon.png?v=2" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
