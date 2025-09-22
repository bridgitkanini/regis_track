import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User, Role, Member } from '../src/models';
import { IUser } from '../src/models/user.model';
import { IRole } from '../src/models/role.model';

dotenv.config();

// Use the same database URI as the main application
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/registrack';

// Extend the IUser interface to include the populated role
interface IUserWithRole extends Omit<IUser, 'role'> {
  role: (IRole & { _id: mongoose.Types.ObjectId }) | mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

async function migrateUsersToMembers() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB:', MONGODB_URI);

    // Get all users and populate the role
    console.log('Fetching users...');
    const users = await User.find({})
      .populate<{ role: IRole }>('role')
      .lean() as unknown as IUserWithRole[];
    
    console.log(`Found ${users.length} users in the database`);
    
let createdCount = 0;
let skippedCount = 0;

for (const user of users) {
  // Check if member already exists for this user
  const existingMember = await Member.findOne({ email: user.email });
  
  if (!existingMember) {
    // Get role name, handling both populated and non-populated cases
    const roleName = user.role && typeof user.role === 'object' && 'name' in user.role 
      ? (user.role as IRole).name 
      : 'member';

    // Create member data
    const memberData = {
      firstName: user.username.split(' ')[0] || user.username,
      lastName: user.username.split(' ').slice(1).join(' ') || 'User',
      email: user.email,
      role: roleName,
      createdBy: user._id,
      status: 'active',
      dateOfBirth: new Date('1990-01-01'), // Set a default date of birth
      membershipStatus: 'active',
      membershipStartDate: user.createdAt || new Date(),
      phone: '+1234567890', // Default phone number
      address: 'Not specified', // Default address
      gender: 'other', // Default gender
      createdAt: user.createdAt || new Date(),
      updatedAt: new Date()
    };

    console.log('Creating member for user:', user.email);
    console.log('Member data:', JSON.stringify(memberData, null, 2));

    await Member.create(memberData);
    createdCount++;
    console.log(`Created member for user: ${user.email}`);
  } else {
    skippedCount++;
  }
}
    
    console.log(`Migration complete. Created ${createdCount} members, skipped ${skippedCount} existing members.`);
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateUsersToMembers();
