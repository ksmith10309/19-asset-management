import express from 'express';
const deleteRouter = express.Router();

import aws from 'aws-sdk';
const s3 = new aws.S3();

import Image from '../models/image.js';

import auth from '../auth/middleware.js';
import error from '../middleware/error.js';

deleteRouter.delete('/delete/:id', auth(), (req, res) => {
  Image.findById(req.params.id)
    .then(image => {
      let config = {
        Bucket: process.env.AWS_BUCKET,
        Key: image.filename,
      };
      s3.deleteObject(config)
        .promise()
        .then(() => {
          Image.findByIdAndDelete(req.params.id)
            .then(() => {
              res.statusCode = 204;
              res.statusMessage = 'No Content';
              res.end();
            });
        });
    })
    .catch(err => error(err, req, res));
});
    
export default deleteRouter;
