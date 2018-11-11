import express from 'express';
const uploadRouter = express.Router();

import fs from 'fs-extra';

import multer from 'multer';
const uploader = multer({ dest: `${__dirname}/../../tmp` });

import s3 from './s3.js';

import Profile from '../models/profile.js';
import Image from '../models/image.js';

import auth from '../auth/middleware.js';
import error from '../middleware/error.js';
import sendJSON from '../middleware/sendJSON.js';

uploadRouter.post('/upload', auth(), uploader.any(), (req, res) => {
  if (req.files.length > 1) {
    fs.remove(`${__dirname}/../../tmp`)
      .then(() => res.send('Please only upload one file at a time'))
      .catch(err => error(err, req, res));
  }
  else {
    let file = req.files[0];
    let key = `${file.filename}:${file.originalname}`;

    s3.uploadFile(file.path, key)
      .then(url => {
        Profile.find({user:req.user._id})
          .then(profile => {
            Image.create({
              filename: key,
              link: url,
              profile: profile[0]._id,
            })
              .then(data => sendJSON(res, data));
          });
      })
      .catch(err => error(err, req, res));
  }
});

export default uploadRouter;
