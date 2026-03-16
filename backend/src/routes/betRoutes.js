const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Bet = require('../models/Bet');
const Match = require('../models/Match');
const User = require('../models/User');

// Middleware to verify token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Place a bet
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { matchId, selection, stake } = req.body;
    const userId = req.user.id;

    // Get match details
    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ success: false, message: 'Match not found' });
    }

    if (match.status !== 'upcoming') {
      return res.status(400).json({ success: false, message: 'Match already started or finished' });
    }

    // Get odds based on selection
    let odds;
    switch(selection) {
      case 'HOME':
        odds = match.homeOdds;
        break;
      case 'DRAW':
        odds = match.drawOdds;
        break;
      case 'AWAY':
        odds = match.awayOdds;
        break;
      default:
        return res.status(400).json({ success: false, message: 'Invalid selection' });
    }

    // Calculate potential win
    const potentialWin = stake * odds;

    // Check user balance
    const user = await User.findById(userId);
    if (user.balance < stake) {
      return res.status(400).json({ success: false, message: 'Insufficient balance' });
    }

    // Create bet and update balance
    const bet = await Bet.create({
      user: userId,
      match: matchId,
      selection,
      odds,
      stake,
      potentialWin,
      status: 'pending'
    });

    // Update user balance
    user.balance -= stake;
    await user.save();

    res.json({
      success: true,
      message: 'Bet placed successfully',
      bet,
      newBalance: user.balance
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get user's bets
router.get('/my-bets', authenticateToken, async (req, res) => {
  try {
    const bets = await Bet.find({ user: req.user.id })
      .populate('match')
      .sort({ createdAt: 'desc' });

    res.json({ success: true, bets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;