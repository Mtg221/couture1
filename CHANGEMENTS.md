# Résumé des modifications

## Changements principaux

### 1. Authentification unifiée
- **Nouvelle page de login** (`/login`) pour admin et client
- Login par **email + mot de passe**
- Redirection automatique selon le rôle:
  - Admin → `/admin`
  - Client → `/client/dashboard`

### 2. Gestion des clients
- **Modèle Client modifié** pour inclure:
  - Email (unique, requis)
  - Mot de passe (hashé avec bcrypt)
  
- **L'admin peut créer des clients** avec:
  - Nom, téléphone, email, mot de passe
  - Sexe, notes
  - Les mesures sont prises par l'admin uniquement

### 3. Espace client
- **Nouveau dashboard client** (`/client/dashboard`) avec:
  - Informations personnelles
  - Résumé des commandes (statistiques)
  - **Mesures** (homme/femme selon le sexe)
  - **Historique des commandes** avec statut
  - Détails: prix, avance, reste à payer, date de livraison

### 4. Commandes publiques
- **Formulaire simplifié** (plus de mesures à prendre par le client)
- Le client fournit seulement:
  - Nom, téléphone
  - Type de vêtement, description
  - Photos d'inspiration (optionnel)
- Message d'information: "Nous vous contacterons pour prendre vos mesures"

### 5. Routes et sécurité
- Middleware amélioré avec `clientOnly`
- Les clients ne peuvent voir que leurs propres commandes
- Protection des routes privées selon le rôle

## Fichiers modifiés/créés

### Backend
- `backend/models/Client.js` - Ajout email + password
- `backend/models/User.js` - Ajout rôle 'client'
- `backend/routes/auth.js` - Login unifié
- `backend/routes/clients.js` - CRUD avec email/password
- `backend/routes/commandes.js` - Filtrage par rôle
- `backend/middleware/auth.js` - Ajout clientOnly

### Frontend
- `frontend/src/pages/Login.jsx` - NOUVEAU (login unifié)
- `frontend/src/pages/client/Dashboard.jsx` - NOUVEAU (espace client)
- `frontend/src/pages/public/Commande.jsx` - Simplifié (sans mesures)
- `frontend/src/pages/admin/Clients.jsx` - Ajout email/password
- `frontend/src/pages/admin/ClientDetail.jsx` - Gestion email/password
- `frontend/src/App.jsx` - Nouvelles routes
- `frontend/src/context/AuthContext.jsx` - Login par email
- `frontend/src/components/PrivateRoute.jsx` - Gestion des rôles
- `frontend/src/components/Navbar.jsx` - Lien vers /login

## Utilisation

### Pour l'admin
1. Se connecter sur `/login` avec `admin@admin.com` / mot de passe
2. Créer des clients dans `/admin/clients`
3. Consulter/modifier les mesures des clients
4. Suivre les commandes

### Pour le client
1. Se connecter sur `/login` avec email/mot de passe (fournis par l'admin)
2. Accéder à `/client/dashboard`
3. Voir ses mesures et l'état de ses commandes

## Notes importantes
- Les clients existants doivent être mis à jour avec un email et mot de passe
- L'admin doit créer les comptes clients avec email + mot de passe
- Les mesures sont prises uniquement par l'admin, pas par les clients