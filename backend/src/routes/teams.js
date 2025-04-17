const express = require("express");
const router = express.Router();
const getDb = require("../db");

// GET all teams
router.get("/", async (req, res) => {
  try {
    const db = await getDb();
    const teams = await db.all("SELECT * FROM teams");
    res.json(teams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get teams" });
  }
});

// POST new team
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    const db = await getDb();
    const result = await db.run("INSERT INTO teams (name) VALUES (?)", [name]);
    res.status(201).json({ id: result.lastID });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create team" });
  }
});

// DELETE a team
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    await db.run("DELETE FROM teams WHERE id = ?", [id]);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete team" });
  }
});

module.exports = router;