const router   = require('express').Router();
const Paiement = require('../models/Paiement');
const Commande = require('../models/Commande');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);

router.get('/commande/:commandeId', async (req, res) => {
  const paiements = await Paiement.find({ commande: req.params.commandeId }).sort({ createdAt: -1 });
  res.json(paiements);
});

router.post('/', async (req, res) => {
  try {
    const paiement = await Paiement.create(req.body);
    // Mettre à jour l'avance payée dans la commande
    await Commande.findByIdAndUpdate(
      req.body.commande,
      { $inc: { avancePaye: req.body.montant } }
    );
    res.status(201).json(paiement);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
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