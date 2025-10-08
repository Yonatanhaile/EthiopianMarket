/**
 * Script to make the first user in database an admin
 * Usage: node make-first-user-admin.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const makeFirstUserAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ MongoDB Connected');

    // Find the first user (usually the one who registered first)
    const user = await User.findOne().sort({ createdAt: 1 });

    if (!user) {
      console.error('❌ No users found in database');
      console.log('Please register a user first, then run this script');
      process.exit(1);
    }

    console.log(`\nFound first user:`);
    console.log(`  Name: ${user.name}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Current Role: ${user.role}`);
    console.log(`  Registered: ${user.createdAt}`);

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
    console.log(`\n📝 IMPORTANT NEXT STEPS:`);
    console.log(`  1. Logout from the application`);
    console.log(`  2. Login again with this email: ${user.email}`);
    console.log(`  3. Go to: http://localhost:3000/admin/yonatan321secure`);
    console.log(`  4. You should now have admin access!`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

makeFirstUserAdmin();

