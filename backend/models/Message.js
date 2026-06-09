const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  nom:       { type: String, required: true },
  telephone: { type: String, required: true },
  message:   { type: String, required: true },
  lu:        { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);