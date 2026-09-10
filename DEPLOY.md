# Déployer OUISSAS QUALITÉ en ligne — sans terminal

Tout se fait dans le navigateur, via trois services gratuits : **GitHub**
(pour héberger le code), **Neon** (pour la base de données) et **Vercel**
(pour faire tourner l'application). Suivez les étapes dans l'ordre.

## 1. Créer un compte GitHub

Allez sur github.com → "Sign up" → créez un compte gratuit.

## 2. Créer un nouveau dépôt (repository)

1. Cliquez sur le "+" en haut à droite → "New repository"
2. Nom : `ouissas-qualite`
3. Laissez "Public" ou "Private" (les deux fonctionnent)
4. Cliquez "Create repository"

## 3. Envoyer les fichiers du projet

Sur la page du dépôt tout juste créé :

1. Cliquez sur "uploading an existing file" (ou "Add file" → "Upload files")
2. Glissez-déposez **tout le contenu du dossier** `ouissas-qualite-hosted`
   (tous les fichiers et dossiers à l'intérieur — pas le dossier lui-même)
3. En bas de page, cliquez "Commit changes"

## 4. Créer une base de données gratuite sur Neon

1. Allez sur neon.tech → créez un compte gratuit
2. Cliquez "Create a project", donnez-lui un nom (ex. `ouissas-qualite`)
3. Une fois créé, Neon affiche une chaîne de connexion qui commence par
   `postgresql://...` → cliquez pour la copier. **Gardez-la de côté**,
   vous en aurez besoin à l'étape 6.

## 5. Créer un compte Vercel et importer le projet

1. Allez sur vercel.com → "Sign up" → choisissez "Continue with GitHub"
   (ça relie directement vos deux comptes)
2. Une fois connecté, cliquez "Add New" → "Project"
3. Trouvez `ouissas-qualite` dans la liste de vos dépôts GitHub → "Import"

## 6. Configurer les variables d'environnement

Avant de cliquer sur "Deploy", dépliez la section "Environment Variables"
et ajoutez ces deux lignes :

| Name | Value |
|---|---|
| `DATABASE_URL` | la chaîne de connexion copiée depuis Neon à l'étape 4 |
| `JWT_SECRET` | une phrase aléatoire quelconque, ex. `ouissas-2026-secret-xyz` |

## 7. Déployer

Cliquez sur "Deploy". Vercel installe tout, crée les tables dans votre
base Neon, et met l'application en ligne — comptez 1 à 2 minutes.

Une fois terminé, Vercel affiche un lien du type
`https://ouissas-qualite-xxxx.vercel.app` — c'est votre application, en
ligne, accessible depuis n'importe quel navigateur.

## Pour la suite

Chaque fois qu'on ajoutera un nouveau module, il suffira de mettre à jour
les fichiers sur GitHub (glisser-déposer les nouveaux fichiers, "Commit
changes") — Vercel redéploie automatiquement, sans aucune autre action de
votre part.
