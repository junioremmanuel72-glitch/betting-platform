const mongoose = require('mongoose');

const betSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  match: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true },
  selection: { type: String, required: true },
  odds: { type: Number, required: true },
  stake: { type: Number, required: true },
  potentialWin: { type: Number, required: true },
  status: { type: String, default: 'pending' },
  cashoutAmount: Number
}, { timestamps: true });

module.exports = mongoose.model('Bet', betSchema);