import { db } from '../index.js';
import { ObjectId } from 'mongodb';

export async function getServices(req, res) {
  try {
    const services = await db.collection('services').find().toArray();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getService(req, res) {
  try {
    const service = await db.collection('services').findOne({ _id: new ObjectId(req.params.id) });
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function createService(req, res) {
  try {
    const { name, description, price, icon } = req.body;
    
    const result = await db.collection('services').insertOne({
      name,
      description,
      price,
      icon: icon || '📦',
      createdAt: new Date()
    });

    const service = await db.collection('services').findOne({ _id: result.insertedId });
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateService(req, res) {
  try {
    const { name, description, price, icon } = req.body;
    
    const result = await db.collection('services').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { name, description, price, icon } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const service = await db.collection('services').findOne({ _id: new ObjectId(req.params.id) });
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function deleteService(req, res) {
  try {
    const result = await db.collection('services').deleteOne({ _id: new ObjectId(req.params.id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({ message: 'Service deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}