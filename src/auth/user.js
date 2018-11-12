import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  role: {type: String, default:'user', enum:['admin','editor','user'] },
});

const capabilities = {
  user: ['read'],
  editor: ['create', 'read', 'update'],
  admin: ['create', 'read', 'update', 'delete'],
};

userSchema.pre('save', function(next) {
  bcrypt.hash(this.password, 10)
    .then(hashedPassword => {
      this.password = hashedPassword;
      next();
    })
    .catch( error => {throw error;} );
});

userSchema.methods.can = function(capability) {
  return capabilities[this.role].includes(capability);
};

userSchema.statics.authenticateBasic = function(auth) {
  let query = {username:auth.username};
  return this.findOne(query)
    .then(user => user && user.comparePassword(auth.password))
    .catch(console.error);
};

userSchema.statics.authenticateToken = function(token) {
  let parsedToken = jwt.verify(token, process.env.SECRET);
  let query = {_id:parsedToken.id};
  return this.findOne(query)
    .then(user => {
      return user;
    })
    .catch(error => error);
};

userSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password)
    .then(valid => valid ? this : null);
};

userSchema.methods.generateToken = function() {
  let tokenData = {
    id:this._id,
    capabilities: capabilities[this.role],
  };
  return jwt.sign(tokenData, process.env.SECRET);
};

const User = mongoose.model('User', userSchema);

// Console log user database contents
User.find(function (err, user) {
  if (err) return console.error(err);
  console.log('USER DATABASE CONTENTS', user);
});

export default User;
