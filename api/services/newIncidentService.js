const Incident = require('../models/incidentModel');

exports.reportIncident = async (req, res) => {
  try {
    const { latitude, longitude, description, details } = req.body;
    const newIncident = new Incident({
      latitude,
      longitude,
      description,
      details
    });
    await newIncident.save();
    res.status(201).json({ message: 'Incidente reportado exitosamente', incident: newIncident });
  } catch (error) {
    res.status(400).json({ message: 'Error al reportar el incidente', error: error.message });
  }
};

exports.getIncidents = async (req, res) => {
  try {
    const incidents = await Incident.find().sort('-reportedAt');
    res.status(200).json(incidents);
  } catch (error) {
    res.status(400).json({ message: 'Error al obtener los incidentes', error: error.message });
  }
};