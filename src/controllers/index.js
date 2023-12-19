"use strict";

const bodyParser = require("body-parser");
const { app,receiver }= require('../app');

app.event("message", async ({ event, client, message, say }) => {
  await say(`Hey there <@${message.user}>!`);
});

receiver.router.use(bodyParser.json());
// Other web requests are methods on receiver.router
receiver.router.post("/webhook", gitNotifier);

receiver.router.post("/github-webhook/",(req, res) => {
    // You're working with an express req and res now.
    res.send("yay!");
  });
receiver.router.get("/hello", (req, res) => {
  // You're working with an express req and res now.
  res.send("yay!");
});

async function gitNotifier(req, res) {
  // Handle the POST request from another app
  const data = req.body;
  if (data) {
    console.log("Received POST request:", data);
    const event = req.headers["x-github-event"];
    if (event === "pull_request") {
      handlePullRequest(req.body);
    } else if (event === "push") {
      handlePush(req.body);
    }
  }

  res.sendStatus(200);
}
async function handlePullRequest(payload) {
  const pullRequest = payload.pull_request;
  console.log(
    `New Pull Request: ${pullRequest.title} (${pullRequest.html_url})`
  );
  await app.client.chat.postMessage({
    channel: "#general",
    text: `New Pull Request : ${pullRequest.title} by ${pullRequest.user.login} (${pullRequest.html_url})`,
  });
  console.log("hello");
}

async function handlePush(payload) {
  const commits = payload.commits;
  const result = [];
  commits.forEach((commit) => {
    console.log(`New Commit: ${commit.message} by ${commit.author.name}`);
    result.push({[commit.id] : `New Commit: ${commit.message} by ${commit.author.name}`})
  });
  await app.client.chat.postMessage({
    channel: "#general",
    text: JSON.stringify(result[0]),
  });
}
