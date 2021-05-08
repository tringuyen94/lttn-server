const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const { promisify } = require("util")
const hash = promisify(bcrypt.hash)
const genSalt = promisify(bcrypt.genSalt)
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  userType: { type: String, required: true, default: "client" },
  fullName: { type: String, required: true },
  phone: { type: String, required: true }
  // avatar: { type: String }
})
UserSchema.pre("save", function save(next) {
  const user = this
  if (!user.isModified("password")) return next()
  genSalt()
    .then(salt => hash(user.password, salt))
    .then(hash => {
      user.password = hash
      return next()
    })
    .catch(err => console.log)
})
const User = mongoose.model("User", UserSchema, "User")
module.exports = {
  UserSchema,
  User
}
