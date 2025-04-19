const express = require("express");
const router = express.Router();
const getDb = require("../db");

// GET all members of a team
router.get("/team/:teamId", async (req, res) => {
  try {
    const { teamId } = req.params;
    const db = await getDb();
    const [members] = await db.query("SELECT * FROM members WHERE team_id = ?", [teamId]);
    res.json(members);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get members" });
  }
});

// POST new member
router.post("/", async (req, res) => {
  try {
    const { name, team_id, phone, email } = req.body;
    const db = await getDb();
    const [result] = await db.query(
      "INSERT INTO members (name, team_id, phone, email) VALUES (?, ?, ?, ?)",
      [name, team_id, phone, email]
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
    await db.query("DELETE FROM members WHERE id = ?", [id]);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete member" });
  }
});

// Add this route to handle member updates
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, email } = req.body;
    const db = await getDb();
    
    await db.query(
      "UPDATE members SET name = ?, phone = ?, email = ? WHERE id = ?",
      [name, phone, email, id]
    );
    
    res.json({ message: "Member updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update member" });
  }
});

module.exports = router;