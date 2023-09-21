const mongoose = require('mongoose');
const connectionURL = process.env.dbURL;


async function connectToDatabase() {
  try {
    await mongoose.connect(connectionURL,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log('Database connected successfully...');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
}

module.exports = connectToDatabase;
