const router = require('express').Router();
const jwt    = require('jsonwebtoken');
const User   = require('../models/User');
const Client = require('../models/Client');
const { protect } = require('../middleware/auth');

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email et mot de passe requis' });

    let user = await User.findOne({ username: email });
    let clientData = null;

    if (!user) {
      clientData = await Client.findOne({ email });
      if (!clientData || !(await clientData.checkPassword(password)))
        return res.status(401).json({ message: 'Identifiants incorrects' });

      user = await User.findOne({ clientId: clientData._id });
      if (!user)
        return res.status(401).json({ message: 'Compte non activé. Contactez un administrateur.' });
    } else {
      if (!(await user.checkPassword(password)))
        return res.status(401).json({ message: 'Identifiants incorrects' });
      if (user.role === 'client')
        clientData = await Client.findById(user.clientId);
    }

    const jwtSecret        = process.env.JWT_SECRET;
    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

    if (!jwtSecret || !jwtRefreshSecret)
      throw new Error('Secrets JWT non configurés');

    const token = jwt.sign(
      { id: user._id, role: user.role, username: user.username, clientId: clientData?._id },
      jwtSecret,
      { expiresIn: '8h' }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      jwtRefreshSecret,
      { expiresIn: '7d' }
    );

    res.json({ token, refreshToken, role: user.role, username: user.username, clientId: clientData?._id, client: clientData });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: 'Refresh token manquant' });

  const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
  if (!jwtRefreshSecret)
    return res.status(500).json({ message: 'Configuration serveur invalide' });

  try {
    const decoded = jwt.verify(refreshToken, jwtRefreshSecret);
    const token = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token });
  } catch {
    res.status(401).json({ message: 'Refresh token invalide ou expiré' });
  }
});

router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    if (user.role === 'client' && user.clientId) {
      const client = await Client.findById(user.clientId).select('-passwordHash');
      return res.json({ ...user.toObject(), client });
    }
    res.json(user);
  } catch {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
