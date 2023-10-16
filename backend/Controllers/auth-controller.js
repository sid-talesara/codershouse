const Otpservice = require("../services/otp-service");
const HashService = require("../services/hash-service");
const userService = require("../services/user-service");
const tokenService = require("../services/token-service");
const UserDto = require("../dltos/user-dlto");
const refreshModel = require("../Models/refresh-model");

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

    // Save refresh token to db
    tokenService.storeRefreshToken({ token: refreshToken, userId: user._id });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
    });

    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
    });

    const userDto = new UserDto(user);
    res.json({ auth: true, user: userDto });
  }

  async refreshToken(req, res) {
    // get refresh cookies from request
    const { refreshToken: refreshTokenFromCookies } = req.cookies;
    // check if token is valid
    let userData;
    try {
      userData = await tokenService.verifyRefreshToken(refreshTokenFromCookies);
    } catch (error) {
      console.log(error);
      return res.status(401).json({ message: "Invalid token" });
    }
    // check if token is in db
    try {
      const token = await tokenService.findRefreshToken(
        userData._id,
        refreshTokenFromCookies
      );

      if (!token) {
        return res.status(401).json({ message: "Invalid token" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Internal Error" });
    }

    // Check if valid user
    const user = await userService.findUser({ _id: userData._id });
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "No User Found" });
    }
    // generate new
    const { refreshToken, accessToken } = tokenService.generateTokens({
      _id: userData._id,
    });

    // Update Refresh Token
    try {
      tokenService.updateRefreshToken(userData._id, refreshToken);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Error" });
    }

    // put the new tokens in cookies

    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
    });

    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
    });

    const userDto = new UserDto(user);
    res.json({ auth: true, user: userDto });
  }

  async logout(req, res) {
    const { refreshToken } = req.cookies;
    await tokenService.removeToken(refreshToken);
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    res.json({ user: null, auth: false });
  }
}

module.exports = new AuthController();
