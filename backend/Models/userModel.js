const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: { type: String, required: false },
    phone: {
      type: String,
      required: true,

      minlength: 10,
    },
    activated: { type: Boolean, default: false, required: false },
    avatar: { type: String, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema, "users");
