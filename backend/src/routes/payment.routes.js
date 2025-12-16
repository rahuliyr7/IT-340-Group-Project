// routes/payment.routes.js
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const CLIENT_ID = 'YOUR_PAYPAL_CLIENT_ID';     // From PayPal developer dashboard
const SECRET = 'YOUR_PAYPAL_SECRET';
const API = 'https://api-m.sandbox.paypal.com'; // Change to live in production

async function getToken() {
  const auth = Buffer.from(`${CLIENT_ID}:${SECRET}`).toString('base64');
  const res = await fetch(`${API}/v1/oauth2/token`, {
    method: 'POST',
    headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials'
  });
  const data = await res.json();
  return data.access_token;
}

router.post('/create-order', async (req, res) => {
  const { amount } = req.body;
  const token = await getToken();
  const response = await fetch(`${API}/v2/checkout/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [{ amount: { currency_code: 'USD', value: amount } }],
      application_context: { brand_name: 'Atlantic Auctions', user_action: 'PAY_NOW' }
    })
  });
  const order = await response.json();
  res.json(order);
});

router.post('/capture-order', async (req, res) => {
  const { orderID } = req.body;
  const token = await getToken();
  const response = await fetch(`${API}/v2/checkout/orders/${orderID}/capture`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });
  const result = await response.json();
  res.json(result);
});

module.exports = router;
