const express = require("express");
const router = express.Router();
const getDb = require("../db");

// GET all tasks for a member
router.get("/member/:memberId", async (req, res) => {
  try {
    const { memberId } = req.params;
    const db = await getDb();

    const [tasks] = await db.query("SELECT * FROM tasks WHERE member_id = ?", [memberId]);
    const [memberRows] = await db.query("SELECT name, phone, email FROM members WHERE id = ?", [memberId]);
    const member = memberRows[0] || null;

    res.json({ tasks, member });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get tasks and member" });
  }
});

// POST new task
router.post("/", async (req, res) => {
  try {
    const { description, deadline, deadlineTime, notificationTime, status, member_id, companyBranch } = req.body;
    const db = await getDb();
    
    // Combine date and time
    const deadlineDateTime = `${deadline}T${deadlineTime}`;
    
    const [result] = await db.query(
      "INSERT INTO tasks (description, deadline, notification_time, status, member_id, company_branch) VALUES (?, ?, ?, ?, ?, ?)",
      [description, deadlineDateTime, notificationTime, status || "doing", member_id, companyBranch]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create task" });
  }
});

// PUT update task
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let { description, deadline, status, companyBranch } = req.body;

    if (deadline) {
      deadline = deadline.split("T")[0]; // Fix format lỗi MySQL
    }

    const db = await getDb();
    await db.query(
      "UPDATE tasks SET description = ?, deadline = ?, status = ?, company_branch = ? WHERE id = ?",
      [description, deadline, status, companyBranch, id]
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
    await db.query("DELETE FROM tasks WHERE id = ?", [id]);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

module.exports = router;
