const { PrismaClient } = require('@prisma/client');
const { randomBytes } = require('crypto');

const prisma = new PrismaClient();

async function populatePrivateKeys() {
  try {
    // 獲取所有沒有 private key 的組隊
    const groups = await prisma.group.findMany({
      where: {
        privateKey: null
      }
    });

    console.log(`Found ${groups.length} groups without private keys`);

    // 為每個組隊生成 private key
    for (const group of groups) {
      const privateKey = randomBytes(32).toString('hex');
      
      await prisma.group.update({
        where: { id: group.id },
        data: { privateKey }
      });

      console.log(`Updated group ${group.id} with private key`);
    }

    console.log('Private keys population completed');
  } catch (error) {
    console.error('Error populating private keys:', error);
  } finally {
    await prisma.$disconnect();
  }
}

populatePrivateKeys();