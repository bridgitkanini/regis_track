import { connect } from 'mongoose';
import dotenv from 'dotenv';
import { Role, User, Member, ActivityLog } from '../models';
import bcrypt from 'bcrypt';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/registrack';

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
    permissions: [
      'members:read',
      'members:create',
      'members:update',
    ],
  },
];

const users = [
  {
    username: 'admin',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin',
  },
  {
    username: 'user1',
    email: 'user1@example.com',
    password: 'password123',
    role: 'user',
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

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await Promise.all([
      ActivityLog.deleteMany({}),
      Member.deleteMany({}),
      User.deleteMany({}),
      Role.deleteMany({}),
    ]);

    console.log('Seeding roles...');
    const createdRoles = await Role.insertMany(roles);
    console.log(`Created ${createdRoles.length} roles`);

    console.log('Seeding users...');
    const createdUsers = await Promise.all(
      users.map(async (userData) => {
        const role = createdRoles.find((r) => r.name === userData.role);
        if (!role) {
          throw new Error(`Role ${userData.role} not found`);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);

        const user = new User({
          username: userData.username,
          email: userData.email,
          password: hashedPassword,
          role: role._id,
          isActive: true,
        });

        return user.save();
      })
    );
    console.log(`Created ${createdUsers.length} users`);

    console.log('Seeding members...');
    const createdMembers = await Promise.all(
      members.map((memberData, index) => {
        // Assign members to users in a round-robin fashion
        const createdBy = createdUsers[index % createdUsers.length]._id;

        const member = new Member({
          ...memberData,
          createdBy,
        });

        return member.save();
      })
    );
    console.log(`Created ${createdMembers.length} members`);

    console.log('Seeding activity logs...');
    const activities = [
      {
        action: 'create',
        collectionName: 'User',
        documentId: createdUsers[0]._id,
        userId: createdUsers[0]._id,
        changes: { username: 'admin', email: 'admin@example.com' },
      },
      {
        action: 'create',
        collectionName: 'Member',
        documentId: createdMembers[0]._id,
        userId: createdUsers[0]._id,
        changes: { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
      },
      {
        action: 'login',
        collectionName: 'User',
        documentId: createdUsers[0]._id,
        userId: createdUsers[0]._id,
      },
    ];

    await ActivityLog.insertMany(activities);
    console.log(`Created ${activities.length} activity logs`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
