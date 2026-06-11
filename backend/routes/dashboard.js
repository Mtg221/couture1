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

router.get('/recapitulatif', protect, adminOnly, async (req, res) => {
  try {
    const { dateDebut, dateFin } = req.query;
    
    if (!dateDebut || !dateFin) {
      return res.status(400).json({ message: 'Les paramètres dateDebut et dateFin sont requis' });
    }
    
    const start = new Date(dateDebut);
    const end = new Date(dateFin);
    end.setHours(23, 59, 59, 999);
    
    const commandes = await Commande.find({
      createdAt: { $gte: start, $lte: end }
    }).populate('client', 'nom telephone');
    
    const recap = {
      totalCommandes: commandes.length,
      parStatut: {
        en_attente: commandes.filter(c => c.statut === 'en_attente').length,
        en_cours: commandes.filter(c => c.statut === 'en_cours').length,
        prete: commandes.filter(c => c.statut === 'prete').length,
        livree: commandes.filter(c => c.statut === 'livree').length,
        refusee: commandes.filter(c => c.statut === 'refusee').length,
      },
      totalRecettes: commandes.reduce((sum, c) => sum + (c.prixTotal || 0), 0),
      totalAvances: commandes.reduce((sum, c) => sum + (c.avancePaye || 0), 0),
      resteARecevoir: commandes.reduce((sum, c) => sum + ((c.prixTotal || 0) - (c.avancePaye || 0)), 0),
      commandes,
    };
    
    res.json(recap);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/recettes', protect, adminOnly, async (req, res) => {
  try {
    const { dateDebut, dateFin } = req.query;
    
    if (!dateDebut || !dateFin) {
      return res.status(400).json({ message: 'Les paramètres dateDebut et dateFin sont requis' });
    }
    
    const start = new Date(dateDebut);
    const end = new Date(dateFin);
    end.setHours(23, 59, 59, 999);
    
    const paiements = await Paiement.find({
      createdAt: { $gte: start, $lte: end }
    }).populate('commande', 'typeVetement client');
    
    const recettesParMode = {};
    let totalGeneral = 0;
    
    paiements.forEach(p => {
      const mode = p.mode || 'autre';
      if (!recettesParMode[mode]) recettesParMode[mode] = 0;
      recettesParMode[mode] += p.montant || 0;
      totalGeneral += p.montant || 0;
    });
    
    const recap = {
      totalGeneral,
      parMode: recettesParMode,
      nombrePaiements: paiements.length,
      paiements,
    };
    
    res.json(recap);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;