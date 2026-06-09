const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username:     { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role:         { type: String, enum: ['admin', 'secretaire'], default: 'secretaire' },
}, { timestamps: true });

userSchema.pre('save', async function () {
  if (this.isModified('passwordHash'))
    this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
});

userSchema.methods.checkPassword = function (pwd) {
  return bcrypt.compare(pwd, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);