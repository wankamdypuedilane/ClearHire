# ClearHire

Landing page avec liste d'attente pour ClearHire — la plateforme de recrutement transparent pour candidats et entreprises.

## Stack

- **Front** : HTML / CSS / JS vanilla
- **Serverless** : Node.js 22 (Vercel Functions)
- **Emails** : Brevo API v3
- **Déploiement** : Vercel

## Structure

```
clearhire/
├── clearhire.html       # Landing page
├── api/
│   └── subscribe.js     # Endpoint POST /api/subscribe
├── vercel.json          # Config Vercel (rewrite / → clearhire.html)
├── package.json
├── .env.example         # Variables requises (sans valeurs réelles)
└── .gitignore
```

## Démarrage local

```bash
# 1. Installer Vercel CLI
npm install -g vercel

# 2. Copier les variables d'environnement
cp .env.example .env.local
# Remplir .env.local avec les vraies valeurs

# 3. Lancer le serveur local
vercel dev
# → http://localhost:3000
```

## Variables d'environnement

| Variable | Description |
|---|---|
| `BREVO_API_KEY` | Clé API Brevo (Paramètres → SMTP & API → Clés API) |
| `BREVO_LIST_ID` | ID numérique de la liste de contacts Brevo |

À ajouter dans le dashboard Vercel : **Project Settings → Environment Variables**

## Déploiement

```bash
# Production
vercel --prod
```

Le projet est connecté à GitHub — chaque `git push` sur `main` déclenche un déploiement automatique.

## Fonctionnement

1. L'utilisateur entre son email et choisit son profil (candidat / entreprise)
2. Le front appelle `POST /api/subscribe`
3. La fonction serverless ajoute le contact à la liste Brevo avec l'attribut `PROFIL`
4. Brevo stocke l'email et le type de profil pour la campagne de lancement
