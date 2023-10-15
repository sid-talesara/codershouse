const jwt = require("jsonwebtoken");
const refreshModel = require("../Models/refresh-model");
const accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET;
class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, accessTokenSecret, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign(payload, refreshTokenSecret, {
      expiresIn: "1y",
    });

    return { accessToken, refreshToken };
  }

  async storeRefreshToken(payload) {
    try {
      const { userId, token } = payload;
      await refreshModel.create({ token, userId });
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new TokenService();
