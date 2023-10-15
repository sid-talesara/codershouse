const router = require("express").Router();
const AuthController = require("../Controllers/auth-controller");

router.post("/api/send-otp", AuthController.sendOTP);
router.post("/api/verify-otp", AuthController.verifyOTP);

module.exports = router;
