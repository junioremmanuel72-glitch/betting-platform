const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

// Middleware to verify token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
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
    const match = await prisma.match.findUnique({
      where: { id: matchId }
    });

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
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (user.balance < stake) {
      return res.status(400).json({ success: false, message: 'Insufficient balance' });
    }

    // Create bet and update balance in a transaction
    const result = await prisma.$transaction([
      prisma.bet.create({
        data: {
          userId,
          matchId,
          selection,
          odds,
          stake,
          potentialWin,
          status: 'pending'
        }
      }),
      prisma.user.update({
        where: { id: userId },
        data: { balance: { decrement: stake } }
      })
    ]);

    res.json({
      success: true,
      message: 'Bet placed successfully',
      bet: result[0],
      newBalance: result[1].balance
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get user's bets
router.get('/my-bets', authenticateToken, async (req, res) => {
  try {
    const bets = await prisma.bet.findMany({
      where: { userId: req.user.id },
      include: { match: true },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, bets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Cash out bet
router.post('/:betId/cashout', authenticateToken, async (req, res) => {
  try {
    const betId = req.params.betId;
    const userId = req.user.id;

    const bet = await prisma.bet.findFirst({
      where: {
        id: betId,
        userId,
        status: 'pending'
      }
    });

    if (!bet) {
      return res.status(404).json({ success: false, message: 'Bet not found or cannot be cashed out' });
    }

    // Calculate cashout amount (example: 70% of potential win)
    const cashoutAmount = bet.potentialWin * 0.7;

    // Update bet and refund user
    const result = await prisma.$transaction([
      prisma.bet.update({
        where: { id: betId },
        data: {
          status: 'cashed',
          cashoutAmount
        }
      }),
      prisma.user.update({
        where: { id: userId },
        data: { balance: { increment: cashoutAmount } }
      })
    ]);

    res.json({
      success: true,
      message: 'Bet cashed out successfully',
      cashoutAmount,
      newBalance: result[1].balance
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;