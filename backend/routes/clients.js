const router = require('express').Router();
const Client = require('../models/Client');
const User   = require('../models/User');
const { protect, adminOnly, staffOnly } = require('../middleware/auth');

router.use(protect);

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

router.get('/', staffOnly, async (req, res) => {
  try {
    const { search } = req.query;
    const query = search
      ? { $or: [{ nom: new RegExp(escapeRegex(search), 'i') }, { telephone: new RegExp(escapeRegex(search), 'i') }] }
      : {};
    const clients = await Client.find(query).sort({ createdAt: -1 });
    res.json(clients);
  } catch (err) {
    console.error('Clients GET error:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    if (req.user.role === 'client' && req.params.id !== req.user.clientId) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }
    const client = await Client.findById(req.params.id).select('-passwordHash');
    if (!client) return res.status(404).json({ message: 'Client introuvable' });
    res.json(client);
  } catch (err) {
    console.error('Client GET by ID error:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
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
    console.error('Client POST error:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.put('/:id', adminOnly, async (req, res) => {
  try {
    const { email, password, mesuresHomme, mesuresFemme, ...clientData } = req.body;
    
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
    
    const updateOps = { $set: updateData };
    if (mesuresHomme) updateOps.$set['mesuresHomme'] = mesuresHomme;
    if (mesuresFemme) updateOps.$set['mesuresFemme'] = mesuresFemme;
    
    const client = await Client.findByIdAndUpdate(req.params.id, updateOps, { new: true }).select('-passwordHash');
    res.json(client);
  } catch (err) {
    console.error('Client PUT error:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.delete('/:id', adminOnly, async (req, res) => {
  try {
    await Client.findByIdAndDelete(req.params.id);
    await User.deleteMany({ clientId: req.params.id });
    res.json({ message: 'Client supprimé' });
  } catch (err) {
    console.error('Client DELETE error:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;