const User = require("../../../models/user.model")
const bcrypt = require("bcryptjs")
const { promisify } = require("util")
const comparePassword = promisify(bcrypt.compare)
const jsonwebtoken = require("jsonwebtoken")
const jwtSign = promisify(jsonwebtoken.sign)


const register = (req, res, next) => {
  const { email, password } = req.body
  User.findOne({ email })
    .then(result => {
      if (result)
        return Promise.reject({
          status: 400,
          message: "This email already exist"
        })
      let newUser = new User({ email, password })
      return newUser.save()
    })
    .then(user => res.status(201).json(user))
    .catch(err => {
      if (err.status) return res.status(err.status).json({ message: err.message })
      return res.status(500).json(err)
    })
}
const login = (req, res, next) => {
  const { email, password } = req.body
  User.findOne({ email })
    .then(user => {
      if (!user)
        return Promise.reject({ status: 400, message: "Tài khoản không tồn tại" })
      return Promise.all([comparePassword(password, user.password), user])
    })
    .then(result => {
      const isMatch = result[0]
      const payload = {
        email: result[1].email,
      }
      if (!isMatch)
        return Promise.reject({
          status: 400,
          message: "Sai mật khẩu"
        })
      return jwtSign(payload, process.env.SECRET_KEY, { expiresIn: 6000 })
    })
    .then(token =>
      res.status(200).json({ message: "Thành công", jwt: token })
    )
    .catch(err => {
      if (err.status) return res.status(err.status).json({ message: err.message })
      return res.status(500).json(err)
    })
}


const updateUserById = (req, res, next) => {
  const { password, fullName, phone } = req.body
  const userId = req.params
  User.findById(userId)
    .then(user => {
      if (!user)
        return Promise.reject({ status: 404, message: "User nopt found" })
      user.password = password
      user.fullName = fullName
      user.phone = phone
      return user.save()
    })
    .then(user => res.status(200).json(user))
    .catch(err => {
      if (err.status) return res.status(err.status).json(err.message)
      return res.status(500).json(err)
    })
}
const getUsers = (req, res, next) => {
  User.find()
    .then(users => res.status(200).json(users))
    .catch(err => res.status(500).json(err))
}

module.exports = {
  register,
  getUsers,
  login,
  updateUserById
}
