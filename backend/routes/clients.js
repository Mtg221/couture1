const router = require('express').Router();
const Client = require('../models/Client');
const User   = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

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
  const client = await Client.findById(req.params.id).select('-passwordHash');
  if (!client) return res.status(404).json({ message: 'Client introuvable' });
  res.json(client);
});

router.post('/', adminOnly, async (req, res) => {
  try {
    const { email, password, ...clientData } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }
    
    const existingClient = await Client.findOne({ email });
    if (existingClient) {
      return res.status(400).json({ message: 'Un client avec cet email existe déjà' });
    }
    
    const client = await Client.create({
      ...clientData,
      email,
      passwordHash: password,
    });
    
    await User.create({
      username: email,
      passwordHash: password,
      role: 'client',
      clientId: client._id,
    });
    
    res.status(201).json(client);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', adminOnly, async (req, res) => {
  try {
    const { email, password, ...clientData } = req.body;
    
    const updateData = { ...clientData };
    
    if (email) {
      const existingClient = await Client.findOne({ email, _id: { $ne: req.params.id } });
      if (existingClient) {
        return res.status(400).json({ message: 'Un client avec cet email existe déjà' });
      }
      updateData.email = email;
    }
    
    if (password) {
      updateData.passwordHash = password;
      const user = await User.findOne({ clientId: req.params.id });
      if (user) {
        user.passwordHash = password;
        await user.save();
      }
    }
    
    const client = await Client.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-passwordHash');
    res.json(client);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', adminOnly, async (req, res) => {
  await Client.findByIdAndDelete(req.params.id);
  await User.deleteMany({ clientId: req.params.id });
  res.json({ message: 'Client supprimé' });
});

module.exports = router;