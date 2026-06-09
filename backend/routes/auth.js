const router = require('express').Router();
const jwt    = require('jsonwebtoken');
const User   = require('../models/User');
const { protect } = require('../middleware/auth');

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await user.checkPassword(password)))
      return res.status(401).json({ message: 'Identifiants incorrects' });

    const token = jwt.sign(
      { id: user._id, role: user.role, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token, role: user.role, username: user.username });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/me', protect, async (req, res) => {
  const user = await User.findById(req.user.id).select('-passwordHash');
  res.json(user);
});

// Seed admin (à supprimer après la première utilisation)
router.post('/seed', async (req, res) => {
  const exists = await User.findOne({ username: 'admin' });
  if (exists) return res.json({ message: 'Admin existe déjà' });
  const user = new User({ username: 'admin', passwordHash: 'admin123', role: 'admin' });
  await user.save();
  res.json({ message: 'Admin créé: admin / admin123' });
});

module.exports = router;