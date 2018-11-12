import express from 'express';
const authRouter = express.Router();

import User from './user.js';
import Profile from '../models/profile.js';

import auth from './middleware.js';
import badRequest from '../middleware/400.js';
import error from '../middleware/error.js';
import sendJSON from '../middleware/sendJSON.js';

authRouter.post('/signup', (req, res, next) => {
  User.create(req.body)
    .then(user => {
      req.token = user.generateToken();
      res.send(req.token);
    })
    .catch(err => badRequest(err, req, res, next));
});

authRouter.post('/signin', auth(), (req, res) => {
  Profile.find({user:req.user._id})
    .then(data => {
      // If user already has a profile, update profile
      if (data.length > 0) {
        Profile.findByIdAndUpdate(data[0]._id, req.body, {new:true})
          .then(data => sendJSON(res, data))
          .catch(err => error(err, req, res));
      }
      // If user does not have a profile, create new profile
      else if (data.length === 0) {
        req.body.user = req.user._id;
        Profile.create(req.body)
          .then(data => sendJSON(res, data))
          .catch(err => error(err, req, res));
      }
    });
});

export default authRouter;
