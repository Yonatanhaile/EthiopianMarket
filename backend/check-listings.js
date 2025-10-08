/**
 * Diagnostic script to check listings in database
 * Usage: node check-listings.js [email]
 */

const mongoose = require('mongoose');
const User = require('./models/User');
const Listing = require('./models/Listing');

const checkListings = async () => {
  const email = process.argv[2];
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/ethiopia-market';

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✓ MongoDB Connected\n');

    if (email) {
      // Check specific user's listings
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        console.error(`❌ User with email "${email}" not found`);
        await mongoose.disconnect();
        process.exit(1);
      }

      console.log('👤 User Info:');
      console.log(`   Name: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   ID: ${user._id}`);
      console.log(`   Role: ${user.role}\n`);

      const listings = await Listing.find({ seller: user._id }).sort('-createdAt');
      
      console.log(`📦 Total Listings: ${listings.length}\n`);

      if (listings.length === 0) {
        console.log('   No listings found for this user\n');
      } else {
        listings.forEach((listing, index) => {
          console.log(`${index + 1}. ${listing.title}`);
          console.log(`   ID: ${listing._id}`);
          console.log(`   Status: ${listing.status}`);
          console.log(`   Created: ${listing.createdAt}`);
          console.log('');
        });
      }

      // Count by status
      const pending = listings.filter(l => l.status === 'pending').length;
      const active = listings.filter(l => l.status === 'active').length;
      const rejected = listings.filter(l => l.status === 'rejected').length;

      console.log('📊 Status Breakdown:');
      console.log(`   ⏳ Pending: ${pending}`);
      console.log(`   ✅ Active: ${active}`);
      console.log(`   ❌ Rejected: ${rejected}`);
      console.log('');

    } else {
      // Show all listings
      const allListings = await Listing.find().populate('seller', 'name email').sort('-createdAt').limit(20);
      
      console.log(`📦 Recent Listings (Last 20):\n`);

      if (allListings.length === 0) {
        console.log('   No listings found in database\n');
      } else {
        allListings.forEach((listing, index) => {
          console.log(`${index + 1}. ${listing.title}`);
          console.log(`   Status: ${listing.status}`);
          console.log(`   Seller: ${listing.seller?.name || 'Unknown'} (${listing.seller?.email || 'N/A'})`);
          console.log(`   Created: ${listing.createdAt}`);
          console.log('');
        });
      }

      // Overall stats
      const total = await Listing.countDocuments();
      const pending = await Listing.countDocuments({ status: 'pending' });
      const active = await Listing.countDocuments({ status: 'active' });
      const rejected = await Listing.countDocuments({ status: 'rejected' });

      console.log('📊 Database Summary:');
      console.log(`   Total: ${total}`);
      console.log(`   ⏳ Pending: ${pending}`);
      console.log(`   ✅ Active: ${active}`);
      console.log(`   ❌ Rejected: ${rejected}`);
      console.log('');
    }

    await mongoose.disconnect();
    console.log('✅ Done!\n');
    
    if (email) {
      console.log('💡 NEXT STEPS:');
      console.log('   1. If you see pending listings here but not in the dashboard:');
      console.log('      → Backend server needs restart');
      console.log('   2. If no pending listings exist:');
      console.log('      → Create a new listing to test');
      console.log('   3. Check browser console for API response');
      console.log('   4. Check Network tab for the API call');
    } else {
      console.log('💡 To check a specific user:');
      console.log('   node check-listings.js user@example.com');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

checkListings();

