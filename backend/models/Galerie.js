const mongoose = require('mongoose');

const galerieSchema = new mongoose.Schema({
  imageUrl:   { type: String, required: true },
  publicId:   String,
  titre:      String,
  categorie: {
    type: String,
    enum: ['robe', 'costume', 'boubou', 'tailleur', 'enfant', 'autre'],
    default: 'autre',
  },
  description: String,
  visible:     { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Galerie', galerieSchema);