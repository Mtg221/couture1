const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      process.env.CLIENT_URL,
      ...(process.env.CLIENT_URL ? [process.env.CLIENT_URL.replace('https://', '')] : []),
    ];
    
    if (!origin || allowedOrigins.some(o => origin === o || origin.endsWith('.vercel.app') || origin.endsWith(o))) {
      callback(null, true);
    } else {
      console.warn('CORS blocked:', origin);
      callback(null, false);
    }
  },
  credentials: true
}));

// Routes
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/clients',   require('./routes/clients'));
app.use('/api/commandes', require('./routes/commandes'));
app.use('/api/paiements', require('./routes/paiements'));
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