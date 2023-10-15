const crypto = require("crypto");
const HashService = require("./hash-service");
const smsSID = process.env.SMS_SID;
const smsAuthToken = process.env.SMS_AUTH_TOKEN;
const twilio = require("twilio")(smsSID, smsAuthToken, {
  lazyLoading: true,
});
class Otpservice {
  async generateOTP() {
    return crypto.randomInt(1000, 9999);
  }

  async sendBySMS(phone, otp) {
    return await twilio.messages.create({
      to: phone,
      from: process.env.SMS_FROM_NUMBER,
      body: `Your codershouse OTP is ${otp}, Valid for 5 minutes only.`,
    });
  }
  verifyOTP(hashedOTP, data) {
    let computedHash = HashService.hashOTP(data);
    return hashedOTP === computedHash;
  }
}

module.exports = new Otpservice();
