# OUISSAS QUALITÉ — version simplifiée (Module 1)

Un seul projet, une seule installation. Pas de serveur de base de données à
installer : la base est un simple fichier (`prisma/dev.db`) créé automatiquement.

## Installation (deux commandes)

Prérequis : Node.js 18+ installé (vérifiez avec `node -v`).

```bash
npm install
npm run dev
```

C'est tout. La commande `npm install` crée aussi la base de données
automatiquement (fichier `prisma/dev.db`). Aucun `.env` à configurer pour
démarrer en local.

Ouvrez ensuite **http://localhost:3000** dans votre navigateur.

Cliquez sur "Créer mon entreprise", remplissez le formulaire : cela crée
votre entreprise et votre compte administrateur, et vous connecte directement.

## Ce qui est réellement fonctionnel

- Inscription = création d'une entreprise (tenant) + compte ADMIN
- Connexion (JWT)
- Isolation multi-tenant vérifiée côté serveur sur chaque requête
- Gestion des utilisateurs (`/api/users`), protégée par rôle
- Mots de passe hashés (bcrypt)

## Structure du projet

```
app/
  login/page.tsx        → écran de connexion/inscription
  dashboard/page.tsx     → tableau de bord (Module 1)
  api/
    auth/register/       → POST : créer une entreprise + admin
    auth/login/           → POST : se connecter
    company/me/           → GET/PATCH : profil de l'entreprise
    users/                → GET/POST : utilisateurs
lib/
  prisma.ts              → connexion base de données
  auth.ts                → mots de passe, JWT, vérification des rôles
  api.ts                 → client utilisé par les pages
prisma/
  schema.prisma          → modèle de données (Company, User, Site, Process)
```

## Prochaine étape

On ajoute les modules un par un (mêmes deux commandes à chaque fois pour
tester) : Processus & Cartographie, Diagnostic ISO 9001, Documents, Audits,
Non-conformités & CAPA, Risques, etc. — en réutilisant cette même base.

## Note sécurité

Pour un usage au-delà de votre poste (déploiement en ligne), définissez une
vraie variable d'environnement `JWT_SECRET` (actuellement une valeur par
défaut est utilisée pour simplifier le démarrage en local).
