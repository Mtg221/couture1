const router   = require('express').Router();
const Paiement = require('../models/Paiement');
const Commande = require('../models/Commande');
const { protect, adminOnly } = require('../middleware/auth');

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
  const paiements = await Paiement.find({ commande: req.params.commandeId })
    .populate('client', 'nom telephone')
    .populate('employe', 'nom telephone poste')
    .sort({ createdAt: -1 });
  res.json(paiements);
});

router.get('/client/:clientId', async (req, res) => {
  if (req.user.role === 'client' && req.params.clientId !== req.user.clientId) {
    return res.status(403).json({ message: 'Accès non autorisé' });
  }
  
  const paiements = await Paiement.find({ client: req.params.clientId })
    .populate('commande', 'typeVetement statut')
    .populate('employe', 'nom telephone poste')
    .sort({ createdAt: -1 });
  res.json(paiements);
});

router.get('/employe/:employeId', adminOnly, async (req, res) => {
  const paiements = await Paiement.find({ employe: req.params.employeId })
    .populate('commande', 'typeVetement')
    .populate('client', 'nom telephone')
    .sort({ createdAt: -1 });
  res.json(paiements);
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
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', adminOnly, async (req, res) => {
  const paiement = await Paiement.findById(req.params.id);
  if (paiement) {
    await Commande.findByIdAndUpdate(
      paiement.commande,
      { $inc: { avancePaye: -paiement.montant } }
    );
    await paiement.deleteOne();
  }
  res.json({ message: 'Paiement supprimé' });
});

module.exports = router;