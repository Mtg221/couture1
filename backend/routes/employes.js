const router = require('express').Router();
const Employe = require('../models/Employe');
const { protect, adminOnly, staffOnly } = require('../middleware/auth');
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

router.use(protect);

router.get('/', staffOnly, async (req, res) => {
  try {
    const { search } = req.query;
    const query = search
      ? { $or: [{ nom: new RegExp(escapeRegex(search), 'i') }, { telephone: new RegExp(escapeRegex(search), 'i') }, { email: new RegExp(escapeRegex(search), 'i') }] }
      : {};
    const employes = await Employe.find(query).sort({ createdAt: -1 });
    res.json(employes);
  } catch (err) {
    console.error('Employes GET error:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.get('/:id', staffOnly, async (req, res) => {
  try {
    const employe = await Employe.findById(req.params.id);
    if (!employe) return res.status(404).json({ message: 'Employé introuvable' });
    res.json(employe);
  } catch (err) {
    console.error('Employe GET by ID error:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
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
    console.error('Employe POST error:', err);
    res.status(500).json({ message: 'Erreur serveur' });
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
    console.error('Employe PUT error:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.delete('/:id', adminOnly, async (req, res) => {
  try {
    await Employe.findByIdAndDelete(req.params.id);
    res.json({ message: 'Employé supprimé' });
  } catch (err) {
    console.error('Employe DELETE error:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;