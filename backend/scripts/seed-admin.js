const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connecté');

    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;

    if (!username || !password) {
      console.error('Erreur: ADMIN_USERNAME et ADMIN_PASSWORD doivent être définis dans .env');
      await mongoose.disconnect();
      process.exit(1);
    }

    const existingAdmin = await User.findOne({ username });
    if (existingAdmin) {
      console.log(`L'admin ${username} existe déjà`);
      await mongoose.disconnect();
      return;
    }

    await User.create({
      username,
      passwordHash: password,
      role: 'admin'
    });

    console.log(`Admin ${username} créé avec succès`);
    await mongoose.disconnect();
  } catch (err) {
    console.error('Erreur:', err);
    process.exit(1);
  }
}

seedAdmin();