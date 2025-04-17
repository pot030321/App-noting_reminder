const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all tasks by member_id
router.get("/member/:memberId", async (req, res) => {
  const { memberId } = req.params;
  const [rows] = await db.query("SELECT * FROM tasks WHERE member_id = ?", [memberId]);
  res.json(rows);
});

// POST new task
router.post("/", async (req, res) => {
  const { description, deadline, status, member_id } = req.body;
  await db.query(
    "INSERT INTO tasks (description, deadline, status, member_id) VALUES (?, ?, ?, ?)",
    [description, deadline, status, member_id]
  );
  res.sendStatus(201);
});

// UPDATE task status or content
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { description, deadline, status } = req.body;
  await db.query(
    "UPDATE tasks SET description = ?, deadline = ?, status = ? WHERE id = ?",
    [description, deadline, status, id]
  );
  res.sendStatus(200);
});

// DELETE task
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await db.query("DELETE FROM tasks WHERE id = ?", [id]);
  res.sendStatus(204);
});

module.exports = router;