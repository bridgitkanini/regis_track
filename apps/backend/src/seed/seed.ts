import { connect, connection } from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcrypt';
import { Role, User, Member, ActivityLog } from '../models';

// Load environment variables from the .env file in the backend directory
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

interface RoleDocument {
  _id: any;
  name: string;
  permissions: string[];
}

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/registrack';

const roles = [
  {
    name: 'admin',
    permissions: [
      'users:read',
      'users:create',
      'users:update',
      'users:delete',
      'members:read',
      'members:create',
      'members:update',
      'members:delete',
      'dashboard:view',
    ],
  },
  {
    name: 'user',
    permissions: ['members:read', 'members:create', 'members:update'],
  },
];

// Define user data without hashed passwords
const userData = [
  {
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin123', // Will be hashed later
    role: 'admin',
    isActive: true,
  },
  {
    username: 'user1',
    email: 'user1@example.com',
    password: 'user1234', // Will be hashed later
    role: 'user',
    isActive: true,
  },
];

const members = [
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    dateOfBirth: new Date('1990-01-15'),
    role: 'Premium Member',
    status: 'active',
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    dateOfBirth: new Date('1985-05-22'),
    role: 'Basic Member',
    status: 'active',
  },
  {
    firstName: 'Robert',
    lastName: 'Johnson',
    email: 'robert.j@example.com',
    dateOfBirth: new Date('1992-11-08'),
    role: 'VIP Member',
    status: 'inactive',
  },
];

const clearExistingData = async () => {
  console.log('Clearing existing data...');
  await Promise.all([
    User.deleteMany({}),
    Member.deleteMany({}),
    ActivityLog.deleteMany({}),
  ]);
};

const seedRoles = async (): Promise<RoleDocument[]> => {
  console.log('Seeding roles...');
  const existingRoles = await Role.find({
    name: { $in: ['admin', 'user'] },
  });

  const existingRoleNames = existingRoles.map((role) => role.name);
  const rolesToCreate = roles.filter(
    (role) => !existingRoleNames.includes(role.name)
  );

  if (rolesToCreate.length > 0) {
    const createdRoles = await Role.insertMany(rolesToCreate);
    console.log(`Created ${createdRoles.length} roles`);
    return [...existingRoles, ...createdRoles];
  } else {
    console.log('Using existing roles');
    return existingRoles;
  }
};

const seedUsers = async (roles: RoleDocument[]) => {
  console.log('Seeding users...');

  // Hash passwords before creating users
  const usersWithHashedPasswords = await Promise.all(
    userData.map(async (user) => ({
      ...user,
      password: await bcrypt.hash(user.password, 10),
    }))
  );

  const createdUsers = await User.insertMany(
    usersWithHashedPasswords.map((user) => {
      const role = roles.find((r) => r.name === user.role);
      if (!role) {
        throw new Error(`Role ${user.role} not found`);
      }
      return {
        username: user.username,
        email: user.email,
        password: user.password,
        role: role._id,
        isActive: user.isActive,
      };
    })
  );

  console.log(`Created ${createdUsers.length} users`);
  return createdUsers;
};

const seedMembers = async () => {
  console.log('Seeding members...');
  const createdMembers = await Member.insertMany(members);
  console.log(`Created ${createdMembers.length} members`);
  return createdMembers;
};

const seedActivityLogs = async () => {
  console.log('Seeding activity logs...');
  const logs = [
    {
      action: 'User logged in',
      details: 'User successfully logged in',
      level: 'info',
    },
    {
      action: 'User registered',
      details: 'New user registration',
      level: 'info',
    },
    {
      action: 'Profile updated',
      details: 'User updated their profile information',
      level: 'info',
    },
  ];

  const createdLogs = await ActivityLog.insertMany(logs);
  console.log(`Created ${createdLogs.length} activity logs`);
  return createdLogs;
};

export const seedDatabase = async () => {
  try {
    await connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    await clearExistingData();

    const rolesInDb = await seedRoles();
    await seedUsers(rolesInDb);
    await seedMembers();
    await seedActivityLogs();

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    // Close the connection after seeding
    await connection.close();
  }
};

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedDatabase().catch(console.error);
}
