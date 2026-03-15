const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding matches...');

  const matches = [
    {
      homeTeam: 'Bayer Leverkusen',
      awayTeam: 'Arsenal FC',
      league: 'UEFA Champions League',
      startTime: new Date('2026-03-15T20:45:00'),
      homeOdds: 6.38,
      drawOdds: 4.64,
      awayOdds: 1.57,
      status: 'upcoming'
    },
    {
      homeTeam: 'Real Madrid',
      awayTeam: 'Manchester City',
      league: 'UEFA Champions League',
      startTime: new Date('2026-03-15T23:00:00'),
      homeOdds: 3.78,
      drawOdds: 3.92,
      awayOdds: 2.04,
      status: 'upcoming'
    },
    {
      homeTeam: 'PSG',
      awayTeam: 'Chelsea',
      league: 'UEFA Champions League',
      startTime: new Date('2026-03-15T23:00:00'),
      homeOdds: 2.10,
      drawOdds: 3.40,
      awayOdds: 3.20,
      status: 'upcoming'
    },
    {
      homeTeam: 'Bayern Munich',
      awayTeam: 'Inter Milan',
      league: 'UEFA Champions League',
      startTime: new Date('2026-03-15T20:00:00'),
      homeOdds: 1.85,
      drawOdds: 3.60,
      awayOdds: 4.10,
      status: 'upcoming'
    }
  ];

  for (const match of matches) {
    await prisma.match.create({
      data: match
    });
    console.log(`Added: ${match.homeTeam} vs ${match.awayTeam}`);
  }

  console.log('Seeding complete!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });