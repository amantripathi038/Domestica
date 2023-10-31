const { createTransport } = require("nodemailer");
const AppError = require('./appError');
const emailer = async ({ emailId, message }) => {

    const transporter = createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    // Use HTML content for styling
    const mailOptions = {
        from: process.env.SMTP_SENDER_EMAIL,
        to: emailId,
        subject: `Welcome to Domestica - The Home Service App`,
        // Use HTML formatting for email content
        html: message
    };
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log("Email sent: " + info.response);
        }
    });
}

module.exports = emailer;