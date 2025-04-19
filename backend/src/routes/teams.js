const express = require("express");
const router = express.Router();
const getDb = require("../db");

// GET all teams with member count and email info
router.get("/", async (req, res) => {
  try {
    const db = await getDb();
    const [teams] = await db.query(`
      SELECT t.*, COUNT(m.id) as member_count 
      FROM teams t 
      LEFT JOIN members m ON t.id = m.team_id 
      GROUP BY t.id
    `);
    res.json(teams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get teams" });
  }
});

// GET team details with members
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    const [team] = await db.query("SELECT * FROM teams WHERE id = ?", [id]);
    const [members] = await db.query(
      "SELECT id, name, email, phone FROM members WHERE team_id = ?", 
      [id]
    );
    res.json({ ...team[0], members });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get team details" });
  }
});

// POST new team
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    const db = await getDb();
    const [result] = await db.query("INSERT INTO teams (name) VALUES (?)", [name]);
    res.status(201).json({ id: result.insertId });
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
    
    // Get all member emails before deleting for notification purposes
    const [members] = await db.query(
      "SELECT email FROM members WHERE team_id = ?", 
      [id]
    );
    
    await db.query("DELETE FROM teams WHERE id = ?", [id]);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete team" });
  }
});

module.exports = router;