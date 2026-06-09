const router   = require('express').Router();
const Commande = require('../models/Commande');
const Client   = require('../models/Client');
const upload   = require('../middleware/upload');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect);

router.get('/', async (req, res) => {
  const { statut, clientId } = req.query;
  const query = {};
  if (statut)   query.statut   = statut;
  if (clientId) query.client   = clientId;
  const commandes = await Commande.find(query)
    .populate('client', 'nom telephone')
    .sort({ createdAt: -1 });
  res.json(commandes);
});

router.get('/:id', async (req, res) => {
  const commande = await Commande.findById(req.params.id)
    .populate('client');
  if (!commande) return res.status(404).json({ message: 'Commande introuvable' });
  res.json(commande);
});

router.get('/client/:clientId', async (req, res) => {
  const commandes = await Commande.find({ client: req.params.clientId })
    .sort({ createdAt: -1 });
  res.json(commandes);
});

// Commande depuis le site public (pas besoin d'auth)
router.post('/public', upload.array('images', 5), async (req, res) => {
  try {
    const { nom, telephone, typeVetement, description, ...mesures } = req.body;
    let client = await Client.findOne({ telephone });
    if (!client) client = await Client.create({ nom, telephone });

    const images = req.files?.map(f => f.path) || [];
    const commande = await Commande.create({
      client: client._id,
      typeVetement,
      description,
      mesures,
      images,
      sourceCommande: 'public',
    });
    res.status(201).json({ message: 'Commande reçue', id: commande._id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/', upload.array('images', 5), async (req, res) => {
  try {
    const images = req.files?.map(f => f.path) || [];
    const commande = await Commande.create({ ...req.body, images });
    res.status(201).json(commande);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', upload.array('images', 5), async (req, res) => {
  try {
    const commande = await Commande.findById(req.params.id);
    if (!commande) return res.status(404).json({ message: 'Introuvable' });

    if (req.body.statut && req.body.statut !== commande.statut) {
      commande.historiqueStatut.push({ statut: req.body.statut, note: req.body.note });
      commande.statut = req.body.statut;
    }
    const newImages = req.files?.map(f => f.path) || [];
    Object.assign(commande, req.body);
    if (newImages.length) commande.images = [...commande.images, ...newImages];
    await commande.save();
    res.json(commande);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', adminOnly, async (req, res) => {
  await Commande.findByIdAndDelete(req.params.id);
  res.json({ message: 'Commande supprimée' });
});

module.exports = router;