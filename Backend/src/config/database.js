const dns = require('dns');
const mongoose = require('mongoose');

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is required in the environment');
  }

  // Force a reliable DNS server for SRV lookups, which is required for
  // mongodb+srv Atlas connection strings on some Windows setups.
  dns.setServers(['8.8.8.8', '1.1.1.1']);

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message || err);
    console.error(err.stack || '');
    process.exit(1);
  }
};

module.exports = connectDB;