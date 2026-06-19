const router  = require('express').Router();
const Message = require('../models/Message');
const { protect, staffOnly } = require('../middleware/auth');

// Public — formulaire de contact
router.post('/', async (req, res) => {
  try {
    const msg = await Message.create(req.body);
    res.status(201).json({ message: 'Message envoyé' });
  } catch (err) {
    console.error('Message POST error:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Admin
router.get('/', staffOnly, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    console.error('Messages GET error:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.put('/:id/lu', staffOnly, async (req, res) => {
  try {
    await Message.findByIdAndUpdate(req.params.id, { lu: true });
    res.json({ message: 'Marqué comme lu' });
  } catch (err) {
    console.error('Message PUT error:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;