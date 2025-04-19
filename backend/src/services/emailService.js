const nodemailer = require('nodemailer');
const getDb = require('../db');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Add this for debugging
const sendTaskReminder = async (userEmail, taskDetails) => {
    try {
        console.log('Attempting to send email to:', userEmail);
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: 'Task Reminder',
            html: `
                <h2>Task Reminder</h2>
                <p>Task: ${taskDetails.description}</p>
                <p>Deadline: ${new Date(taskDetails.deadline).toLocaleString('vi-VN')}</p>
            `
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', result);
        return true;
    } catch (error) {
        console.error('Failed to send email:', error);
        return false;
    }
};

// New function to check and send reminders for upcoming deadlines
const checkAndSendReminders = async () => {
    try {
        const db = await getDb();
        const now = new Date();
        
        // Get tasks where current time + notification_time = deadline
        const [tasks] = await db.query(`
            SELECT t.*, m.email, m.name 
            FROM tasks t 
            JOIN members m ON t.member_id = m.id 
            WHERE t.status = 'doing' 
            AND DATE_SUB(t.deadline, INTERVAL t.notification_time MINUTE) <= NOW()
            AND t.notification_sent = false
            AND m.notification_enabled = true
        `);

        for (const task of tasks) {
            if (task.email) {
                await sendTaskReminder(task.email, task);
                await db.query('UPDATE tasks SET notification_sent = true WHERE id = ?', [task.id]);
            }
        }
    } catch (error) {
        console.error('Failed to check and send reminders:', error);
    }
};

module.exports = {
    sendTaskReminder,
    checkAndSendReminders
};