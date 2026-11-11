import crypto from 'crypto';
import { connectDB, disconnectDB } from '../config';
import { User } from '../models';
import { logger } from '../utils/logger';

/**
 * Server-side admin provisioning script.
 * Usage:
 *   ADMIN_EMAIL=admin@agritech360.internal ADMIN_PASSWORD=SecurePassword123! npm run seed:admin
 * Or with CLI args:
 *   tsx src/scripts/seedAdmin.ts --email admin@agritech360.internal --password SecurePassword123!
 */
const runAdminSeed = async () => {
  try {
    logger.info('Initializing AgriTech360 administrative account provisioning...');

    // Parse CLI flags if provided
    const args = process.argv.slice(2);
    let emailArg: string | undefined;
    let passwordArg: string | undefined;
    let nameArg: string | undefined;

    for (let i = 0; i < args.length; i++) {
      if (args[i] === '--email' && args[i + 1]) {
        emailArg = args[i + 1];
      }
      if (args[i] === '--password' && args[i + 1]) {
        passwordArg = args[i + 1];
      }
      if (args[i] === '--name' && args[i + 1]) {
        nameArg = args[i + 1];
      }
    }

    const email = (emailArg || process.env.ADMIN_EMAIL || 'admin@agritech360.internal').toLowerCase().trim();
    const name = (nameArg || process.env.ADMIN_NAME || 'Platform Administrator').trim();
    const phone = (process.env.ADMIN_PHONE || '+919999900000').trim();

    let password = passwordArg || process.env.ADMIN_PASSWORD;
    let generatedPassword = false;

    if (!password) {
      // Generate a strong cryptographic password
      password = crypto.randomBytes(12).toString('base64').replace(/[/+=]/g, 'x') + 'A1!';
      generatedPassword = true;
    }

    await connectDB();

    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      existingAdmin.role = 'admin';
      (existingAdmin as any).status = 'active';
      existingAdmin.password = password;
      await existingAdmin.save();
      logger.info(`Existing administrator account [${email}] credentials refreshed.`);
    } else {
      const newAdmin = new User({
        name,
        email,
        phone,
        password,
        district: 'New Delhi',
        state: 'Delhi',
        landHolding: 0,
        soilType: '',
        irrigationType: '',
        role: 'admin',
        status: 'active'
      });
      await newAdmin.save();
      logger.info(`Administrative account [${email}] successfully provisioned.`);
    }

    if (generatedPassword) {
      console.log('\n======================================================');
      console.log('  SECURE ADMIN CREDENTIALS GENERATED:');
      console.log(`  Email:    ${email}`);
      console.log(`  Password: ${password}`);
      console.log('  Role:     admin');
      console.log('  Please store this password in a secure password vault!');
      console.log('======================================================\n');
    } else {
      logger.info(`Admin provisioned with specified environment password.`);
    }

    await disconnectDB();
    process.exit(0);
  } catch (error: any) {
    if (error?.message?.includes('ECONNREFUSED') || error?.name === 'MongooseServerSelectionError') {
      console.error('\n[DATABASE CONNECTION REQUIRED]');
      console.error('Cannot provision live administrator account because MongoDB is offline or unreachable.');
      console.error('To provision a live MongoDB admin, ensure mongod is running locally (e.g., port 27017) or set MONGODB_URI in server/.env.');
      console.error('Note: In development demo mode (VITE_USE_MOCK_DATA=true), use the preconfigured Admin Demo profile without MongoDB.\n');
    }
    logger.error('Failed to provision administrator account:', error);
    process.exit(1);
  }
};

runAdminSeed();
