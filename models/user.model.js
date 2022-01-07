const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const { promisify } = require("util")
const hash = promisify(bcrypt.hash)
const genSalt = promisify(bcrypt.genSalt)


const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
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
    .catch(err => console.log(err))
})
const User = mongoose.model("User", UserSchema, "User")
module.exports = User