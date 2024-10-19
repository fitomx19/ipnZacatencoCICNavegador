const express = require('express');
const router = express.Router();
const addressService = require('../services/addressService');

router.post('/', async (req, res) => {
  try {
    const address = await addressService.createAddress(req.body);
    res.status(201).json(address);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const addresses = await addressService.getAllAddresses();
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/category/:category', async (req, res) => {
    try {
      const addresses = await addressService.getAddressesByCategory(req.params.category);
      res.json(addresses);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  module.exports = router;

router.get('/:id', async (req, res) => {
  try {
    const address = await addressService.getAddressById(req.params.id);
    if (!address) return res.status(404).json({ message: 'Address not found' });
    res.json(address);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const address = await addressService.updateAddress(req.params.id, req.body);
    if (!address) return res.status(404).json({ message: 'Address not found' });
    res.json(address);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const address = await addressService.deleteAddress(req.params.id);
    if (!address) return res.status(404).json({ message: 'Address not found' });
    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;