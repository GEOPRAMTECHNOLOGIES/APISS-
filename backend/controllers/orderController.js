import { db } from '../index.js';
import { ObjectId } from 'mongodb';

export async function createOrder(req, res) {
  try {
    const { serviceId, customerName, customerEmail, customerPhone, amount } = req.body;

    const order = {
      serviceId: new ObjectId(serviceId),
      customerName,
      customerEmail,
      customerPhone,
      amount,
      status: 'pending',
      transactionId: null,
      createdAt: new Date()
    };

    const result = await db.collection('orders').insertOne(order);
    const newOrder = await db.collection('orders').findOne({ _id: result.insertedId });

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getUserOrders(req, res) {
  try {
    const orders = await db.collection('orders')
      .find({ customerEmail: req.user.email })
      .sort({ createdAt: -1 })
      .toArray();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getAllOrders(req, res) {
  try {
    const orders = await db.collection('orders')
      .find()
      .sort({ createdAt: -1 })
      .toArray();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateOrderStatus(req, res) {
  try {
    const { status, transactionId } = req.body;

    const result = await db.collection('orders').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status, transactionId } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = await db.collection('orders').findOne({ _id: new ObjectId(req.params.id) });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}