import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vivante — Manger les lieux",
  description:
    "Collectif culinaire du Luberon. Cuisine vivante, festive et populaire : banquets de village, ateliers cuisine, produits locaux.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
