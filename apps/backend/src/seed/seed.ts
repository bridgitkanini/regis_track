import { connect } from 'mongoose';
import dotenv from 'dotenv';
import { Role, User, Member, ActivityLog } from '../models';
dotenv.config();

interface RoleDocument {
  _id: any; // MongoDB ID
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

  const existingRoles = (await Role.find({
    name: { $in: ['admin', 'user'] },
  })) as unknown as RoleDocument[];

  const existingRoleNames = existingRoles.map((role) => role.name);
  const rolesToCreate = roles.filter(
    (role) => !existingRoleNames.includes(role.name)
  );

  if (rolesToCreate.length > 0) {
    const createdRoles = (await Role.insertMany(
      rolesToCreate
    )) as unknown as RoleDocument[];
    console.log(`Created ${createdRoles.length} roles`);
    return [...existingRoles, ...createdRoles];
  } else {
    console.log('Using existing roles');
    return existingRoles;
  }
};

const seedDatabase = async () => {
  try {
    await connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    await clearExistingData();

    // Get or create roles
    const rolesInDb = await seedRoles();

    // Update the roles array with the ones from the database
    const updatedRoles = roles.map(
      (role) =>
        rolesInDb.find((r) => r.name === role.name) || {
          ...role,
          _id: role.name,
        }
    ) as RoleDocument[];

    // Now seed users with the updated roles
    console.log('Seeding users...');
    const createdUsers = await User.insertMany(
      users.map((user) => {
        const role = updatedRoles.find((r) => r.name === user.role);
        if (!role) {
          throw new Error(`Role ${user.role} not found`);
        }
        return {
          ...user,
          role: role._id,
        };
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
        changes: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
        },
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

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedDatabase().catch(console.error);
}

export { seedDatabase };
