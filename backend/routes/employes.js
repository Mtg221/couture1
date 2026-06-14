const router = require('express').Router();
const Employe = require('../models/Employe');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);

router.get('/', async (req, res) => {
  const employes = await Employe.find().sort({ createdAt: -1 });
  res.json(employes);
});

router.post('/', async (req, res) => {
  try {
    const { nom, telephone } = req.body;
    
    if (!nom || !telephone) {
      return res.status(400).json({ message: 'Nom et téléphone requis' });
    }
    
    const existingEmploye = await Employe.findOne({ telephone });
    if (existingEmploye) {
      return res.status(400).json({ message: 'Un employé avec ce numéro existe déjà' });
    }
    
    const employe = await Employe.create({ nom, telephone });
    res.status(201).json(employe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { nom, telephone } = req.body;
    
    const updateData = {};
    if (nom) updateData.nom = nom;
    if (telephone) {
      const existingEmploye = await Employe.findOne({ telephone, _id: { $ne: req.params.id } });
      if (existingEmploye) {
        return res.status(400).json({ message: 'Un employé avec ce numéro existe déjà' });
      }
      updateData.telephone = telephone;
    }
    
    const employe = await Employe.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true });
    res.json(employe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  await Employe.findByIdAndDelete(req.params.id);
  res.json({ message: 'Employé supprimé' });
});

module.exports = router;