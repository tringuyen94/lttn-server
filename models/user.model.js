const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { USER_ROLES } = require('../constant');

const DOCUMENT_NAME = 'User';
const COLLECTION_NAME = 'Users';

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'This field must be filled'],
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
      minlength: [8, 'Password has at least 8 character'],
    },
    user_role: {
      type: String,
      required: true,
      enum: USER_ROLES,
      default: 'user',
    },
    user_active: { type: Boolean, default: true, required: true },
  },
  { timestamps: true, collection: COLLECTION_NAME }
);

// PRE HOOK HASH PASSWORD BEFORE SAVE
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
  } catch (error) {
    next();
  }
});
UserSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});
UserSchema.methods.comparePassword = async function (inputPassword) {
  try {
    return await bcrypt.compare(inputPassword, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

const User = mongoose.model(DOCUMENT_NAME, UserSchema);
module.exports = User;
