const mongoose = require('mongoose');

const paiementSchema = new mongoose.Schema({
  commande: { type: mongoose.Schema.Types.ObjectId, ref: 'Commande', required: true },
  montant:  { type: Number, required: true },
  mode: {
    type: String,
    enum: ['cash', 'wave', 'orange_money', 'carte_bancaire'],
    default: 'cash',
  },
  note: String,
}, { timestamps: true });

module.exports = mongoose.model('Paiement', paiementSchema);