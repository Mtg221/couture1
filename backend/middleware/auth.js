const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Non autorisé' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Token invalide' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin')
    return res.status(403).json({ message: 'Accès réservé à l\'admin' });
  next();
};

const clientOnly = (req, res, next) => {
  if (req.user.role !== 'client')
    return res.status(403).json({ message: 'Accès réservé aux clients' });
  next();
};

module.exports = { protect, adminOnly, clientOnly };