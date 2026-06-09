const mongoose = require('mongoose');

const commandeSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  typeVetement: { type: String, required: true },
  description:  { type: String, required: true },
  mesures: {
    tourPoitrine: Number, tourTaille: Number, tourHanches: Number,
    hauteurTotal: Number, hauteurDos: Number, longueurBras: Number,
    tourBras: Number, epaules: Number, autres: String,
  },
  images:       [String],
  statut: {
    type: String,
    enum: ['en_attente', 'en_cours', 'prete', 'livree', 'refusee'],
    default: 'en_attente',
  },
  prixTotal:    { type: Number, default: 0 },
  avancePaye:   { type: Number, default: 0 },
  dateLivraison: Date,
  historiqueStatut: [{
    statut: String,
    date:   { type: Date, default: Date.now },
    note:   String,
  }],
  sourceCommande: { type: String, enum: ['admin', 'public'], default: 'admin' },
}, { timestamps: true });

commandeSchema.virtual('resteAPayer').get(function () {
  return this.prixTotal - this.avancePaye;
});

module.exports = mongoose.model('Commande', commandeSchema);