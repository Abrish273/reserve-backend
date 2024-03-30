const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const schema = mongoose.Schema;

const UserSchema = new schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phonenumber: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'user',
    required: true,
  },

  // api_permission: {
  //   type: String,
  //   enum: [
  //     "access_all",
  //     "Delete",
  //     "Update",
  //     "Register",
  //     "read_only",
  //   ],
  //   default: 'read_only',
  //   required: true,
  // },
});

UserSchema.pre("save", async function () {
  // console.log(this.modifiedPaths());
  // console.log(this.isModified('name'));
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};


module.exports = mongoose.model("User", UserSchema);
