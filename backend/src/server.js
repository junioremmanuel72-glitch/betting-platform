const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

dotenv.config();

const prisma = new PrismaClient();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ==================== ROUTES ====================
const userRoutes = require('./routes/userRoutes');
const betRoutes = require('./routes/betRoutes');
const matchRoutes = require('./routes/matchRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/api/users', userRoutes);
app.use('/api/bets', betRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/admin', adminRoutes);

// ==================== TEST ROUTES ====================
// Basic test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Backend is working!',
    timestamp: new Date().toISOString()
  });
});

// Database test endpoint
app.get('/api/db-test', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      success: true,
      message: 'Database connected successfully!',
      database: 'betpawa'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// ==================== SERVER START ====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('\n✅ ==================================');
  console.log(`✅ Server running on port ${PORT}`);
  console.log('✅ ==================================\n');
  
  console.log('📍 TEST ENDPOINTS:');
  console.log(`   • Test:        http://localhost:${PORT}/api/test`);
  console.log(`   • DB Test:     http://localhost:${PORT}/api/db-test\n`);
  
  console.log('📍 USER ENDPOINTS:');
  console.log(`   • Register:    http://localhost:${PORT}/api/users/register`);
  console.log(`   • Login:       http://localhost:${PORT}/api/users/login`);
  console.log(`   • Profile:     http://localhost:${PORT}/api/users/profile\n`);
  
  console.log('📍 MATCH ENDPOINTS:');
  console.log(`   • Get All:     http://localhost:${PORT}/api/matches`);
  console.log(`   • Get One:     http://localhost:${PORT}/api/matches/:id\n`);
  
  console.log('📍 BET ENDPOINTS:');
  console.log(`   • Place Bet:   http://localhost:${PORT}/api/bets (POST)`);
  console.log(`   • My Bets:     http://localhost:${PORT}/api/bets/my-bets`);
  console.log(`   • Cashout:     http://localhost:${PORT}/api/bets/:id/cashout\n`);
  
  console.log('📍 ADMIN ENDPOINTS:');
  console.log(`   • Dashboard:   http://localhost:${PORT}/api/admin/dashboard/stats`);
  console.log(`   • Users:       http://localhost:${PORT}/api/admin/users`);
  console.log(`   • User Details: http://localhost:${PORT}/api/admin/users/:id`);
  console.log(`   • Matches:     http://localhost:${PORT}/api/admin/matches`);
  console.log(`   • Create Match: http://localhost:${PORT}/api/admin/matches (POST)`);
  console.log(`   • Bets:        http://localhost:${PORT}/api/admin/bets`);
  console.log(`   • Settle Bet:  http://localhost:${PORT}/api/admin/bets/:id (PATCH)`);
  console.log(`   • System Stats: http://localhost:${PORT}/api/admin/system/stats\n`);
});