import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Blog IA - Contenu généré automatiquement",
  description: "Découvrez des articles générés intelligemment par l'IA",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="antialiased">
        <Navbar/>
        {children}
      </body>
    </html>
  );
}