const express = require("express");
const router = express.Router();
const getDb = require("../db");

// GET all tasks for a member
router.get("/member/:memberId", async (req, res) => {
  try {
    const { memberId } = req.params;
    const db = await getDb();
    const tasks = await db.all("SELECT * FROM tasks WHERE member_id = ?", [memberId]);
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get tasks" });
  }
});

// POST new task
router.post("/", async (req, res) => {
  try {
    const { description, deadline, status, member_id } = req.body;
    const db = await getDb();
    const result = await db.run(
      "INSERT INTO tasks (description, deadline, status, member_id) VALUES (?, ?, ?, ?)",
      [description, deadline, status || "doing", member_id]
    );
    res.status(201).json({ id: result.lastID });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create task" });
  }
});

// PUT update task status
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description, deadline, status } = req.body;
    const db = await getDb();
    await db.run(
      "UPDATE tasks SET description = ?, deadline = ?, status = ? WHERE id = ?",
      [description, deadline, status, id]
    );
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update task" });
  }
});

// DELETE a task
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    await db.run("DELETE FROM tasks WHERE id = ?", [id]);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

module.exports = router;