const mongoose = require('mongoose');

const paiementSchema = new mongoose.Schema({
  commande: { type: mongoose.Schema.Types.ObjectId, ref: 'Commande', required: true },
  montant:  { type: Number, required: true },
  mode: {
    type: String,
    enum: ['especes', 'wave', 'orange_money', 'autre'],
    default: 'especes',
  },
  note: String,
}, { timestamps: true });

module.exports = mongoose.model('Paiement', paiementSchema);