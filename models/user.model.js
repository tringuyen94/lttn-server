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
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.pre(/^find/, function () {
  this.find({ user_active: { $ne: false } });
});

const User = mongoose.model(DOCUMENT_NAME, UserSchema);
module.exports = User;
