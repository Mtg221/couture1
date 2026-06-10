const router = require('express').Router();
const jwt    = require('jsonwebtoken');
const User   = require('../models/User');
const Client = require('../models/Client');
const { protect } = require('../middleware/auth');

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    let user = await User.findOne({ username: email });
    let clientData = null;
    
    if (!user) {
      clientData = await Client.findOne({ email });
      if (!clientData || !(await clientData.checkPassword(password))) {
        return res.status(401).json({ message: 'Identifiants incorrects' });
      }
      
      user = await User.findOne({ clientId: clientData._id });
      if (!user) {
        user = await User.create({
          username: email,
          passwordHash: password,
          role: 'client',
          clientId: clientData._id
        });
      }
    } else {
      if (!(await user.checkPassword(password))) {
        return res.status(401).json({ message: 'Identifiants incorrects' });
      }
      if (user.role === 'client') {
        clientData = await Client.findById(user.clientId);
      }
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, username: user.username, clientId: clientData?._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({ 
      token, 
      role: user.role, 
      username: user.username,
      clientId: clientData?._id,
      client: clientData 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/me', protect, async (req, res) => {
  const user = await User.findById(req.user.id).select('-passwordHash');
  if (user.role === 'client' && user.clientId) {
    const client = await Client.findById(user.clientId).select('-passwordHash');
    res.json({ ...user.toObject(), client });
  } else {
    res.json(user);
  }
});

router.post('/seed', async (req, res) => {
  const exists = await User.findOne({ username: 'admin' });
  if (exists) return res.json({ message: 'Admin existe déjà' });
  const user = new User({ username: 'admin', passwordHash: 'admin123', role: 'admin' });
  await user.save();
  res.json({ message: 'Admin créé: admin / admin123' });
});

module.exports = router;