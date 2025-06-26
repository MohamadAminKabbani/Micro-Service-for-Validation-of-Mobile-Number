// database.js
const mongoose = require('mongoose');

const mongoURI = 'mongodb://localhost:27017/save_mobile_system';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', (err) => console.error('❌ MongoDB connection error:', err));
db.once('open', () => console.log('✅ Connected to MongoDB.'));

const mobileSystemSchema = new mongoose.Schema({
  users_name: { type: String, required: true },
  phone_nbr: { type: String, required: true, unique: true },
  description: String,
  operator_name: String,
  country_name: String,
  country_code: String,
});

const MobileSystem = mongoose.model('MOBILE_SYSTEM', mobileSystemSchema);

module.exports = MobileSystem;
