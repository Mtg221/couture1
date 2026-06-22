const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connecté');

    const existingAdmin = await User.findOne({ username: 'nkg' });
    if (existingAdmin) {
      console.log('L\'admin nkg existe déjà');
      await mongoose.disconnect();
      return;
    }

    await User.create({
      username: 'nkg',
      passwordHash: '18safar',
      role: 'admin'
    });

    console.log('Admin nkg créé avec succès');
    await mongoose.disconnect();
  } catch (err) {
    console.error('Erreur:', err);
    process.exit(1);
  }
}

seedAdmin();