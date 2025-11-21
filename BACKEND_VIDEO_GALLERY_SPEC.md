# Spécification Backend - Endpoint Galerie Vidéos

## 🎯 Contexte

Le frontend a besoin d'un endpoint pour lister toutes les vidéos générées par l'utilisateur afin de les afficher dans la galerie du Blog Studio.

---

## 📋 Endpoint manquant

### GET `/api/videos-svd/my-videos`

**Description** : Récupère la liste de toutes les vidéos générées par l'utilisateur courant

**Méthode** : `GET`

**URL** : `http://localhost:8080/api/videos-svd/my-videos`

**Query Parameters** :
- `limit` (optionnel) : Nombre maximum de vidéos à retourner (défaut: 50)
  - Type: `number`
  - Exemple: `?limit=20`

**Headers** :
```
Content-Type: application/json
Authorization: Bearer <token> (si authentification requise)
```

---

## 📤 Réponse attendue

### Cas de succès (200 OK)

**Format** : Array de `VideoJob`

```json
[
  {
    "jobId": "550e8400-e29b-41d4-a716-446655440000",
    "status": "completed",
    "videoUrl": "https://xxxxx.supabase.co/storage/v1/object/public/videos/video-123.mp4",
    "duration": 2.33,
    "fps": 6,
    "frames": 14,
    "provider": "replicate",
    "progress": 100,
    "createdAt": "2025-11-17T23:00:00.000Z",
    "completedAt": "2025-11-17T23:01:30.000Z",
    "error": null,
    "articleId": "article-uuid-123",
    "domainId": "domain-uuid-456"
  },
  {
    "jobId": "660e8400-e29b-41d4-a716-446655440001",
    "status": "processing",
    "videoUrl": null,
    "duration": null,
    "fps": 6,
    "frames": 14,
    "provider": "replicate",
    "progress": 75,
    "createdAt": "2025-11-17T23:05:00.000Z",
    "completedAt": null,
    "error": null,
    "articleId": null,
    "domainId": null
  },
  {
    "jobId": "770e8400-e29b-41d4-a716-446655440002",
    "status": "failed",
    "videoUrl": null,
    "duration": null,
    "fps": 6,
    "frames": 14,
    "provider": "replicate",
    "progress": 0,
    "createdAt": "2025-11-17T22:50:00.000Z",
    "completedAt": "2025-11-17T22:51:15.000Z",
    "error": "Generation failed: Invalid image URL",
    "articleId": null,
    "domainId": null
  }
]
```

### TypeScript Type

```typescript
export type VideoJob = {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  videoUrl?: string | null;
  duration?: number | null;
  fps?: number;
  frames?: number;
  provider?: 'replicate';
  progress?: number;
  createdAt: string;
  completedAt?: string | null;
  error?: string | null;
  articleId?: string | null;
  domainId?: string | null;
};
```

---

## 🗃️ Logique Backend recommandée

### Requête SQL (exemple avec Supabase/Postgres)

```sql
SELECT
  job_id as "jobId",
  status,
  video_url as "videoUrl",
  duration,
  fps,
  frames,
  provider,
  progress,
  created_at as "createdAt",
  completed_at as "completedAt",
  error,
  article_id as "articleId",
  domain_id as "domainId"
FROM video_jobs
WHERE user_id = $1  -- ID utilisateur courant
ORDER BY created_at DESC
LIMIT $2;  -- Paramètre limit (défaut 50)
```

### Controller NestJS (exemple)

```typescript
@Get('my-videos')
async getMyVideos(
  @Query('limit') limit: number = 50,
  @Req() req: Request  // Pour récupérer user_id depuis auth
): Promise<VideoJob[]> {
  const userId = req.user.id;  // Selon votre système d'auth

  return await this.videosSvdService.findAllByUser(userId, limit);
}
```

---

## 🔒 Sécurité

- ✅ **Authentication requise** : L'utilisateur doit être connecté
- ✅ **Authorization** : Ne retourner QUE les vidéos de l'utilisateur connecté
- ✅ **Limite** : Max 100 vidéos pour éviter les requêtes trop lourdes

---

## 📊 Tri recommandé

Par défaut, trier par **date de création décroissante** (plus récentes en premier) :

```sql
ORDER BY created_at DESC
```

---

## ⚠️ Cas d'erreur

### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "User not authenticated"
}
```

### 500 Internal Server Error

```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Database connection failed"
}
```

---

## 🧪 Exemple de test

### cURL

```bash
curl -X GET \
  'http://localhost:8080/api/videos-svd/my-videos?limit=20' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE'
```

### Réponse attendue

```json
[
  {
    "jobId": "550e8400-e29b-41d4-a716-446655440000",
    "status": "completed",
    "videoUrl": "https://storage.supabase.co/videos/video-123.mp4",
    "duration": 2.33,
    "fps": 6,
    "frames": 14,
    "provider": "replicate",
    "progress": 100,
    "createdAt": "2025-11-17T23:00:00.000Z",
    "completedAt": "2025-11-17T23:01:30.000Z",
    "error": null
  }
]
```

---

## 🎯 Priorité

**Haute** - Ce endpoint bloque l'affichage de la galerie vidéos dans le Blog Studio.

---

## 📝 Notes

1. Le frontend poll déjà l'endpoint `/videos-svd/status/:jobId` pour les vidéos individuelles
2. Cet endpoint `/my-videos` sert uniquement à avoir une vue d'ensemble
3. Pas besoin de pagination complexe pour l'instant (limit suffit)
4. Les vidéos en cours de génération (`status: 'processing'`) doivent aussi être retournées

---

## ✅ Checklist implémentation

- [ ] Créer l'endpoint `GET /api/videos-svd/my-videos`
- [ ] Ajouter le paramètre `limit` (optionnel, défaut 50, max 100)
- [ ] Filtrer par `user_id` de l'utilisateur connecté
- [ ] Trier par `created_at DESC`
- [ ] Retourner tous les statuts (pending, processing, completed, failed)
- [ ] Tester avec des données réelles
- [ ] Tester cas d'erreur (401, 500)
- [ ] Déployer sur Fly.dev

---

Une fois implémenté, la galerie s'affichera automatiquement côté frontend ! 🎬
