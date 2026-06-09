const router  = require('express').Router();
const Message = require('../models/Message');
const { protect } = require('../middleware/auth');

// Public — formulaire de contact
router.post('/', async (req, res) => {
  try {
    const msg = await Message.create(req.body);
    res.status(201).json({ message: 'Message envoyé' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin
router.get('/', protect, async (req, res) => {
  const messages = await Message.find().sort({ createdAt: -1 });
  res.json(messages);
});

router.put('/:id/lu', protect, async (req, res) => {
  await Message.findByIdAndUpdate(req.params.id, { lu: true });
  res.json({ message: 'Marqué comme lu' });
});

module.exports = router;