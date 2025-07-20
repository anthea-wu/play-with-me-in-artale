import { PrismaClient } from '@prisma/client';
import { randomBytes } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Create test groups
  const group1 = await prisma.group.create({
    data: {
      job: '龍騎士',
      level: 85,
      maps: ['DT'],
      availableTimes: ['MON_20', 'MON_21', 'TUE_20', 'TUE_21', 'WED_20', 'WED_21'],
      gameId: 'DragonKnight123',
      discordId: 'dragon#1234',
      privateKey: randomBytes(32).toString('hex'),
    },
  });

  const group2 = await prisma.group.create({
    data: {
      job: '祭司',
      level: 78,
      maps: ['PW'],
      availableTimes: ['MON_19', 'MON_20', 'TUE_19', 'TUE_20', 'FRI_19', 'FRI_20'],
      gameId: 'Priest456',
      discordId: null,
      privateKey: randomBytes(32).toString('hex'),
    },
  });

  const group3 = await prisma.group.create({
    data: {
      job: '龍騎士',
      level: 92,
      maps: ['CD'],
      availableTimes: ['THU_21', 'THU_22', 'FRI_21', 'FRI_22', 'SAT_21', 'SAT_22', 'SUN_21', 'SUN_22'],
      gameId: 'EliteDragon',
      discordId: 'elite#5678',
      privateKey: randomBytes(32).toString('hex'),
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