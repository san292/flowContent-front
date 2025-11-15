// lib/config.ts
export const API_CONFIG = {
  local: 'http://localhost:4000/api',
  production: 'https://flowcontent-back.fly.dev/api',
};

// Détection automatique selon l'environnement
export const API_BASE_URL = 
  process.env.NEXT_PUBLIC_BACKEND_URL || 
  (process.env.NODE_ENV === 'production' 
    ? API_CONFIG.production 
    : API_CONFIG.local
  );