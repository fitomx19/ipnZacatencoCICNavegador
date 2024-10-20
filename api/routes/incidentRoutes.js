const express = require('express');
const router = express.Router();
const incidentController = require('../services/newIncidentService');

router.post('/report', incidentController.reportIncident);
router.get('/', incidentController.getIncidents);

module.exports = router;