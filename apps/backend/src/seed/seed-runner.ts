// src/seed/seed-runner.ts
import dotenv from 'dotenv';
import path from 'path';
import { connect } from 'mongoose';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/registrack';

// Import the seed function after environment variables are loaded
import { seedDatabase } from './seed';

async function run() {
  try {
    await connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    await seedDatabase();
    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error running seed:', error);
    process.exit(1);
  }
}

run();
