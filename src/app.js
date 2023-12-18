"use strict";

const { App, ExpressReceiver } = require("@slack/bolt");

require("dotenv").config();


// Create a Bolt Receiver
const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

// Create the Bolt App, using the receiver
const app = new App({ 
  token: process.env.SLACK_BOT_TOKEN, 
  receiver,
});

module.exports = { app, receiver };