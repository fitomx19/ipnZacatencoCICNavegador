const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  name: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  description: { type: String },
  category: { type: String, required: true },
});

module.exports = mongoose.model('Address', addressSchema);