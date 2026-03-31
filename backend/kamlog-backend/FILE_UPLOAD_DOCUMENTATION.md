# Documentation - Système d'Upload de Fichiers KAMLOG

## 📋 Vue d'ensemble

Système complet d'upload et de gestion de fichiers pour l'API KAMLOG avec :
- **Images publiques** (services, actualités, partenaires, etc.)
- **CV privés** (candidatures)
- **Documents privés** (usage futur)

---

## 🗂️ Structure de Stockage

### **Disques Configurés**

| Disk | Type | Chemin | URL | Usage |
|------|------|--------|-----|-------|
| **images** | Public | `storage/app/public/images` | `/storage/images` | Images optimisées |
| **cvs** | Privé | `storage/app/private/cvs` | N/A | CV candidats |
| **documents** | Privé | `storage/app/private/documents` | N/A | Documents divers |

### **Organisation des Dossiers**

```
storage/
├── app/
│   ├── public/
│   │   └── images/
│   │       ├── services/
│   │       ├── news/
│   │       ├── partners/
│   │       ├── infrastructures/
│   │       ├── jobs/
│   │       ├── announcements/
│   │       └── general/
│   └── private/
│       ├── cvs/
│       │   ├── user_1/
│       │   ├── user_2/
│       │   └── general/
│       └── documents/
```

---

## 🖼️ Upload d'Images

### **Endpoint Admin**

```http
POST /api/v1/admin/files/images/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

### **Paramètres**

| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `image` | File | ✅ | Fichier image |
| `folder` | String | ❌ | Dossier de destination |
| `max_width` | Integer | ❌ | Largeur max (défaut: 1920) |
| `max_height` | Integer | ❌ | Hauteur max (défaut: 1080) |
| `quality` | Integer | ❌ | Qualité JPEG (1-100, défaut: 85) |
| `thumbnail` | Boolean | ❌ | Créer miniature (défaut: true) |
| `thumb_width` | Integer | ❌ | Largeur miniature (défaut: 300) |
| `thumb_height` | Integer | ❌ | Hauteur miniature (défaut: 300) |

### **Validation**

- **Formats acceptés** : JPEG, JPG, PNG, GIF, WebP
- **Taille max** : 5 MB
- **Dossiers valides** : `services`, `news`, `partners`, `infrastructures`, `jobs`, `announcements`, `general`

### **Exemple de Requête**

```javascript
const formData = new FormData();
formData.append('image', imageFile);
formData.append('folder', 'news');
formData.append('max_width', 1920);
formData.append('quality', 90);
formData.append('thumbnail', true);

const response = await axios.post('/api/v1/admin/files/images/upload', formData, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'multipart/form-data'
  }
});
```

### **Réponse Succès**

```json
{
  "success": true,
  "message": "Image uploadée avec succès",
  "data": {
    "path": "news/article-kamlog_1711368000_a1b2c3d4.jpg",
    "url": "http://localhost:8000/storage/images/news/article-kamlog_1711368000_a1b2c3d4.jpg",
    "thumbnail_path": "news/thumb_article-kamlog_1711368000_a1b2c3d4.jpg",
    "thumbnail_url": "http://localhost:8000/storage/images/news/thumb_article-kamlog_1711368000_a1b2c3d4.jpg",
    "filename": "article-kamlog_1711368000_a1b2c3d4.jpg",
    "original_name": "article-kamlog.jpg",
    "mime_type": "image/jpeg",
    "size": 245678
  }
}
```

### **Optimisations Automatiques**

1. **Redimensionnement** : Si l'image dépasse les dimensions max
2. **Compression** : Selon la qualité spécifiée
3. **Miniature** : Création automatique (300x300 par défaut)
4. **Nom unique** : `{slug}_{timestamp}_{random}.{ext}`

---

## 📄 Upload de CV

### **Endpoint Public**

```http
POST /api/v1/upload/cv
Content-Type: multipart/form-data
Rate Limit: 5 uploads/jour
```

### **Paramètres**

| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `cv` | File | ✅ | Fichier CV |
| `user_id` | Integer | ❌ | ID utilisateur (admin) |

### **Validation**

- **Formats acceptés** : PDF, DOC, DOCX
- **Taille max** : 2 MB
- **Rate limiting** : 5 uploads par jour par IP

### **Exemple de Requête**

```javascript
const formData = new FormData();
formData.append('cv', cvFile);

const response = await axios.post('/api/v1/upload/cv', formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});
```

### **Réponse Succès**

```json
{
  "success": true,
  "message": "CV uploadé avec succès",
  "data": {
    "path": "general/cv-john-doe_1711368000_x9y8z7w6.pdf",
    "filename": "cv-john-doe_1711368000_x9y8z7w6.pdf",
    "original_name": "cv-john-doe.pdf",
    "mime_type": "application/pdf",
    "size": 156789,
    "disk": "cvs"
  }
}
```

---

## 🗑️ Suppression de Fichiers

### **Supprimer une Image (Admin)**

```http
DELETE /api/v1/admin/files/images
Authorization: Bearer {token}
Content-Type: application/json
```

**Body** :
```json
{
  "path": "news/article-kamlog_1711368000_a1b2c3d4.jpg"
}
```

**Réponse** :
```json
{
  "success": true,
  "message": "Image supprimée avec succès",
  "data": null
}
```

**Note** : Supprime automatiquement la miniature associée.

---

### **Supprimer un CV (Admin)**

```http
DELETE /api/v1/admin/files/cvs
Authorization: Bearer {token}
Content-Type: application/json
```

**Body** :
```json
{
  "path": "general/cv-john-doe_1711368000_x9y8z7w6.pdf"
}
```

---

## 📥 Téléchargement de Fichiers Privés

### **Télécharger un CV (Admin)**

```http
GET /api/v1/admin/files/cvs/download?path={path}
Authorization: Bearer {token}
```

**Exemple** :
```javascript
const response = await axios.get('/api/v1/admin/files/cvs/download', {
  params: {
    path: 'general/cv-john-doe_1711368000_x9y8z7w6.pdf'
  },
  headers: {
    'Authorization': `Bearer ${token}`
  },
  responseType: 'blob' // Important pour les fichiers
});

// Créer un lien de téléchargement
const url = window.URL.createObjectURL(new Blob([response.data]));
const link = document.createElement('a');
link.href = url;
link.setAttribute('download', 'cv-john-doe.pdf');
document.body.appendChild(link);
link.click();
```

---

## ℹ️ Informations sur une Image

### **Obtenir les infos d'une image (Admin)**

```http
GET /api/v1/admin/files/images/info?path={path}
Authorization: Bearer {token}
```

**Réponse** :
```json
{
  "success": true,
  "data": {
    "path": "news/article-kamlog_1711368000_a1b2c3d4.jpg",
    "url": "http://localhost:8000/storage/images/news/article-kamlog_1711368000_a1b2c3d4.jpg",
    "size": 245678,
    "exists": true
  }
}
```

---

## 🔒 Sécurité

### **Contrôle d'Accès**

| Route | Accès | Authentification |
|-------|-------|------------------|
| Upload image | Admin uniquement | Sanctum token |
| Upload CV | Public | Rate limiting |
| Supprimer image | Admin uniquement | Sanctum token |
| Supprimer CV | Admin uniquement | Sanctum token |
| Télécharger CV | Admin uniquement | Sanctum token |

### **Rate Limiting**

| Endpoint | Limite | Période |
|----------|--------|---------|
| Upload CV (public) | 5 uploads | 1 jour |
| Upload image (admin) | Illimité | - |

### **Validation des Fichiers**

**Images** :
- Extension vérifiée (MIME type)
- Taille max : 5 MB
- Formats : JPEG, PNG, GIF, WebP

**CV** :
- Extension vérifiée (MIME type)
- Taille max : 2 MB
- Formats : PDF, DOC, DOCX

---

## 🛠️ Service FileUploadService

### **Méthodes Disponibles**

```php
// Upload
uploadImage(UploadedFile $file, string $folder, array $options): array
uploadCV(UploadedFile $file, ?int $userId): array
uploadDocument(UploadedFile $file, string $folder): array

// Suppression
deleteImage(string $path): bool
deleteCV(string $path): bool
deleteDocument(string $path): bool

// Téléchargement
downloadPrivateFile(string $path, string $disk): StreamedResponse

// Utilitaires
exists(string $path, string $disk): bool
getImageUrl(string $path): ?string
getFileSize(string $path, string $disk): ?int
```

### **Exemple d'Utilisation dans un Contrôleur**

```php
use App\Services\FileUploadService;

class NewsController extends Controller
{
    protected FileUploadService $fileUploadService;

    public function __construct(FileUploadService $fileUploadService)
    {
        $this->fileUploadService = $fileUploadService;
    }

    public function store(NewsRequest $request)
    {
        // Upload de l'image
        if ($request->hasFile('image')) {
            $imageData = $this->fileUploadService->uploadImage(
                $request->file('image'),
                'news',
                ['quality' => 90]
            );
            
            $validated['image_url'] = $imageData['url'];
            $validated['image_path'] = $imageData['path'];
        }

        $news = News::create($validated);
        
        return response()->json($news, 201);
    }
}
```

---

## 📦 Installation et Configuration

### **1. Créer les Dossiers de Stockage**

```bash
# Créer les dossiers
mkdir -p storage/app/public/images/{services,news,partners,infrastructures,jobs,announcements,general}
mkdir -p storage/app/private/cvs/general
mkdir -p storage/app/private/documents

# Créer le lien symbolique
php artisan storage:link
```

### **2. Permissions**

```bash
chmod -R 775 storage/app/public
chmod -R 775 storage/app/private
chown -R www-data:www-data storage
```

### **3. Installer Intervention Image** (Optionnel)

```bash
composer require intervention/image
```

**Note** : Le service utilise Intervention Image pour l'optimisation. Si non installé, modifier le service pour utiliser les fonctions PHP natives.

### **4. Configuration .env**

```env
FILESYSTEM_DISK=local
APP_URL=http://localhost:8000
```

---

## 🧪 Tests

### **Test Upload Image**

```bash
curl -X POST http://localhost:8000/api/v1/admin/files/images/upload \
  -H "Authorization: Bearer {token}" \
  -F "image=@/path/to/image.jpg" \
  -F "folder=news" \
  -F "quality=90"
```

### **Test Upload CV**

```bash
curl -X POST http://localhost:8000/api/v1/upload/cv \
  -F "cv=@/path/to/cv.pdf"
```

### **Test Suppression**

```bash
curl -X DELETE http://localhost:8000/api/v1/admin/files/images \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"path":"news/image_123.jpg"}'
```

---

## 📊 Limites et Quotas

| Type | Limite | Configurable |
|------|--------|--------------|
| **Taille image** | 5 MB | ✅ `UploadImageRequest` |
| **Taille CV** | 2 MB | ✅ `UploadCVRequest` |
| **Largeur max image** | 1920px | ✅ Paramètre `max_width` |
| **Hauteur max image** | 1080px | ✅ Paramètre `max_height` |
| **Qualité JPEG** | 85% | ✅ Paramètre `quality` |
| **Uploads CV/jour** | 5 | ✅ Route middleware |

---

## 🔄 Intégration Frontend

### **React/Vue - Upload d'Image**

```javascript
import axios from 'axios';

const uploadImage = async (file, folder = 'general') => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('folder', folder);
  formData.append('quality', 90);
  formData.append('thumbnail', true);

  try {
    const response = await axios.post(
      '/api/v1/admin/files/images/upload',
      formData,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Upload: ${percentCompleted}%`);
        }
      }
    );

    return response.data.data;
  } catch (error) {
    console.error('Upload error:', error.response?.data);
    throw error;
  }
};
```

### **React - Composant Upload**

```jsx
import { useState } from 'react';

function ImageUploader({ onUploadSuccess }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    
    try {
      const result = await uploadImage(file, 'news');
      onUploadSuccess(result);
    } catch (error) {
      alert('Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileChange}
        disabled={uploading}
      />
      {uploading && <p>Upload en cours... {progress}%</p>}
    </div>
  );
}
```

---

## ✅ Checklist Déploiement

- [ ] Créer les dossiers de stockage
- [ ] Configurer les permissions (775)
- [ ] Créer le lien symbolique (`php artisan storage:link`)
- [ ] Installer Intervention Image (optionnel)
- [ ] Tester upload d'image
- [ ] Tester upload de CV
- [ ] Tester suppression
- [ ] Tester téléchargement
- [ ] Configurer les quotas de stockage serveur
- [ ] Mettre en place la rotation des logs
- [ ] Configurer les backups automatiques

---

## 🎯 Résumé

Le système d'upload de fichiers KAMLOG offre :

✅ **Upload d'images optimisées** - Redimensionnement, compression, miniatures  
✅ **Upload de CV sécurisé** - Stockage privé, rate limiting  
✅ **Validation stricte** - Types MIME, tailles, formats  
✅ **API RESTful** - Routes publiques et admin  
✅ **Service réutilisable** - `FileUploadService` injectable  
✅ **Sécurité** - Authentification, rate limiting, validation  
✅ **Performance** - Optimisation automatique des images  
✅ **Production ready** - Prêt pour déploiement  

**Le système est maintenant opérationnel !** 🚀
