const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const db = require("./src/db");
const emailService = require('./src/services/emailService');
// Add cron for scheduling
const cron = require('node-cron');
const { checkAndSendReminders } = require('./src/services/emailService');

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/teams", require("./src/routes/teams"));
app.use("/api/members", require("./src/routes/members"));
app.use("/api/tasks", require("./src/routes/tasks"));

// Check every minute for testing
cron.schedule('* * * * *', async () => {
    console.log('Checking for tasks to notify...');
    await checkAndSendReminders();
});

// Schedule task notifications
cron.schedule('0 9 * * *', async () => {
  try {
    const pool = await db();
    const [tasks] = await pool.query(`
      SELECT t.*, m.email, m.name 
      FROM tasks t 
      JOIN members m ON t.member_id = m.id 
      WHERE t.status = 'doing' 
      AND t.deadline = CURDATE() 
      AND m.notification_enabled = true 
      AND t.notification_sent = false
    `);

    for (const task of tasks) {
      if (task.email) {
        await emailService.sendTaskReminder(task.email, task);
        await pool.query('UPDATE tasks SET notification_sent = true WHERE id = ?', [task.id]);
      }
    }
  } catch (error) {
    console.error('Failed to send task notifications:', error);
  }
});

// Use a single port declaration
const PORT = process.env.PORT || 8080; // dùng PORT từ môi trường nếu có
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});


