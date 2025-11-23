# Application de Gestion de Notes (Exercice 4.1)

Application full-stack de gestion de notes développée avec la stack MERN (MongoDB, Express, React, Node.js).

## Fonctionnalités

### Backend
- Authentification JWT sécurisée
- CRUD complet pour les notes
- Catégories de notes (Travail, Personnel, Urgent)
- Recherche et filtres avancés
- Upload de fichiers
- Documentation API Swagger (`/api/docs`)

### Frontend
- Interface moderne et responsive (React + Vite)
- Éditeur de texte riche (TinyMCE)
- Gestion des catégories avec codes couleurs
- Recherche en temps réel
- Mode Sombre / Clair
- Statistiques par catégorie

### DevOps
- Docker & Docker Compose pour un déploiement facile
- CI/CD avec GitHub Actions (Tests, Lint, Build)

## Prérequis

- Docker & Docker Compose
- Node.js 18+ (si exécution locale sans Docker)

## Installation et Lancement

### Via Docker (Recommandé)

1. Cloner le dépôt
2. Lancer l'application :
   ```bash
   docker-compose up --build
   ```
3. Accéder à l'application :
   - Frontend : http://localhost:5173
   - Backend API : http://localhost:3000
   - Swagger Docs : http://localhost:3000/api/docs

### Installation Manuelle

#### Backend
```bash
cd backend
npm install
# Créer un fichier .env basé sur .env.example (ou utiliser les défauts)
npm start
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Tests

Pour lancer les tests backend :
```bash
cd backend
npm test
```

## Structure du Projet

- `backend/` : API Node.js/Express
- `frontend/` : Application React
- `.github/` : Workflows CI/CD
- `docker-compose.yml` : Orchestration des conteneurs
