const mongoose = require('mongoose');
const User = require('../models/user.model');

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_PASSWORD) {
  console.error('ADMIN_PASSWORD environment variable is required');
  process.exit(1);
}

const DB_URI =
  process.env.DB_URI || `mongodb://127.0.0.1:27017/lttn-db`;

async function createAdmin() {
  try {
    await mongoose.connect(DB_URI);
    console.log('Database connected');

    const existing = await User.findOne({ username: ADMIN_USERNAME });
    if (existing) {
      console.log(`User "${ADMIN_USERNAME}" already exists (role: ${existing.user_role})`);
      if (existing.user_role !== 'admin') {
        existing.user_role = 'admin';
        await existing.save();
        console.log(`Updated role to "admin"`);
      }
    } else {
      await User.create({
        username: ADMIN_USERNAME,
        password: ADMIN_PASSWORD,
        user_role: 'admin',
      });
      console.log(`Admin user created successfully`);
      console.log(`  Username: ${ADMIN_USERNAME}`);
      console.log(`  Password: ${ADMIN_PASSWORD}`);
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('Database disconnected');
  }
}

createAdmin();
