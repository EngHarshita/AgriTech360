import { connectDB, disconnectDB } from '../config';
import { seedSchemesDatabase } from '../services/schemesService';
import { logger } from '../utils/logger';

const runSeed = async () => {
  try {
    logger.info('Starting Government Schemes dataset seeding process...');
    await connectDB();
    const count = await seedSchemesDatabase(true);
    logger.info(`Successfully seeded ${count} Government Agriculture Schemes into MongoDB.`);
    await disconnectDB();
    process.exit(0);
  } catch (error) {
    logger.error('Error during Government Schemes seeding:', error);
    process.exit(1);
  }
};

runSeed();
