const { createTransport } = require("nodemailer");
const AppError = require('./appError');
const emailer = async ({ emailId, message }) => {

    const transporter = createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        auth: {
            user: "domesticabiz@gmail.com",
            pass: "zCIjgAZcr7KEVsXP",
        },
    });

    // Use HTML content for styling
    const mailOptions = {
        from: "domesticabiz@gmail.com",
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