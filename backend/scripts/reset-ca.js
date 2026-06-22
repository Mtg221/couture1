const mongoose = require('mongoose');
const Paiement = require('../models/Paiement');
require('dotenv').config();

async function resetCA() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connecté');

    const result = await Paiement.deleteMany({});
    console.log(`${result.deletedCount} paiements supprimés`);
    console.log('Chiffre d\'affaires réinitialisé à 0');

    await mongoose.disconnect();
  } catch (err) {
    console.error('Erreur:', err);
    process.exit(1);
  }
}

resetCA();