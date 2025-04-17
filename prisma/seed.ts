import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Hash passwords
  const users = [
    { username: 'Louis', password: await bcrypt.hash('louispw123', 10) },
    { username: 'Erwan', password: await bcrypt.hash('erwanpw123', 10) },
    { username: 'Mathieu', password: await bcrypt.hash('mathieupw123', 10) },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { username: user.username },
      update: {},
      create: user,
    });
  }

  console.log('Seeded users!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
