# 🚀 Guide de Déploiement CABSUL Backend sur Railway

## Prérequis
- Node.js installé
- Git installé
- Compte Railway (https://railway.app)

---

## 📦 ÉTAPE 1 : Préparer le projet Laravel

Ouvrez PowerShell et naviguez vers le dossier backend :

```powershell
cd C:\Users\hp\Downloads\ionic_project_byAyman\cabsul_back\cabsul
```

### 1.1 Installer les dépendances Composer (optimisé production)
```powershell
composer install --optimize-autoloader --no-dev
```

### 1.2 Générer une nouvelle APP_KEY (notez-la !)
```powershell
php artisan key:generate --show
```
> ⚠️ **IMPORTANT** : Copiez cette clé, vous en aurez besoin pour Railway !

### 1.3 Vider les caches
```powershell
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear
```

---

## 🔧 ÉTAPE 2 : Installer Railway CLI

```powershell
npm install -g @railway/cli
```

### 2.1 Se connecter à Railway
```powershell
railway login
```
> Cela ouvrira votre navigateur pour vous authentifier.

---

## 🚂 ÉTAPE 3 : Initialiser le projet Railway

### 3.1 Initialiser dans le dossier backend
```powershell
cd C:\Users\hp\Downloads\ionic_project_byAyman\cabsul_back\cabsul
railway init
```
> Choisissez : **"Empty Project"** ou créez un nouveau projet nommé "cabsul-backend"

### 3.2 Ajouter une base de données MySQL
```powershell
railway add
```
> Sélectionnez : **MySQL**

---

## 🔐 ÉTAPE 4 : Configurer les variables d'environnement

### 4.1 Via Railway Dashboard (Recommandé)
1. Allez sur https://railway.app/dashboard
2. Cliquez sur votre projet "cabsul-backend"
3. Cliquez sur le service web (pas MySQL)
4. Onglet **Variables**
5. Ajoutez ces variables :

```env
APP_NAME=Cabsul
APP_ENV=production
APP_KEY=base64:VOTRE_CLE_GENEREE_ETAPE_1.2
APP_DEBUG=false
APP_URL=${{RAILWAY_PUBLIC_DOMAIN}}

DB_CONNECTION=mysql
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_DATABASE=${{MySQL.MYSQLDATABASE}}
DB_USERNAME=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}

LOG_CHANNEL=stderr
LOG_LEVEL=error

CACHE_DRIVER=file
SESSION_DRIVER=file
QUEUE_CONNECTION=sync

SANCTUM_STATEFUL_DOMAINS="${{RAILWAY_PUBLIC_DOMAIN}},localhost,localhost:8100,capacitor://localhost,ionic://localhost"

BCRYPT_ROUNDS=12
```

### 4.2 Ou via CLI (alternative)
```powershell
railway variables set APP_NAME=Cabsul
railway variables set APP_ENV=production
railway variables set APP_DEBUG=false
railway variables set APP_KEY="base64:VOTRE_CLE"
railway variables set LOG_CHANNEL=stderr
railway variables set CACHE_DRIVER=file
railway variables set SESSION_DRIVER=file
railway variables set QUEUE_CONNECTION=sync
```

---

## 🚀 ÉTAPE 5 : Déployer

### 5.1 Lier le service
```powershell
railway link
```

### 5.2 Déployer le code
```powershell
railway up
```

> ⏳ Attendez 2-5 minutes que le build soit terminé.

---

## 🗄️ ÉTAPE 6 : Exécuter les migrations

```powershell
railway run php artisan migrate --force
```

### 6.1 (Optionnel) Exécuter les seeders
```powershell
railway run php artisan db:seed --force
```

### 6.2 Créer le lien storage
```powershell
railway run php artisan storage:link
```

---

## ✅ ÉTAPE 7 : Vérification finale

### 7.1 Obtenir l'URL publique
```powershell
railway domain
```
> Exemple : `cabsul-backend-production.up.railway.app`

### 7.2 Tester l'API
Ouvrez dans votre navigateur :
```
https://VOTRE-DOMAINE.up.railway.app/api/test
```

Vous devriez voir :
```json
{"message": "API is working", "timestamp": "2024-..."}
```

### 7.3 Tester le login (via curl ou Postman)
```powershell
curl -X POST https://VOTRE-DOMAINE.up.railway.app/api/login -H "Content-Type: application/json" -d '{"email":"test@gmail.com","password":"12345678"}'
```

---

## 🔄 ÉTAPE 8 : Mettre à jour le Frontend Ionic

Dans votre projet Ionic, modifiez `src/environments/environment.prod.ts` :

```typescript
export const URL_BASE = 'https://VOTRE-DOMAINE.up.railway.app/api/';
```

---

## 🆘 Dépannage

### Voir les logs en temps réel
```powershell
railway logs
```

### Redéployer après modification
```powershell
railway up
```

### Vider le cache sur Railway
```powershell
railway run php artisan config:cache
railway run php artisan route:cache
```

---

## 📋 Récapitulatif des commandes

```powershell
# Installation
npm install -g @railway/cli
railway login

# Initialisation
cd C:\Users\hp\Downloads\ionic_project_byAyman\cabsul_back\cabsul
railway init
railway add  # Sélectionner MySQL

# Déploiement
railway link
railway up

# Post-déploiement
railway run php artisan migrate --force
railway run php artisan storage:link
railway domain

# Monitoring
railway logs
```

