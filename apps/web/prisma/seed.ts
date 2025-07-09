import { PrismaClient } from '@/generated/prisma/client';
import { hashPassword } from '@/helpers/server/hashPassword';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = hashPassword('admin123');
  await prisma.users.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: adminPassword,
      role: 'admin',
      fullName: 'Admin User',
      isActive: true,
      isAdmin: true,
    },
  });

  // Create judge user
  const judgePassword = hashPassword('judge123');
  await prisma.users.upsert({
    where: { username: 'judge1' },
    update: {},
    create: {
      username: 'judge1',
      password: judgePassword,
      fullName: 'Judge User',
      isActive: true,
    },
  });

  // Create regular user
  const userPassword = hashPassword('user123');
  await prisma.users.upsert({
    where: { username: 'user1' },
    update: {},
    create: {
      username: 'user1',
      password: userPassword,
      fullName: 'Regular User',
      isActive: true,
    },
  });

  console.log('Seeding completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
