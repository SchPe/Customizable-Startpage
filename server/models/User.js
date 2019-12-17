const mongoose = require('mongoose');

const defaultData = '{"aupV6":{"desktop":{"position":{"left":200,"top":121},"zIndex":"0","dimension":{"width":478,"height":798}},"content":{"subreddit":"","limit":"10","type":"reddit"}},"aZzNn":{"desktop":{"position":{"left":680,"top":121},"zIndex":"0","dimension":{"width":441,"height":644}},"content":{"type":"news","selectNewsBy":"country and/or category","newsQueryObject":{"country":"au","category":"science","pageSize":"10"}}}}';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  data: {
    type: String,
    default: '{}'
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
