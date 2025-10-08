/**
 * Script to make a user an admin
 * Usage: node make-admin.js <email>
 * Example: node make-admin.js user@example.com
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const makeAdmin = async (email) => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ MongoDB Connected');

    if (!email) {
      console.error('❌ Error: Please provide an email address');
      console.log('Usage: node make-admin.js <email>');
      process.exit(1);
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.error(`❌ User with email "${email}" not found`);
      process.exit(1);
    }

    console.log(`\nFound user:`);
    console.log(`  Name: ${user.name}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Current Role: ${user.role}`);

    if (user.role === 'admin') {
      console.log('\n✓ User is already an admin!');
      process.exit(0);
    }

    // Update role to admin
    user.role = 'admin';
    await user.save();

    console.log(`\n✅ SUCCESS! User is now an admin!`);
    console.log(`  Name: ${user.name}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  New Role: ${user.role}`);
    console.log(`\n📝 IMPORTANT: Logout and login again to get admin access!`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

// Get email from command line arguments
const email = process.argv[2];
makeAdmin(email);

