// This example is built using express
const path = require("path");
const bodyParser = require("body-parser");
const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

const PORT = process.env.PORT || 80;
const API_KEY = process.env.API_KEY;
const PRIMER_API_URL = process.env.PRIMER_API_URL;

const app = express();

const staticDir = path.join(__dirname, "static");
const checkoutPage = path.join(__dirname, "static", "checkout.html");

app.use(bodyParser.json());
app.use("/static", express.static(staticDir));

app.get("/", (req, res) => {
  return res.sendFile(checkoutPage);
});

app.post("/client-token", async (req, res) => {
  const url = `${PRIMER_API_URL}/auth/client-token`;

  const response = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": API_KEY,
    },
  });

  const json = await response.json();

  return res.send(json);
});

app.post("/authorize", async (req, res) => {
  const { token } = req.body;
  const url = `${PRIMER_API_URL}/transactions/auth`;

  const orderId = "order-" + Math.random();

  const response = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": API_KEY,
      "Idempotency-Key": orderId, // Optionally add an idempotency key
    },
    body: JSON.stringify({
      //"paymentMethod": "tok_auth_declined_card",
      "paymentMethod": "tok_auth_authorized_card",
      "orderId": "order-" + Math.random(),
      "amount": 4999,
      "currencyCode": "EUR",
      //"merchantId": "testcompanyabcinc"
      //"merchantId": "acct_primer-test_1"
      "merchantId": "acct_1ITQuxG3MAI9pS1u"
    }),
  });
  
  console.log(token);
  const json = await response.json();
  console.log(json);

  return res.send(json);
});

console.log(`Checkout server listening on port ${PORT}`);
app.listen(PORT);
