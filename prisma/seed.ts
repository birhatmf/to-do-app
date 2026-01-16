import { PrismaClient, Role, TaskStatus, EstimateUnit } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();
  await prisma.team.deleteMany();

  // Hash password for all users (default: password123)
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create Teams
  const teamA = await prisma.team.create({
    data: { name: 'Team Alpha' },
  });
  const teamB = await prisma.team.create({
    data: { name: 'Team Beta' },
  });

  console.log('✅ Created teams');

  // Create Users
  // Admin
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@taskflow.com',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  // Team A - Manager
  const managerA = await prisma.user.create({
    data: {
      name: 'Ahmet Yılmaz',
      email: 'ahmet@taskflow.com',
      password: hashedPassword,
      role: Role.MANAGER,
      teamId: teamA.id,
    },
  });

  // Team A - Employees
  const employeeA1 = await prisma.user.create({
    data: {
      name: 'Ayşe Demir',
      email: 'ayse@taskflow.com',
      password: hashedPassword,
      role: Role.EMPLOYEE,
      teamId: teamA.id,
    },
  });

  const employeeA2 = await prisma.user.create({
    data: {
      name: 'Mehmet Kaya',
      email: 'mehmet@taskflow.com',
      password: hashedPassword,
      role: Role.EMPLOYEE,
      teamId: teamA.id,
    },
  });

  // Team B - Manager
  const managerB = await prisma.user.create({
    data: {
      name: 'Zeynep Çelik',
      email: 'zeynep@taskflow.com',
      password: hashedPassword,
      role: Role.MANAGER,
      teamId: teamB.id,
    },
  });

  // Team B - Employee
  const employeeB1 = await prisma.user.create({
    data: {
      name: 'Can Özkan',
      email: 'can@taskflow.com',
      password: hashedPassword,
      role: Role.EMPLOYEE,
      teamId: teamB.id,
    },
  });

  console.log('✅ Created users');

  // Create Projects for Team A
  const projectA1 = await prisma.project.create({
    data: {
      name: 'E-Ticaret Platformu',
      teamId: teamA.id,
    },
  });

  const projectA2 = await prisma.project.create({
    data: {
      name: 'Mobil Uygulama Redesign',
      teamId: teamA.id,
    },
  });

  // Create Projects for Team B
  const projectB1 = await prisma.project.create({
    data: {
      name: 'Dashboard Analytics',
      teamId: teamB.id,
    },
  });

  const projectB2 = await prisma.project.create({
    data: {
      name: 'API Gateway',
      teamId: teamB.id,
    },
  });

  console.log('✅ Created projects');

  // Create Tasks for Team A
  await prisma.task.createMany({
    data: [
      {
        projectId: projectA1.id,
        title: 'Kullanıcı girişi implementasyonu',
        description: 'JWT tabanlı authentication sistemi',
        status: TaskStatus.IN_PROGRESS,
        estimateValue: 8,
        estimateUnit: EstimateUnit.HOUR,
        createdById: managerA.id,
        assigneeId: employeeA1.id,
      },
      {
        projectId: projectA1.id,
        title: 'Sepet yönetimi',
        description: 'Ürün ekleme, çıkarma ve miktar güncelleme',
        status: TaskStatus.TODO,
        estimateValue: 2,
        estimateUnit: EstimateUnit.DAY,
        createdById: managerA.id,
        assigneeId: employeeA2.id,
      },
      {
        projectId: projectA1.id,
        title: 'Ödeme entegrasyonu',
        description: 'Sanal POS entegrasyonu',
        status: TaskStatus.TODO,
        estimateValue: 3,
        estimateUnit: EstimateUnit.DAY,
        createdById: employeeA1.id,
        assigneeId: employeeA1.id,
      },
      {
        projectId: projectA2.id,
        title: 'UI component library',
        description: 'Tasarım sisteminin oluşturulması',
        status: TaskStatus.DONE,
        estimateValue: 1,
        estimateUnit: EstimateUnit.WEEK,
        createdById: managerA.id,
        assigneeId: employeeA1.id,
      },
      {
        projectId: projectA2.id,
        title: 'Dark mode desteği',
        description: 'Karanlık tema implementasyonu',
        status: TaskStatus.IN_PROGRESS,
        estimateValue: 1,
        estimateUnit: EstimateUnit.DAY,
        createdById: employeeA2.id,
        assigneeId: employeeA2.id,
      },
    ],
  });

  // Create Tasks for Team B
  await prisma.task.createMany({
    data: [
      {
        projectId: projectB1.id,
        title: 'Real-time data widget',
        description: 'WebSocket ile canlı veri akışı',
        status: TaskStatus.IN_PROGRESS,
        estimateValue: 2,
        estimateUnit: EstimateUnit.DAY,
        createdById: managerB.id,
        assigneeId: employeeB1.id,
      },
      {
        projectId: projectB1.id,
        title: 'Export functionality',
        description: 'PDF ve Excel export özellikleri',
        status: TaskStatus.TODO,
        estimateValue: 1,
        estimateUnit: EstimateUnit.DAY,
        createdById: managerB.id,
        assigneeId: employeeB1.id,
      },
      {
        projectId: projectB2.id,
        title: 'Rate limiting',
        description: 'API rate limiting middleware',
        status: TaskStatus.DONE,
        estimateValue: 4,
        estimateUnit: EstimateUnit.HOUR,
        createdById: employeeB1.id,
        assigneeId: employeeB1.id,
      },
    ],
  });

  console.log('✅ Created tasks');

  console.log('');
  console.log('🎉 Seed completed!');
  console.log('');
  console.log('Demo Login Credentials:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📧 Email                  | 🔑 Role        | 👥 Team');
  console.log('──────────────────────────────────────────────────');
  console.log('admin@taskflow.com        | ADMIN         | (All)');
  console.log('ahmet@taskflow.com        | MANAGER       | Team Alpha');
  console.log('ayse@taskflow.com         | EMPLOYEE      | Team Alpha');
  console.log('mehmet@taskflow.com       | EMPLOYEE      | Team Alpha');
  console.log('zeynep@taskflow.com       | MANAGER       | Team Beta');
  console.log('can@taskflow.com          | EMPLOYEE      | Team Beta');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔑 Password for all: password123');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
