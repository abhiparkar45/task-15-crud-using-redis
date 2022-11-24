const redis = require("redis");
const client = redis.createClient(6379);

client.on("connect", () => {
  console.log(`connected to redis !`);
});

client.on("ready", () => {
  console.log(`connected to redis and ready !`);
});

client.on("error", (err) => {
  console.log(`Error occured : ${err}`);
});

module.exports = client;
