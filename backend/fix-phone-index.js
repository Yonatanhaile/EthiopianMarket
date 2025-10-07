/**
 * Script to fix the phone number index issue
 * This drops the old non-sparse phone index and creates a new sparse one
 * 
 * Run with: node fix-phone-index.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const fixPhoneIndex = async () => {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI or MONGODB_URI not found in environment variables');
    }
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Get the User collection
    const User = mongoose.connection.collection('users');

    // Get existing indexes
    console.log('\n📋 Current indexes:');
    const indexes = await User.indexes();
    console.log(JSON.stringify(indexes, null, 2));

    // Drop the phone index if it exists (and is not sparse)
    console.log('\n🔧 Checking for phone index...');
    const phoneIndex = indexes.find(idx => idx.key && idx.key.phone);
    
    if (phoneIndex) {
      console.log('Found phone index:', phoneIndex);
      
      // Check if it's already sparse
      if (phoneIndex.sparse) {
        console.log('✅ Phone index is already sparse - no changes needed!');
      } else {
        console.log('⚠️  Phone index is NOT sparse - fixing...');
        
        // Drop the old index
        console.log('Dropping old phone index...');
        await User.dropIndex('phone_1');
        console.log('✅ Old index dropped');
        
        // Create new sparse index
        console.log('Creating new sparse phone index...');
        await User.createIndex({ phone: 1 }, { unique: true, sparse: true });
        console.log('✅ New sparse index created');
      }
    } else {
      console.log('No phone index found - creating sparse index...');
      await User.createIndex({ phone: 1 }, { unique: true, sparse: true });
      console.log('✅ Sparse phone index created');
    }

    // Verify the new indexes
    console.log('\n📋 Final indexes:');
    const newIndexes = await User.indexes();
    console.log(JSON.stringify(newIndexes, null, 2));

    console.log('\n✅ Phone index fix complete!');
    console.log('You can now register users without phone numbers.');
    
    // Close connection
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error fixing phone index:', error);
    process.exit(1);
  }
};

// Run the fix
fixPhoneIndex();

