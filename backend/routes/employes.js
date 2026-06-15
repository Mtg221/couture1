const router = require('express').Router();
const Employe = require('../models/Employe');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect);

router.get('/', async (req, res) => {
  const { search } = req.query;
  const query = search
    ? { $or: [{ nom: new RegExp(search, 'i') }, { telephone: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }] }
    : {};
  const employes = await Employe.find(query).sort({ createdAt: -1 });
  res.json(employes);
});

router.get('/:id', async (req, res) => {
  const employe = await Employe.findById(req.params.id);
  if (!employe) return res.status(404).json({ message: 'Employé introuvable' });
  res.json(employe);
});

router.post('/', adminOnly, async (req, res) => {
  try {
    const { nom, telephone, email, poste, adresse } = req.body;
    
    if (!nom || !telephone) {
      return res.status(400).json({ message: 'Nom et téléphone requis' });
    }
    
    const existingEmploye = await Employe.findOne({ telephone });
    if (existingEmploye) {
      return res.status(400).json({ message: 'Un employé avec ce téléphone existe déjà' });
    }
    
    const employe = await Employe.create({
      nom,
      telephone,
      email: email || null,
      poste: poste || null,
      adresse: adresse || null,
    });
    
    res.status(201).json(employe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', adminOnly, async (req, res) => {
  try {
    const { nom, telephone, email, poste, adresse } = req.body;
    
    const updateData = {
      nom,
      telephone,
      email: email || null,
      poste: poste || null,
      adresse: adresse || null,
    };
    
    const existingEmploye = await Employe.findOne({ telephone, _id: { $ne: req.params.id } });
    if (existingEmploye) {
      return res.status(400).json({ message: 'Un employé avec ce téléphone existe déjà' });
    }
    
    const employe = await Employe.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(employe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', adminOnly, async (req, res) => {
  await Employe.findByIdAndDelete(req.params.id);
  res.json({ message: 'Employé supprimé' });
});

module.exports = router;