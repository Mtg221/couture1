const mongoose = require('mongoose');

const commandeSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  typeVetement: { type: String, required: true },
  description:  { type: String, required: true },
  sexe: { type: String, enum: ['homme', 'femme'], default: 'homme' },
  mesures: {
    tourPoitrine: Number, tourTaille: Number, tourHanches: Number,
    hauteurTotal: Number, hauteurDos: Number, longueurBras: Number,
    tourBras: Number, epaules: Number, autres: String,
    cou: Number, longueurMancheCourte: Number, longueurMancheLongue: Number,
    tourManche: Number, tourPoignet: Number, longueurBoubou: Number,
    ceinture: Number, tourFesse: Number, tourCuisse: Number,
    tourGenou: Number, tourMollet: Number, longueurPantalon: Number,
    longueurDemiSaison: Number, longueurHaut: Number, longueurMariniere: Number,
    longueurBoubou3Quart: Number, longueurJupe: Number, longueurPagne: Number,
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