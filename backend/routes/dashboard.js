const router   = require('express').Router();
const Client   = require('../models/Client');
const Commande = require('../models/Commande');
const Paiement = require('../models/Paiement');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, adminOnly, async (req, res) => {
  const [
    totalClients,
    totalCommandes,
    commandesEnCours,
    commandesTerminees,
    paiements,
    commandesRecentes,
  ] = await Promise.all([
    Client.countDocuments(),
    Commande.countDocuments(),
    Commande.countDocuments({ statut: { $in: ['en_attente', 'en_cours'] } }),
    Commande.countDocuments({ statut: { $in: ['prete', 'livree'] } }),
    Paiement.aggregate([{ $group: { _id: null, total: { $sum: '$montant' } } }]),
    Commande.find().populate('client', 'nom').sort({ createdAt: -1 }).limit(5),
  ]);

  res.json({
    totalClients,
    totalCommandes,
    commandesEnCours,
    commandesTerminees,
    chiffreAffaires: paiements[0]?.total || 0,
    commandesRecentes,
  });
});

module.exports = router;