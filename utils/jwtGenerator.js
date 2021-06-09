const jwt = require("jsonwebtoken");
require("dotenv").config();

// changed the payload structure
function jwtGenerator(
  user_id,
  user_name,
  user_email,
  guests_name,
  guests_email
) {
  const payload = {
    user: {
      id: user_id,
      name: user_name,
      email: user_email,
      guestsName: guests_name,
      guests: guests_email,
    },
  };

  return jwt.sign(payload, process.env.jwtSecret, { expiresIn: "1hr" });
}

module.exports = jwtGenerator;
