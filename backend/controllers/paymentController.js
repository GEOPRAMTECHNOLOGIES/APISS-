import axios from 'axios';
import { db } from '../index.js';
import { ObjectId } from 'mongodb';

let cachedToken = null;
let tokenExpiry = 0;

async function getMpesaToken() {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString('base64');

  const response = await axios.get(
    `${process.env.MPESA_BASE}/oauth/v1/generate?grant_type=client_credentials`,
    {
      headers: {
        Authorization: `Basic ${auth}`
      }
    }
  );

  cachedToken = response.data.access_token;
  tokenExpiry = Date.now() + (response.data.expires_in * 1000) - 60000;
  return cachedToken;
}

export async function initiatePayment(req, res) {
  try {
    const { phone, amount, orderId, accountReference } = req.body;

    const token = await getMpesaToken();

    const timestamp = new Date()
      .toISOString()
      .replace(/[-T:.Z]/g, '')
      .slice(0, 14);

    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString('base64');

    const response = await axios.post(
      `${process.env.MPESA_BASE}/mpesa/stkpush/v1/processrequest`,
      {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: process.env.MPESA_TRANSACTION_TYPE || 'CustomerBuyGoodsOnline',
        Amount: amount,
        PartyA: phone,
        PartyB: process.env.MPESA_TILL_NUMBER,
        PhoneNumber: phone,
        CallBackURL: `${req.protocol}://${req.get('host')}/api/payments/callback`,
        AccountReference: accountReference || process.env.MPESA_ACCOUNT_REFERENCE,
        TransactionDesc: process.env.MPESA_TRANSACTION_DESC
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    await db.collection('orders').updateOne(
      { _id: new ObjectId(orderId) },
      { $set: { 
        merchantRequestId: response.data.MerchantRequestID,
        checkoutRequestId: response.data.CheckoutRequestID,
        status: 'processing'
      }}
    );

    res.json({
      success: true,
      message: 'Payment initiated. Check your phone.',
      data: response.data
    });
  } catch (error) {
    console.error('Payment error:', error.response?.data || error.message);
    res.status(500).json({ 
      success: false, 
      message: error.response?.data?.errorMessage || error.message 
    });
  }
}

export async function handleCallback(req, res) {
  try {
    const callback = req.body;
    const { Body: { stkCallback } } = callback;

    const order = await db.collection('orders').findOne({
      checkoutRequestId: stkCallback.CheckoutRequestID
    });

    if (order) {
      const status = stkCallback.ResultCode === 0 ? 'completed' : 'failed';
      
      await db.collection('orders').updateOne(
        { _id: order._id },
        { 
          $set: { 
            status,
            transactionId: stkCallback.MerchantRequestID,
            mpesaReceipt: stkCallback.CallbackMetadata?.Item?.find(
              i => i.Name === 'MpesaReceiptNumber'
            )?.Value,
            updatedAt: new Date()
          }
        }
      );
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Callback error:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function checkTransactionStatus(req, res) {
  try {
    const { checkoutRequestId } = req.params;
    
    const order = await db.collection('orders').findOne({ checkoutRequestId });
    
    if (!order) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({
      status: order.status,
      amount: order.amount,
      customerPhone: order.customerPhone,
      createdAt: order.createdAt
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}