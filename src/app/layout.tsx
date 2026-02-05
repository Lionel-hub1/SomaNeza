import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "SomaNeza - Learn Kinyarwanda",
  description: "Interactive app to help toddlers learn reading Kinyarwanda letters and syllables",
  keywords: ["Kinyarwanda", "Rwanda", "learn reading", "toddlers", "education", "syllables"],
  authors: [{ name: "SomaNeza" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  themeColor: "#6366f1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="rw">
      <body className={`${outfit.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
