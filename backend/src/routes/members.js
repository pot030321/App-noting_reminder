const express = require("express");
const router = express.Router();
const getDb = require("../db");

// GET all members of a team
router.get("/team/:teamId", async (req, res) => {
  try {
    const { teamId } = req.params;
    const db = await getDb();
    const members = await db.all("SELECT * FROM members WHERE team_id = ?", [teamId]);
    res.json(members);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get members" });
  }
});

// POST new member
router.post("/", async (req, res) => {
  try {
    const { name, team_id } = req.body;
    const db = await getDb();
    const result = await db.run(
      "INSERT INTO members (name, team_id) VALUES (?, ?)",
      [name, team_id]
    );
    res.status(201).json({ id: result.lastID });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create member" });
  }
});

// DELETE a member
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    await db.run("DELETE FROM members WHERE id = ?", [id]);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete member" });
  }
});

module.exports = router;