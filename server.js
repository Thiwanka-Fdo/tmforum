require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Service = require('./models/service');

const app = express();
const port = process.env.PORT || 8638;
const basePath = '/tmf-api/serviceInventoryManagement/v5';

// <-- Add your external base URL here -->
const EXTERNAL_BASE_URL = 'https://tmforum-gjrc.onrender.com' + basePath;

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Utility: Create service ref
const createMinimalRelatedService = (req, serviceObj = {}) => {
  const id = serviceObj.id || 'unknown';
  return {
    id,
    href: serviceObj.href || `${EXTERNAL_BASE_URL}/service/${id}`,
    '@type': 'ServiceRef',
    '@referredType': 'Service',
    state: { value: serviceObj.state || 'active', '@type': 'ServiceStateType' },
    serviceSpecification: {
      id: serviceObj.serviceSpecification?.id || '1212',
      '@type': 'ServiceSpecificationRef',
    },
    serviceDate: serviceObj.serviceDate || new Date().toISOString(),
  };
};

// Health check
app.get(`${basePath}/health`, (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Debug (get all)
app.get(`${basePath}/debug`, async (req, res) => {
  const allServices = await Service.find({});
  res.status(200).json(allServices);
});

// GET all services
app.get(`${basePath}/service`, async (req, res) => {
  const { state, serviceDate, fields } = req.query;
  const projection = {};
  const filter = {};

  if (fields) {
    fields.split(',').forEach(f => projection[f] = 1);
  }

  if (state) filter.state = state;

  if (serviceDate) {
    const start = new Date(serviceDate);
    const end = new Date(serviceDate);
    end.setUTCHours(23, 59, 59, 999);
    filter.serviceDate = { $gte: start, $lte: end };
  }

  try {
    const services = await Service.find(filter, projection);
    const result = services.map(service => {
      const obj = service.toObject();
      obj.href = obj.href || `${EXTERNAL_BASE_URL}/service/${obj.id}`;
      obj['@type'] = obj['@type'] || 'Service';
      if (obj.serviceRelationship) {
        obj.serviceRelationship = obj.serviceRelationship.map(rel => ({
          ...rel,
          service: createMinimalRelatedService(req, rel.service || {}),
        }));
      }
      return obj;
    });
    res.json(result);
  } catch (err) {
    console.error('GET /service error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET by ID
app.get(`${basePath}/service/:id`, async (req, res) => {
  try {
    const service = await Service.findOne({ id: req.params.id });
    if (!service) return res.status(404).json({ error: 'Service not found' });

    let result = service.toObject();
    const fields = req.query.fields ? req.query.fields.split(',') : [];

    if (fields.length > 0) {
      result = {};
      fields.forEach(field => {
        if (service[field] !== undefined) result[field] = service[field];
      });
      result.id = service.id;
      result.href = service.href || `${EXTERNAL_BASE_URL}/service/${service.id}`;
      result['@type'] = service['@type'] || 'Service';
    }

    if (result.serviceRelationship) {
      result.serviceRelationship = result.serviceRelationship.map(rel => ({
        ...rel,
        service: createMinimalRelatedService(req, rel.service || {}),
      }));
    }

    res.json(result);
  } catch (err) {
    console.error('GET /service/:id error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST create
app.post(`${basePath}/service`, async (req, res) => {
  try {
    const {
      id,
      state,
      '@type': type,
      serviceSpecification,
      serviceRelationship = [],
      serviceDate,
      ...rest
    } = req.body;

    if (!type || !serviceSpecification?.id || !state) {
      return res.status(400).json({
        error: 'Missing required fields: @type, serviceSpecification.id, state',
      });
    }

    const serviceId = id || String(Date.now());

    const normalizedServiceRelationship = serviceRelationship.map(rel => ({
      ...rel,
      service: createMinimalRelatedService(req, rel.service || {}),
    }));

    const newService = new Service({
      id: serviceId,
      href: `${EXTERNAL_BASE_URL}/service/${serviceId}`,
      '@type': type,
      state,
      serviceSpecification,
      serviceRelationship: normalizedServiceRelationship,
      serviceDate: serviceDate || new Date().toISOString(),
      ...rest,
    });

    await newService.save();
    res.status(201).set('Location', newService.href).json(newService);
  } catch (err) {
    console.error('POST /service error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH update
app.patch(`${basePath}/service/:id`, async (req, res) => {
  try {
    const service = await Service.findOne({ id: req.params.id });
    if (!service) return res.status(404).json({ error: 'Service not found' });

    const {
      serviceRelationship = [],
      ...rest
    } = req.body;

    const normalizedServiceRelationship = serviceRelationship.map(rel => ({
      ...rel,
      service: createMinimalRelatedService(req, rel.service || {}),
    }));

    Object.assign(service, {
      ...rest,
      serviceRelationship: normalizedServiceRelationship,
    });

    await service.save();
    res.json(service);
  } catch (err) {
    console.error('PATCH /service/:id error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// <-- ADD DELETE endpoint -->
app.delete(`${basePath}/service/:id`, async (req, res) => {
  try {
    const deleted = await Service.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ error: 'Service not found' });
    res.status(204).send(); // No Content
  } catch (err) {
    console.error('DELETE /service/:id error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`🚀 TMF638 mock server running at port ${port}${basePath}`);
});
