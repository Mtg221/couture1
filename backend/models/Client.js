const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const mesuresHommeSchema = new mongoose.Schema({
  cou: Number,
  poitrine: Number,
  longueurMancheCourte: Number,
  longueurMancheLongue: Number,
  tourDeManche: Number,
  tourDePoignet: Number,
  longueurBoubou: Number,
  epaule: Number,
  ceinture: Number,
  tourDeFesse: Number,
  tourDuneCuisse: Number,
  tourDeGenou: Number,
  tourDeMollet: Number,
  longueurPantalon: Number,
  longueurDemiSaison: Number,
}, { _id: false });

const mesuresFemmeSchema = new mongoose.Schema({
  cou: Number,
  poitrine: Number,
  longueurMancheCourte: Number,
  longueurMancheLongue: Number,
  tourDeManche: Number,
  tourDePoignet: Number,
  longueurBoubou: Number,
  epaule: Number,
  taille: Number,
  ceinture: Number,
  tourDeFesse: Number,
  tourDuneCuisse: Number,
  tourDeGenou: Number,
  tourDeMollet: Number,
  longueurPantalon: Number,
  longueurHaut: Number,
  longueurMariniere: Number,
  longueurBoubou3Quart: Number,
  longueurJupe: Number,
  longueurPagne: Number,
}, { _id: false });

const clientSchema = new mongoose.Schema({
  nom:       { type: String, required: true, trim: true },
  telephone: { type: String, required: true },
  email:     { type: String, required: true, unique: true, trim: true },
  passwordHash: { type: String, required: false },
  sexe:      { type: String, enum: ['homme', 'femme'], default: 'femme' },
  mesuresHomme:  mesuresHommeSchema,
  mesuresFemme:  mesuresFemmeSchema,
  notes:     String,
}, { timestamps: true });

clientSchema.pre('save', async function () {
  if (this.isModified('passwordHash') && this.passwordHash)
    this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
});

clientSchema.methods.checkPassword = function (pwd) {
  if (!this.passwordHash) return false;
  return bcrypt.compare(pwd, this.passwordHash);
};

module.exports = mongoose.model('Client', clientSchema);