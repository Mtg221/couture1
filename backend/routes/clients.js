const router = require('express').Router();
const Client = require('../models/Client');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', async (req, res) => {
  const { search } = req.query;
  const query = search
    ? { $or: [{ nom: new RegExp(search, 'i') }, { telephone: new RegExp(search, 'i') }] }
    : {};
  const clients = await Client.find(query).sort({ createdAt: -1 });
  res.json(clients);
});

router.get('/:id', async (req, res) => {
  const client = await Client.findById(req.params.id);
  if (!client) return res.status(404).json({ message: 'Client introuvable' });
  res.json(client);
});

router.post('/', async (req, res) => {
  try {
    const client = await Client.create(req.body);
    res.status(201).json(client);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(client);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  await Client.findByIdAndDelete(req.params.id);
  res.json({ message: 'Client supprimé' });
});

module.exports = router;