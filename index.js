const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const pool = require("./db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const path = require("path");
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));
}

// register and login routes
app.use("/auth", require("./routes/jwtAuth"));

// dashboard route
app.use("/dashboard", require("./routes/dashboard"));

app.post("/request-password-reset", async (req, res) => {
  const { emailOfResetUser } = req.body;
  try {
    // check if user doesn't exist
    const user = await pool.query(
      "SELECT user_name, user_id FROM users WHERE user_email = $1",
      [emailOfResetUser]
    );

    // no account found with provided email
    if (user.rows.length === 0) {
      return res.status(401).json(false);
    }

    const getHashedPass = await pool.query(
      "SELECT user_password FROM users WHERE user_email = $1",
      [emailOfResetUser]
    );

    const hashedPass = getHashedPass.rows[0].user_password;
    const userid = user.rows[0].user_id;

    const secret = process.env.JWT_RESET_SECRET + hashedPass;

    const payload = {
      emailOfResetUser,
      userid,
    };

    const token = jwt.sign(payload, secret, { expiresIn: "15m" });
    const link = `http://localhost:3000/reset-password/${userid}/${token}`;

    res.json([user.rows, link]);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

app.get("/resetpassword/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  let user = await pool.query(
    "SELECT user_password FROM users WHERE user_id = $1",
    [id]
  );

  if (user.rows.length === 0) {
    return false;
  }

  const secret = process.env.JWT_RESET_SECRET + user.rows[0].user_password;
  try {
    jwt.verify(token, secret);
    res.json(true);
  } catch (err) {
    res.status(403).send(false);
    console.error(err.message);
  }
});

app.put("/resetpassword/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;
  try {
    let user = await pool.query(
      "SELECT user_password FROM users WHERE user_id = $1",
      [id]
    );

    if (user.rows.length === 0) {
      return false;
    }
    const secret = process.env.JWT_RESET_SECRET + user.rows[0].user_password;
    jwt.verify(token, secret);

    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptPassword = await bcrypt.hash(password, salt);

    let updatePassword = await pool.query(
      "UPDATE users SET user_password = $1 WHERE user_id = $2",
      [bcryptPassword, id]
    );

    res.json(true);
  } catch (err) {
    res.status(403).send("Not authorized");
    console.error(err.message);
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build/index.html"));
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
