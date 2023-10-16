const JIMP = require("jimp");
const path = require("path");
const userService = require("../services/user-service");
const UserDto = require("../dltos/user-dlto");
class ActivateController {
  async activate(req, res) {
    const { name, avatar } = req.body;
    if (!name || !avatar) {
      res.status(401).json({ message: "Name and avatar are required" });
    }

    // Image buffer
    const buffer = Buffer.from(
      avatar.replace(/^data:image\/(png|jpeg|jpg|gif);base64,/, ""),
      "base64"
    );

    const imagePath = `${Date.now()}_${Math.round(Math.random() * 1e8)}.png`;

    try {
      const JimpRes = await JIMP.read(buffer);
      JimpRes.resize(150, JIMP.AUTO).write(
        path.resolve(__dirname, `../storage/${imagePath}`)
      );
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
      console.log(error);
    }
    const userId = req.user._id;
    try {
      const user = await userService.findUser({ _id: req.user._id });
      if (!user) {
        res.status(404).json({ message: "User not found" });
      }

      user.activated = true;
      user.name = name;
      user.avatar = `/storage/${imagePath}`;
      user.save();
      const userDto = new UserDto(user);
      res.json({ user: userDto, auth: true });
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new ActivateController();
