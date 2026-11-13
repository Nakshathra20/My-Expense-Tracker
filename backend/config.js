// Loads the settings from the .env file into process.env
require("dotenv").config();

// Stop early with a clear message if the secret is missing
if (!process.env.JWT_SECRET) {
  console.error(".env file is missing.");
  process.exit(1);
}

module.exports = {
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET,
};