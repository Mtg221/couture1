const router  = require('express').Router();
const Galerie = require('../models/Galerie');
const upload  = require('../middleware/upload');
const { protect, adminOnly } = require('../middleware/auth');

// Public
router.get('/', async (req, res) => {
  const { categorie } = req.query;
  const query = { visible: true };
  if (categorie) query.categorie = categorie;
  const items = await Galerie.find(query).sort({ createdAt: -1 });
  res.json(items);
});

// Admin
router.post('/', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const item = await Galerie.create({
      ...req.body,
      imageUrl:  req.file.path,
      publicId:  req.file.filename,
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: "Erreur lors du traitement" });
  }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  const item = await Galerie.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(item);
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  await Galerie.findByIdAndDelete(req.params.id);
  res.json({ message: 'Photo supprimée' });
});

module.exports = router;