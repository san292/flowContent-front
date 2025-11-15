"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Tes identifiants en dur
    const ADMIN_USERNAME = 'sanman';
    const ADMIN_PASSWORD = 'Mouns1921';

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Cookie valable 7 jours
      document.cookie = 'admin-auth=true; path=/; max-age=604800';
      router.push('/admin');
    } else {
      setError('Identifiants incorrects');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold">
          Connexion Admin
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="rounded bg-red-100 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium">
              Nom d'utilisateur
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded border px-3 py-2 focus:border-blue-500 focus:outline-none"
              required
              autoComplete="username"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border px-3 py-2 focus:border-blue-500 focus:outline-none"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}