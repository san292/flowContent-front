export default function NotFound() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-2">Page introuvable</h1>
      <p className="text-gray-600">Désolé, cette page n’existe pas.</p>
      <a href="/" className="text-blue-600 mt-4 inline-block">← Retour à l’accueil</a>
    </main>
  );
}
