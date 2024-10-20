const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  latitude: {
    type: Number,
    required: [true, 'Latitude is required']
  },
  longitude: {
    type: Number,
    required: [true, 'Longitude is required']
  },
  description: {
    type: String,
    default: 'Incidente reportado'
  },
  reportedAt: {
    type: Date,
    default: Date.now
  },
  resolved: {
    type: Boolean,
    default: false
  },
  details: {
    type: String
  }
});

module.exports = mongoose.model('Incident', incidentSchema);