const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

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