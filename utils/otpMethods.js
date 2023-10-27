const emailer = require('./emailer');

module.exports.generateOTP = () => {
    const otp = Math.floor(Math.random() * 900000) + 100000;
    return otp.toString(); // Convert it to a string
}

module.exports.verifyOTP = (savedOTP, enteredOTP) => {
    if (savedOTP === enteredOTP * 1) return true;
    return false;
}

module.exports.sendOTP = async (OTP, email) => {
    const message = `Hello,<br/>Your one time password for registering on Domestica is <strong>${OTP}</strong>.
    <br/>Please do not share this with anyone else.<br/><br/><br/><br/><br/>Thanks & Regards<br/>
    <strong>Domestica - The Home Service App</strong>`
    emailer({ emailId: email, message: message });
}