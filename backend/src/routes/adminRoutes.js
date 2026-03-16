const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Match = require('../models/Match');
const Bet = require('../models/Bet');

// Middleware to verify admin token
const verifyAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    
    const user = await User.findById(decoded.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied. Admin only.' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Dashboard stats
router.get('/dashboard/stats', verifyAdmin, async (req, res) => {
  try {
    const [totalUsers, totalBets, totalMatches] = await Promise.all([
      User.countDocuments(),
      Bet.countDocuments(),
      Match.countDocuments()
    ]);

    const liveMatches = await Match.countDocuments({ status: 'live' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayBets = await Bet.countDocuments({
      createdAt: { $gte: today }
    });

    const recentBets = await Bet.find()
      .populate('user', 'name email')
      .populate('match', 'homeTeam awayTeam')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalBets,
        totalMatches,
        liveMatches,
        todayBets,
        recentBets
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all matches
router.get('/matches', verifyAdmin, async (req, res) => {
  try {
    const matches = await Match.find().sort({ startTime: 'asc' });
    res.json({ success: true, matches });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create match
router.post('/matches', verifyAdmin, async (req, res) => {
  try {
    const match = await Match.create(req.body);
    res.json({ success: true, message: 'Match created successfully', match });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update match
router.put('/matches/:id', verifyAdmin, async (req, res) => {
  try {
    const match = await Match.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, message: 'Match updated successfully', match });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete match
router.delete('/matches/:id', verifyAdmin, async (req, res) => {
  try {
    await Bet.deleteMany({ match: req.params.id });
    await Match.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Match deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all users
router.get('/users', verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all bets
router.get('/bets', verifyAdmin, async (req, res) => {
  try {
    const bets = await Bet.find()
      .populate('user', 'name email')
      .populate('match')
      .sort({ createdAt: -1 });
    res.json({ success: true, bets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;