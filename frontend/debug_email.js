import 'dotenv/config';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port: process.env.SMTP_PORT || 465,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    debug: true, // Enable debug output
    logger: true  // Log information to console
});

async function sendTestEmail() {
    console.log('Testing SMTP Connection...');
    console.log(`Host: ${process.env.SMTP_HOST}`);
    console.log(`User: ${process.env.SMTP_USER}`);

    try {
        const info = await transporter.sendMail({
            from: `"Test Debugger" <${process.env.SMTP_USER}>`,
            to: process.env.SMTP_USER, // Send to self
            subject: 'TimelinePlus SMTP Test',
            text: 'If you receive this, the SMTP configuration is working correctly.',
            html: '<b>SMTP Test Success</b>'
        });

        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error('Error occurred:', error);
    }
}

sendTestEmail();
