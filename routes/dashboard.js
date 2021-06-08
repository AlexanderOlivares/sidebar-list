const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

// all items
router.get("/", authorization, async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT creator, creator_name, editors_name, item_id, description FROM list_item WHERE creator = $1 OR editors = $1",
      [req.user.email]
    );
    res.json(user.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json(err.message);
  }
});

// test to get just user name
router.get("/name-email", authorization, async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT user_name, user_email, guests_name FROM users WHERE user_id = $1",
      [req.user.id]
    );
    res.json(user.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json(err.message);
  }
});

// create an item
router.post("/items", authorization, async (req, res) => {
  try {
    const { description } = req.body;
    const newItem = await pool.query(
      "INSERT INTO list_item (user_id, description, creator, creator_name, editors, editors_name) VALUES($1, $2, $3, $4, $5, $6) RETURNING *",
      [
        req.user.id,
        description,
        req.user.email,
        req.user.name,
        req.user.guests,
        req.user.guestsName,
      ]
    );
    res.json(newItem.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// update item
router.put("/items/:id", authorization, async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const updateItem = await pool.query(
      "UPDATE list_item SET description = $1 WHERE (item_id = $2) AND (editors = $3 OR editors = $4 OR creator = $3 OR creator = $4) RETURNING *",
      [description, id, req.user.guests, req.user.email]
    );

    if (updateItem.rows.length === 0) {
      return res.json("Not authorized to edit this item");
    }

    res.json("item updated");
  } catch (err) {
    console.error(err.message);
  }
});

// delete item
router.delete("/items/:id", authorization, async (req, res) => {
  try {
    const { id } = req.params;
    const deleteItem = await pool.query(
      "DELETE FROM list_item WHERE (item_id = $1) AND (editors = $2 OR editors = $3 OR creator = $2 OR creator = $3) RETURNING *",
      [id, req.user.email, req.user.guests]
    );

    if (deleteItem.rows.length === 0) {
      return res.json("You are not authorized to delete this item");
    }

    res.json("Item deleted");
  } catch (err) {
    console.error(err.message);
  }
});

router.put("/invite", authorization, async (req, res) => {
  let { editors_name, editors, creator } = req.body;
  // decode creator's email
  let buff = Buffer.from(creator, "base64");
  creator = buff.toString("utf-8");
  try {
    const addEditorsToList_item = await pool.query(
      "UPDATE list_item SET editors = $1, editors_name = $2 WHERE creator = $3",
      [editors, editors_name, creator]
    );

    res.json("editor added");
  } catch (err) {
    console.error(err.message);
  }

  try {
    const updateUsersTable = await pool.query(
      "UPDATE users SET guests_email = $1, guests_name = $2 WHERE user_email = $3",
      [editors, editors_name, creator]
    );
  } catch (error) {
    console.error(err.message);
  }
});

module.exports = router;
