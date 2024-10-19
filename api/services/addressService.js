const Address = require('../models/addressModel');

exports.createAddress = async (addressData) => {
  return await Address.create(addressData);
};

exports.getAllAddresses = async () => {
  return await Address.find();
};

exports.getAddressesByCategory = async (category) => {
  return await Address.find({ category });
};

exports.getAddressById = async (id) => {
  return await Address.findById(id);
};

exports.updateAddress = async (id, addressData) => {
  return await Address.findByIdAndUpdate(id, addressData, { new: true });
};

exports.deleteAddress = async (id) => {
  return await Address.findByIdAndDelete(id);
};