const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validInfo");
const authorization = require("../middleware/authorization");

// register route
router.post("/register/", validInfo, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);

    if (user.rows.length !== 0) {
      return res.status(401).json("User already exists.");
    }

    // bcrypt users password
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptPassword = await bcrypt.hash(password, salt);

    // enter new user into db
    const newUser = await pool.query(
      "INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, bcryptPassword]
    );

    // generated jwt token
    const token = jwtGenerator(
      newUser.rows[0].user_id,
      newUser.rows[0].user_name,
      newUser.rows[0].user_email,
      newUser.rows[0].guests_name,
      newUser.rows[0].guests_email
    );

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error -register");
  }
});

// for registering from an invitation
router.post(
  "/guest-register/:guestsemail/:guestsname",
  validInfo,
  async (req, res) => {
    try {
      let { guestsemail, guestsname } = req.params;

      guestsname = guestsname.replace(/-/g, " ");

      const { name, email, password } = req.body;
      const user = await pool.query(
        "SELECT * FROM users WHERE user_email = $1",
        [email]
      );

      if (user.rows.length !== 0) {
        return res.status(401).json("User already exists.");
      }

      // bcrypt users password
      const saltRound = 10;
      const salt = await bcrypt.genSalt(saltRound);
      const bcryptPassword = await bcrypt.hash(password, salt);

      // enter new user into db
      const newUser = await pool.query(
        "INSERT INTO users (user_name, user_email, user_password, guests_email, guests_name) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [name, email, bcryptPassword, guestsemail, guestsname]
      );

      // generated jwt token
      const token = jwtGenerator(
        newUser.rows[0].user_id,
        newUser.rows[0].user_name,
        newUser.rows[0].user_email,
        newUser.rows[0].guests_name,
        newUser.rows[0].guests_email
      );

      res.json({ token });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// login route
router.post("/login", validInfo, async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if user doesn't exist
    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json("Email or password is incorrect");
    }

    // check if incoming password is same as db password
    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].user_password
    );

    if (!validPassword) {
      return res.status(401).json("Email or password is incorrect");
    }

    const editor = await pool.query(
      "SELECT guests_email FROM users WHERE user_email = $1",
      [email]
    );

    const editorGuests_email = editor.rows[0].guests_email;

    const token = jwtGenerator(
      user.rows[0].user_id,
      user.rows[0].user_name,
      user.rows[0].user_email,
      user.rows[0].guests_name,
      editorGuests_email
    );
    res.json({ token });
  } catch (err) {
    res.status(500).send("Server Error :( -login");
    console.error(err.message);
  }
});

router.get("/is-verified", authorization, async (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    res.status(500).send("Server Error -isverified");
    console.error(err.message);
  }
});

module.exports = router;
