const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

// Middleware to verify admin token
const verifyAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    
    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied. Admin only.' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Get all matches (admin view)
router.get('/matches', verifyAdmin, async (req, res) => {
  try {
    const matches = await prisma.match.findMany({
      orderBy: { startTime: 'asc' }
    });
    res.json({ success: true, matches });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create new match
router.post('/matches', verifyAdmin, async (req, res) => {
  try {
    const { homeTeam, awayTeam, league, startTime, homeOdds, drawOdds, awayOdds, status } = req.body;

    const match = await prisma.match.create({
      data: {
        homeTeam,
        awayTeam,
        league,
        startTime: new Date(startTime),
        homeOdds,
        drawOdds,
        awayOdds,
        status: status || 'upcoming'
      }
    });

    res.json({ success: true, message: 'Match created successfully', match });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update match
router.put('/matches/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { homeTeam, awayTeam, league, startTime, homeOdds, drawOdds, awayOdds, status } = req.body;

    const match = await prisma.match.update({
      where: { id },
      data: {
        homeTeam,
        awayTeam,
        league,
        startTime: new Date(startTime),
        homeOdds,
        drawOdds,
        awayOdds,
        status
      }
    });

    res.json({ success: true, message: 'Match updated successfully', match });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete match
router.delete('/matches/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // First delete any bets associated with this match
    await prisma.bet.deleteMany({
      where: { matchId: id }
    });

    // Then delete the match
    await prisma.match.delete({
      where: { id }
    });

    res.json({ success: true, message: 'Match deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all users (admin only)
router.get('/users', verifyAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        balance: true,
        role: true,
        status: true,
        createdAt: true,
        _count: {
          select: { bets: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update user role/status (admin only)
router.patch('/users/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { role, status, balance } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: {
        role: role || undefined,
        status: status || undefined,
        balance: balance !== undefined ? balance : undefined
      },
      select: {
        id: true,
        email: true,
        name: true,
        balance: true,
        role: true,
        status: true
      }
    });

    res.json({ success: true, message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all bets (admin only)
router.get('/bets', verifyAdmin, async (req, res) => {
  try {
    const bets = await prisma.bet.findMany({
      include: {
        user: {
          select: { email: true, name: true }
        },
        match: {
          select: { homeTeam: true, awayTeam: true, league: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, bets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update bet status (settle bet)
router.patch('/bets/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const bet = await prisma.bet.findUnique({
      where: { id },
      include: { user: true }
    });

    if (!bet) {
      return res.status(404).json({ success: false, message: 'Bet not found' });
    }

    // If bet is being marked as won, update user balance
    if (status === 'won' && bet.status === 'pending') {
      await prisma.$transaction([
        prisma.bet.update({
          where: { id },
          data: { status }
        }),
        prisma.user.update({
          where: { id: bet.userId },
          data: { balance: { increment: bet.potentialWin } }
        })
      ]);
    } else {
      await prisma.bet.update({
        where: { id },
        data: { status }
      });
    }

    res.json({ success: true, message: 'Bet updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get dashboard statistics
router.get('/dashboard/stats', verifyAdmin, async (req, res) => {
  try {
    const [totalUsers, totalBets, totalMatches, totalRevenue] = await Promise.all([
      prisma.user.count(),
      prisma.bet.count(),
      prisma.match.count(),
      prisma.bet.aggregate({
        where: { status: 'won' },
        _sum: { potentialWin: true }
      })
    ]);

    const liveMatches = await prisma.match.count({
      where: { status: 'live' }
    });

    const todayBets = await prisma.bet.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }
    });

    const recentBets = await prisma.bet.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        match: { select: { homeTeam: true, awayTeam: true } }
      }
    });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalBets,
        totalMatches,
        totalRevenue: totalRevenue._sum.potentialWin || 0,
        liveMatches,
        todayBets,
        recentBets
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;