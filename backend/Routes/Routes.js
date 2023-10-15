const router = require("express").Router();
const ActivateController = require("../Controllers/activate-controller");
const AuthController = require("../Controllers/auth-controller");
const AuthMiddleware = require("../middlewares/auth-middleware");

router.post("/api/send-otp", AuthController.sendOTP);
router.post("/api/verify-otp", AuthController.verifyOTP);
router.post("/api/activate", AuthMiddleware, ActivateController.activate);

module.exports = router;
