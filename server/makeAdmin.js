const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
const MONGODB_URI = 'mongodb://localhost:27017/mern-blog';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Import the User model
const User = require('./models/User');

async function makeUserAdmin() {
  try {
    // Find user by name 'Erick' (case insensitive)
    const user = await User.findOneAndUpdate(
      { name: /erick/i },
      { $set: { role: 'admin' } },
      { new: true }
    );

    if (!user) {
      console.log('No user found with name "Erick".');
      process.exit(1);
    }

    console.log(`Successfully updated user ${user.name} (${user.email}) to admin.`);
    process.exit(0);
  } catch (error) {
    console.error('Error making user admin:', error);
    process.exit(1);
  }
}

// Run the function
makeUserAdmin();
