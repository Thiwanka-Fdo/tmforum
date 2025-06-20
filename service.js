const mongoose = require('mongoose');

// Sub-schemas
const PartyOrPartyRoleSchema = new mongoose.Schema({
  id: String,
  href: String,
  name: String,
  "@type": String,
  "@referredType": String
}, { _id: false });

const RelatedPartySchema = new mongoose.Schema({
  role: String,
  partyOrPartyRole: PartyOrPartyRoleSchema,
  "@type": String
}, { _id: false });

const RelatedPlaceSchema = new mongoose.Schema({
  role: String,
  place: {
    id: String,
    href: String,
    name: String,
    "@type": String,
    "@referredType": String
  },
  "@type": String
}, { _id: false });

const ServiceRelationshipSchema = new mongoose.Schema({
  relationshipType: String,
  service: {
    id: String,
    href: String,
    "@type": String,
    "@referredType": String
  },
  "@type": String
}, { _id: false });

const FeatureCharacteristicSchema = new mongoose.Schema({
  id: String,
  name: String,
  value: mongoose.Schema.Types.Mixed,
  valueType: String,
  "@type": String
}, { _id: false });

const FeatureSchema = new mongoose.Schema({
  id: String,
  name: String,
  isEnabled: Boolean,
  featureCharacteritic: [FeatureCharacteristicSchema],
  "@type": String
}, { _id: false });

const ServiceCharacteristicSchema = new mongoose.Schema({
  id: String,
  name: String,
  valueType: String,
  value: mongoose.Schema.Types.Mixed,
  "@type": String
}, { _id: false });

const NoteSchema = new mongoose.Schema({
  id: String,
  author: String,
  date: Date,
  text: String,
  "@type": String
}, { _id: false });

const ServiceSchema = new mongoose.Schema({
  serviceType: String,
  name: String,
  description: String,
  state: String,
  category: String,
  serviceSpecification: {
    id: String,
    href: String,
    name: String,
    version: String,
    "@type": String,
    "@referredType": String
  },
  feature: [FeatureSchema],
  serviceCharacteristic: [ServiceCharacteristicSchema],
  serviceRelationship: [ServiceRelationshipSchema],
  relatedParty: [RelatedPartySchema],
  place: [RelatedPlaceSchema],
  note: [NoteSchema],
  startDate: Date,
  endDate: Date,
  "@type": String
});

module.exports = mongoose.model("Service", ServiceSchema);
