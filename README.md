# Couture Manager — Gestion d'atelier de couture

Application web fullstack de gestion pour un atelier de couture : clients, commandes, employés, paiements et rapports.

**Stack :** React + Vite | Node.js + Express | MongoDB + Mongoose | JWT Auth

---

## Fonctionnalités

- Gestion des **clients** (ajout, suivi, historique)
- Gestion des **commandes** (création, statuts, suivi)
- Gestion des **employés** (profils, affectations)
- **Galerie** de modèles et réalisations
- **Paiements** et suivi financier
- **Rapports** et statistiques
- **Messagerie** interne
- Dashboard admin

---

## Structure

```
couture1/
├── backend/
│   ├── models/    ← Client, Commande, Employe, Galerie, Message, Paiement, User
│   ├── routes/    ← auth, clients, commandes, employes, galerie, messages, paiements, rapports, dashboard
│   └── middleware/
└── frontend/
```

---

## Démarrage rapide

```bash
# Backend
cd backend && npm install
cp .env.example .env
npm start

# Frontend
cd frontend && npm install
npm run dev
```

**`backend/.env`**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/couture
JWT_SECRET=your_secret
CLIENT_URL=http://localhost:3000
```

---

## Déploiement

- Backend → [Render](https://render.com) (`render.yaml` inclus)
- Frontend → [Vercel](https://vercel.com)

---

## License

MIT
