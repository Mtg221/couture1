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
        // passwordHash sera hashé par le hook pre-save du modèle User
        user = await User.create({
          username: email,
          passwordHash: password,
          role: 'client',
          clientId: clientData._id,
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
      { expiresIn: '8h' }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      refreshToken,
      role: user.role,
      username: user.username,
      clientId: clientData?._id,
      client: clientData
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: 'Refresh token manquant' });
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
    const token = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    res.json({ token });
  } catch {
    res.status(401).json({ message: 'Refresh token invalide ou expiré' });
  }
});

router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (user.role === 'client' && user.clientId) {
      const client = await Client.findById(user.clientId).select('-passwordHash');
      res.json({ ...user.toObject(), client });
    } else {
      res.json(user);
    }
  } catch (err) {
    console.error('Auth me error:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;