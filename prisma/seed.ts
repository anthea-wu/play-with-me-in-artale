import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Create test groups
  const group1 = await prisma.group.create({
    data: {
      job: '龍騎士',
      level: 85,
      map: 'DT',
      startTime: new Date('2025-07-15T20:00:00Z'),
      endTime: new Date('2025-07-15T22:00:00Z'),
      gameId: 'DragonKnight123',
      discordId: 'dragon#1234',
    },
  });

  const group2 = await prisma.group.create({
    data: {
      job: '祭司',
      level: 78,
      map: 'PW',
      startTime: new Date('2025-07-15T19:30:00Z'),
      endTime: new Date('2025-07-15T21:30:00Z'),
      gameId: 'Priest456',
      discordId: null,
    },
  });

  const group3 = await prisma.group.create({
    data: {
      job: '龍騎士',
      level: 92,
      map: 'CD',
      startTime: new Date('2025-07-15T21:00:00Z'),
      endTime: new Date('2025-07-15T23:00:00Z'),
      gameId: 'EliteDragon',
      discordId: 'elite#5678',
    },
  });

  console.log({ group1, group2, group3 });
  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });