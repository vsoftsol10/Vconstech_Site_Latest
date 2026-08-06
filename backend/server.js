const app = require("./app");
const { env } = require("./config/env");

const server = app.listen(env.port, () => {
  console.log(`🚀 Vconstech backend running on port ${env.port}`);
});

process.on("SIGTERM", () => {
  server.close(() => {
    console.log("Vconstech backend server closed");
  });
});