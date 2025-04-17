const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all members by team_id
router.get("/team/:teamId", async (req, res) => {
  const { teamId } = req.params;
  const [rows] = await db.query("SELECT * FROM members WHERE team_id = ?", [teamId]);
  res.json(rows);
});

// POST new member
router.post("/", async (req, res) => {
  const { name, team_id } = req.body;
  await db.query("INSERT INTO members (name, team_id) VALUES (?, ?)", [name, team_id]);
  res.sendStatus(201);
});

// DELETE member
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await db.query("DELETE FROM members WHERE id = ?", [id]);
  res.sendStatus(204);
});

module.exports = router;