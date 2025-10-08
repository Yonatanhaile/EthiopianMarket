/**
 * Quick script to make a user admin
 * Reads MONGO_URI from command line or uses localhost
 */

const mongoose = require('mongoose');
const User = require('./models/User');

const makeAdmin = async () => {
  const email = process.argv[2];
  const mongoUri = process.argv[3] || process.env.MONGO_URI || 'mongodb://localhost:27017/ethiopia-market';

  if (!email) {
    console.error('❌ Usage: node quick-make-admin.js <email> [mongo-uri]');
    console.error('Example: node quick-make-admin.js user@example.com');
    console.error('Or: node quick-make-admin.js user@example.com mongodb://localhost:27017/ethiopia-market');
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✓ MongoDB Connected');

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.error(`❌ User with email "${email}" not found`);
      console.log('\nAvailable users:');
      const allUsers = await User.find({}, 'name email role');
      allUsers.forEach(u => {
        console.log(`  - ${u.email} (${u.name}) - Role: ${u.role}`);
      });
      await mongoose.disconnect();
      process.exit(1);
    }

    console.log(`\n Found user:`);
    console.log(`  Name: ${user.name}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Current Role: ${user.role}`);

    if (user.role === 'admin') {
      console.log('\n✓ User is already an admin!');
      await mongoose.disconnect();
      process.exit(0);
    }

    user.role = 'admin';
    await user.save();

    console.log(`\n✅ SUCCESS! User is now an admin!`);
    console.log(`\n📝 NEXT STEPS:`);
    console.log(`  1. Logout from the application`);
    console.log(`  2. Login again with: ${user.email}`);
    console.log(`  3. Go to: http://localhost:3000/admin/yonatan321secure`);
    console.log(`  4. You should now have admin access!`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

makeAdmin();

