import Link from "next/link";

export default function NotFound() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-2">Page introuvable</h1>
       <h2 className="text-2xl font-bold text-white">Article introuvable</h2>
      <p className="mt-2 text-white/70">Le contenu demandé n’existe pas ou a été supprimé.</p>
      <Link href="/" className="text-blue-600 mt-4 inline-block">
        ← Retour à l&apos;accueil
      </Link>
    </main>
  );
}
