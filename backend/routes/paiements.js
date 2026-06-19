const router   = require('express').Router();
const Paiement = require('../models/Paiement');
const Commande = require('../models/Commande');
const { protect, adminOnly, staffOnly } = require('../middleware/auth');

router.use(protect);

router.get('/', adminOnly, async (req, res) => {
  const { clientId, commandeId, employeId } = req.query;
  const query = {};
  
  if (clientId) query.client = clientId;
  if (commandeId) query.commande = commandeId;
  if (employeId) query.employe = employeId;
  
  const paiements = await Paiement.find(query)
    .populate('commande', 'typeVetement')
    .populate('employe', 'nom telephone poste')
    .sort({ createdAt: -1 });
  res.json(paiements);
});

router.get('/commande/:commandeId', async (req, res) => {
  try {
    if (req.user.role === 'client') {
      const commande = await Commande.findById(req.params.commandeId);
      if (!commande || commande.client.toString() !== req.user.clientId) {
        return res.status(403).json({ message: 'Accès non autorisé' });
      }
    }
    const paiements = await Paiement.find({ commande: req.params.commandeId })
      .populate('client', 'nom telephone')
      .populate('employe', 'nom telephone poste')
      .sort({ createdAt: -1 });
    res.json(paiements);
  } catch (err) {
    console.error('Paiements GET by commande error:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.get('/client/:clientId', async (req, res) => {
  try {
    if (req.user.role === 'client' && req.params.clientId !== req.user.clientId) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }
    
    const paiements = await Paiement.find({ client: req.params.clientId })
      .populate('commande', 'typeVetement statut')
      .populate('employe', 'nom telephone poste')
      .sort({ createdAt: -1 });
    res.json(paiements);
  } catch (err) {
    console.error('Paiements GET by client error:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.get('/employe/:employeId', adminOnly, async (req, res) => {
  try {
    const paiements = await Paiement.find({ employe: req.params.employeId })
      .populate('commande', 'typeVetement')
      .populate('client', 'nom telephone')
      .sort({ createdAt: -1 });
    res.json(paiements);
  } catch (err) {
    console.error('Paiements GET by employe error:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.post('/', adminOnly, async (req, res) => {
  try {
    const { commande, montant, mode, note, employeId } = req.body;
    
    const commandeDoc = await Commande.findById(commande);
    if (!commandeDoc) {
      return res.status(404).json({ message: 'Commande introuvable' });
    }
    
    const paiement = await Paiement.create({
      commande,
      client: commandeDoc.client,
      montant,
      mode,
      note,
      employe: employeId || null,
    });
    
    await Commande.findByIdAndUpdate(
      commande,
      { $inc: { avancePaye: montant } }
    );
    
    res.status(201).json(paiement);
  } catch (err) {
    console.error('Paiement POST error:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.delete('/:id', adminOnly, async (req, res) => {
  try {
    const paiement = await Paiement.findById(req.params.id);
    if (paiement) {
      await Commande.findByIdAndUpdate(
        paiement.commande,
        { $inc: { avancePaye: -paiement.montant } }
      );
      await paiement.deleteOne();
    }
    res.json({ message: 'Paiement supprimé' });
  } catch (err) {
    console.error('Paiement DELETE error:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;