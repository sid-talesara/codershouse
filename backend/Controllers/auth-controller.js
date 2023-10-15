const Otpservice = require("../services/otp-service");
const HashService = require("../services/hash-service");
const userService = require("../services/user-service");
const tokenService = require("../services/token-service");
const UserDto = require("../dltos/user-dlto");

class AuthController {
  async sendOTP(req, res) {
    const { phone } = req.body;
    if (!phone) return res.status(400).json("Phone number is required");

    const otp = await Otpservice.generateOTP();
    // Hash OTP
    const ttl = 1000 * 60 * 100; //100 minutes (for testing only) otherwise 5 minutes
    const expires = Date.now() + ttl;
    const data = `${phone}.${otp}.${expires}`;
    const hash = HashService.hashOTP(data);

    // Send OTP
    try {
      // await Otpservice.sendBySMS(phone, otp);

      return res.json({ phone, hash: `${hash}.${expires}`, otp }); // For testing
    } catch (error) {
      console.log("Error sending OTP", error);
      res.status(500).json({ message: "Failed to send OTP" });
    }
    res.json({ hash: hash });
  }
  async verifyOTP(req, res) {
    const { otp, phone, hash } = req.body;

    if (!otp || !phone || !hash) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const [hashedOTP, expires] = hash.split(".");
    if (Date.now() > +expires) {
      res.status(400).json({ message: "OTP expired" });
    }

    const data = `${phone}.${otp}.${expires}`;

    const isValid = Otpservice.verifyOTP(hashedOTP, data);

    if (!isValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    let user;

    try {
      user = await userService.findUser({ phone });
      if (!user) {
        user = await userService.createUser({ phone });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Db error" });
    }

    // Token
    const { accessToken, refreshToken } = tokenService.generateTokens({
      _id: user._id,
      activated: false,
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
    });

    const userDto = new UserDto(user);
    res.json({ accessToken, user: userDto });
  }
}

module.exports = new AuthController();
