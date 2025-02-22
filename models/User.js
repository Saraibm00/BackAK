const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  weeklyScores: [{ type: Number, default: 0 }],
  assistance : [{ type: Boolean, default: false}],
  week : [{type: Number, default: 0}]
}, { versionKey: false });

module.exports = mongoose.model('User', userSchema);
