const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  homeTeam: { type: String, required: true },
  awayTeam: { type: String, required: true },
  league: { type: String, required: true },
  startTime: { type: Date, required: true },
  homeOdds: { type: Number, required: true },
  drawOdds: { type: Number, required: true },
  awayOdds: { type: Number, required: true },
  status: { type: String, default: 'upcoming' },
  result: String
}, { timestamps: true });

module.exports = mongoose.model('Match', matchSchema);