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
  const judgePassword = hashPassword('manager123');
  await prisma.users.upsert({
    where: { username: 'manager' },
    update: {},
    create: {
      username: 'manager',
      password: judgePassword,
      fullName: 'Manager User',
      isActive: true,
    },
  });

  // Create regular user
  const userPassword = hashPassword('staff123');
  await prisma.users.upsert({
    where: { username: 'staff' },
    update: {},
    create: {
      username: 'staff',
      password: userPassword,
      fullName: 'Staff User',
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
