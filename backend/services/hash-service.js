const crypto = require("crypto");

class HashService {
  hashOTP(data) {
    const hashedData = crypto
      .createHmac("sha256", process.env.HASH_SECRET)
      .update(data)
      .digest("hex");
    return hashedData;
  }
}

module.exports = new HashService();
