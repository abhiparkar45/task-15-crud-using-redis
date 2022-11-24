const app = require("./app");
const env = require("dotenv");
const client = require("./redisConfig");

client.connect();
env.config({ path: "./config/config.env" });

app.listen(process.env.PORT, () => {
  console.log(`server started on ${process.env.PORT}`);
});
