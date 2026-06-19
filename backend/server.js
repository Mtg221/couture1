const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

app.use(helmet());

const allowedOrigins = [
  'http://localhost:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn('CORS blocked:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Trop de tentatives, veuillez réessayer dans 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

const publicLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { message: 'Trop de requêtes, veuillez réessayer dans 1 minute' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/auth/login', apiLimiter);
app.use('/api/commandes/public', publicLimiter);
app.use('/api/messages', publicLimiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/clients',   require('./routes/clients'));
app.use('/api/commandes', require('./routes/commandes'));
app.use('/api/paiements', require('./routes/paiements'));
app.use('/api/employes',  require('./routes/employes'));
app.use('/api/rapports',  require('./routes/rapports'));
app.use('/api/galerie',   require('./routes/galerie'));
app.use('/api/messages',  require('./routes/messages'));
app.use('/api/dashboard', require('./routes/dashboard'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connecté');
    app.listen(process.env.PORT, () =>
      console.log(`Serveur sur port ${process.env.PORT}`)
    );
  })
  .catch(err => console.error(err));