// const app = require("./app");
// const { env } = require("./config/env");

// const server = app.listen(env.port, () => {
//   console.log(`Vconstech backend running on port ${env.port}`);
// });

// process.on("SIGTERM", () => {
//   server.close(() => {
//     console.log("Vconstech backend server closed");
//   });
// });
const app = require("./app");
const { env } = require("./config/env");
const { verifyTransporter } = require("./config/mail");

(async () => {
  try {
    await verifyTransporter();
    console.log("✅ Brevo SMTP Connected Successfully");
  } catch (error) {
    console.error("❌ Brevo SMTP Connection Failed");
    console.error(error.message);
  }

  const server = app.listen(env.port, () => {
    console.log(`Vconstech backend running on port ${env.port}`);
  });

  process.on("SIGTERM", () => {
    server.close(() => {
      console.log("Vconstech backend server closed");
    });
  });
})();