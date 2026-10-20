import { connectDB, disconnectDB } from '../config';
import { seedMandiDatabase } from '../services/mandiService';
import { logger } from '../utils/logger';

const runSeed = async () => {
  try {
    logger.info('Starting Mandi Price dataset seeding process...');
    await connectDB();
    const count = await seedMandiDatabase(true);
    logger.info(`Successfully seeded ${count} APMC market records into MongoDB.`);
    await disconnectDB();
    process.exit(0);
  } catch (error) {
    logger.error('Error during Mandi Price seeding:', error);
    process.exit(1);
  }
};

runSeed();
