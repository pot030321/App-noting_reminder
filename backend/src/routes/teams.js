const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all teams
router.get("/", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM teams");
  res.json(rows);
});

// POST new team
router.post("/", async (req, res) => {
  const { name } = req.body;
  await db.query("INSERT INTO teams (name) VALUES (?)", [name]);
  res.sendStatus(201);
});

// DELETE a team
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await db.query("DELETE FROM teams WHERE id = ?", [id]);
  res.sendStatus(204);
});

module.exports = router;