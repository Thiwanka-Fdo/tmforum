const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  id: String,
  href: String,
  '@type': String,
  name: String,
  description: String,
  state: String,
  serviceSpecification: {
    id: String,
    href: String,
    name: String,
    version: String,
    '@type': String,
    '@referredType': String
  },
  feature: [{
    id: String,
    isEnabled: Boolean,
    name: String,
    featureCharacteritic: [{
      id: String,
      name: String,
      value: mongoose.Schema.Types.Mixed,
      valueType: String,
      '@type': String
    }],
    '@type': String
  }],
  serviceCharacteristic: [{
    id: String,
    name: String,
    value: mongoose.Schema.Types.Mixed,
    valueType: String,
    '@type': String,
    '@schemaLocation': String
  }],
  serviceRelationship: [{
    relationshipType: String,
    service: {
      id: String,
      href: String,
      '@type': String,
      '@referredType': String
    },
    '@type': String
  }],
  relatedParty: [{
    role: String,
    partyOrPartyRole: {
      id: String,
      href: String,
      name: String,
      '@type': String,
      '@referredType': String
    },
    '@type': String
  }],
  place: [{
    role: String,
    place: {
      id: String,
      href: String,
      name: String,
      '@type': String,
      '@referredType': String
    },
    '@type': String
  }],
  note: [{
    id: String,
    author: String,
    date: String,
    text: String,
    '@type': String
  }],
  serviceDate: String
}, { versionKey: false });

module.exports = mongoose.model('Service', ServiceSchema);
