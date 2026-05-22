import express from 'express';
import {
  initiatePayment,
  handleCallback,
  checkTransactionStatus
} from '../controllers/paymentController.js';

const router = express.Router();

router.post('/initiate', initiatePayment);
router.post('/callback', handleCallback);
router.get('/status/:checkoutRequestId', checkTransactionStatus);

export default router;