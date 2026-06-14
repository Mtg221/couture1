const mongoose = require('mongoose');

const employeSchema = new mongoose.Schema({
  nom: { type: String, required: true, trim: true },
  telephone: { type: String, required: true, unique: true, trim: true },
}, { timestamps: true });

module.exports = mongoose.model('Employe', employeSchema);