# Fix : Vidéos Supabase non lisibles

## 🔍 Diagnostic

Erreur : La vidéo est générée et stockée sur Supabase, mais le lecteur ne peut pas la charger.

**URL de test** :
```
https://pwugkhfjsrpplxmhoamh.supabase.co/storage/v1/object/public/videos/videos-svd/ddac86ff-9e8a-4391-8af9-7e02a0219cff.mp4
```

---

## ✅ Solution 1 : Vérifier les permissions du bucket

### Étape 1 : Aller sur Supabase Dashboard

1. Connectez-vous à https://supabase.com
2. Sélectionnez votre projet
3. Menu → **Storage**

### Étape 2 : Vérifier le bucket "videos"

1. Cliquez sur le bucket `videos` (ou `videos-svd`)
2. Cliquez sur les **3 points** → **Edit bucket**
3. **Vérifiez que "Public bucket" est coché ✅**

![Screenshot](https://supabase.com/docs/img/storage-bucket-settings.png)

### Étape 3 : Configuration RLS (Row Level Security)

Si le bucket est public mais ça ne marche toujours pas, vérifiez les **Policies** :

```sql
-- Aller dans Storage > Policies
-- Assurez-vous d'avoir une policy "Public Access" comme ceci :

CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'videos' );
```

Ou plus simplement dans l'interface :
1. Storage → Policies
2. Bucket `videos`
3. Cliquez **"New Policy"**
4. Sélectionnez **"Allow public read access"**

---

## ✅ Solution 2 : Configurer les CORS

### Dans Supabase Dashboard

1. Menu → **Storage**
2. Configuration (icône ⚙️)
3. **CORS Configuration**

Ajoutez ces origins :
```json
{
  "allowedOrigins": [
    "http://localhost:3000",
    "https://votre-domaine.com",
    "*"
  ],
  "allowedMethods": ["GET", "HEAD"],
  "allowedHeaders": ["*"],
  "maxAge": 3600
}
```

**Note** : `"*"` permet tous les domaines (pour le dev, à restreindre en prod)

---

## ✅ Solution 3 : Vérifier le format de la vidéo

### Télécharger et vérifier

1. Téléchargez la vidéo depuis l'URL Supabase
2. Essayez de la lire localement avec VLC ou QuickTime
3. Vérifiez les propriétés :
   - **Format** : MP4
   - **Codec vidéo** : H.264 (recommandé pour web)
   - **Codec audio** : AAC

### Si le format est incorrect

Le problème vient de **Replicate/SVD**. Vérifiez que le backend demande :
```json
{
  "output_format": "mp4",
  "video_encoding": "h264"
}
```

---

## ✅ Solution 4 : Tester avec curl

```bash
curl -I "https://pwugkhfjsrpplxmhoamh.supabase.co/storage/v1/object/public/videos/videos-svd/ddac86ff-9e8a-4391-8af9-7e02a0219cff.mp4"
```

**Réponse attendue** :
```
HTTP/2 200
content-type: video/mp4
access-control-allow-origin: *
cache-control: max-age=3600
content-length: 1234567
```

**Si vous voyez** :
- ❌ `403 Forbidden` → Permissions incorrectes
- ❌ `404 Not Found` → Fichier n'existe pas
- ❌ `content-type: application/octet-stream` → Mauvais MIME type

---

## ✅ Solution 5 : Corriger le MIME type (Backend)

### Dans le backend NestJS

Lors de l'upload vers Supabase, spécifiez le **Content-Type** :

```typescript
// Backend : src/videos-svd/videos-svd.service.ts

const { data, error } = await this.supabase.storage
  .from('videos')
  .upload(filePath, videoBuffer, {
    contentType: 'video/mp4',  // ← IMPORTANT !
    cacheControl: '3600',
    upsert: false
  });
```

---

## ✅ Solution 6 : Bucket Public via SQL

Si l'interface ne fonctionne pas, utilisez SQL :

```sql
-- Dans Supabase SQL Editor

-- 1. Rendre le bucket public
UPDATE storage.buckets
SET public = true
WHERE id = 'videos';

-- 2. Vérifier
SELECT id, name, public
FROM storage.buckets
WHERE id = 'videos';

-- 3. Ajouter une policy publique
CREATE POLICY "Public read videos"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'videos' );
```

---

## 🧪 Test final

### Test 1 : Navigateur
Ouvrez l'URL dans un nouvel onglet :
```
https://pwugkhfjsrpplxmhoamh.supabase.co/storage/v1/object/public/videos/videos-svd/ddac86ff-9e8a-4391-8af9-7e02a0219cff.mp4
```

**Attendu** : La vidéo se lit directement dans le navigateur

### Test 2 : Console développeur
1. F12 → Onglet Network
2. Rechargez la page avec le lecteur vidéo
3. Cherchez la requête vers l'URL Supabase
4. Vérifiez les **Headers** :
   - `access-control-allow-origin: *`
   - `content-type: video/mp4`

### Test 3 : VideoPlayer
Une fois configuré, retournez sur `/admin/blog-studio` et cliquez Play !

---

## 📋 Checklist

- [ ] Bucket `videos` est **public** ✅
- [ ] Policy **"Allow public read access"** activée
- [ ] CORS configuré avec `allowedOrigins: ["*"]`
- [ ] Upload backend spécifie `contentType: 'video/mp4'`
- [ ] L'URL s'ouvre directement dans le navigateur
- [ ] Headers contiennent `access-control-allow-origin`
- [ ] Le VideoPlayer lit la vidéo sans erreur

---

## 🆘 Si rien ne fonctionne

### Option 1 : Bucket complètement ouvert (dev seulement)

```sql
-- ATTENTION : À utiliser seulement en développement !

ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

UPDATE storage.buckets
SET public = true,
    file_size_limit = null,
    allowed_mime_types = null
WHERE id = 'videos';
```

### Option 2 : Re-créer le bucket

1. Storage → Create bucket
2. Nom : `videos-public`
3. Cochez **"Public bucket"** ✅
4. Configurez le backend pour uploader vers `videos-public`

### Option 3 : Utiliser un CDN externe

Si Supabase Storage pose trop de problèmes :
- **Cloudinary** (gratuit 25GB)
- **AWS S3** + CloudFront
- **Vercel Blob Storage**

---

## 📞 Support

Si le problème persiste après toutes ces étapes, contactez le support Supabase :
- Discord : https://discord.supabase.com
- GitHub Issues : https://github.com/supabase/supabase/issues
