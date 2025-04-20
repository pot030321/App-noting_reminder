const nodemailer = require('nodemailer');
const getDb = require('../db');

// Cấu hình transporter với debug + TLS
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    },
    logger: true,
    debug: true
});

// Gửi email nhắc việc
const sendTaskReminder = async (userEmail, taskDetails) => {
    try {
        console.log('Attempting to send email to:', userEmail);
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: 'Task Reminder',
            html: `
                <h2>🕑 Task Reminder</h2>
                <p><strong>Task:</strong> ${taskDetails.description}</p>
                <p><strong>Deadline:</strong> ${new Date(taskDetails.deadline).toLocaleString('vi-VN')}</p>
            `
        };

        const result = await transporter.sendMail(mailOptions);

        console.log('✅ Email sent successfully!');
        console.log('Accepted:', result.accepted);
        console.log('Rejected:', result.rejected);
        return true;
    } catch (error) {
        console.error('❌ Failed to send email');
        console.error('Error message:', error.message);
        if (error.response) console.error('SMTP response:', error.response);
        if (error.code) console.error('Error code:', error.code);
        return false;
    }
};

// Hàm kiểm tra và gửi nhắc nhở
const checkAndSendReminders = async () => {
    try {
        const db = await getDb();
        const now = new Date();

        const [tasks] = await db.query(`
            SELECT t.*, m.email, m.name 
            FROM tasks t 
            JOIN members m ON t.member_id = m.id 
            WHERE t.status = 'doing' 
            AND DATE_SUB(t.deadline, INTERVAL t.notification_time MINUTE) <= NOW()
            AND t.notification_sent = false
            AND m.notification_enabled = true
        `);

        console.log(`📝 Found ${tasks.length} task(s) needing reminder`);

        for (const task of tasks) {
            if (task.email) {
                const sent = await sendTaskReminder(task.email, task);
                if (sent) {
                    await db.query('UPDATE tasks SET notification_sent = true WHERE id = ?', [task.id]);
                }
            }
        }
    } catch (error) {
        console.error('❌ Failed to check and send reminders:', error.message);
    }
};

module.exports = {
    sendTaskReminder,
    checkAndSendReminders
};
