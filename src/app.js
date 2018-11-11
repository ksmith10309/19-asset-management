import express from 'express';

import authRouter from './auth/router.js';
import uploadRouter from './upload/router.js';
import deleteRouter from './delete/router.js';

import Profile from './models/profile.js';
import Image from './models/image.js';

import auth from './auth/middleware.js';
import badRequest from './middleware/400.js';
import notFound from './middleware/404.js';
import error from './middleware/error.js';

const app = express();

app.use(express.json());

app.use(authRouter);
app.use(uploadRouter);
app.use(deleteRouter);

// Using user id, return a user's full profile AND a list of all images they've uploaded as a JSON object
app.get('/user/:id', auth(), (req, res) => {
  console.log('CONSOLE THIS!!!!', req.params.id);
  Profile.find({user:req.params.id})
    .then(profile => {
      Image.find({profile:profile[0]._id})
        .then(images => {
          profile[1] = {images};
          res.send(profile);
        });
    })
    .catch(err => badRequest(err, req, res));
});

// Using profile id, return a user's full profile AND a list of all images they've uploaded as a JSON object
app.get('/profile/:id', auth(), (req, res) => {
  Profile.find({_id:req.params.id})
    .then(profile => { 
      Image.find({profile:profile[0]._id})
        .then(images => {
          profile[1] = {images};
          res.send(profile);
        });
    })
    .catch(err => badRequest(err, req, res));
});

// Using image id, return a user's full profile AND a list of all images they've uploaded as a JSON object
app.get('/image/:id', auth(), (req, res) => {
  Image.findById(req.params.id).populate('profile')
    .then(data => {
      Image.find({profile:data.profile._id})
        .then(images => {
          res.send([data.profile, images]);
        });
    })
    .catch(err => badRequest(err, req, res));
});

app.use(notFound);
app.use(error);

let server;

module.exports =  {
  app,
  start: (port) => {
    server = app.listen(port, () => console.log('Listening on port ' + port));
  },
  stop: () => {
    server.close(() => {
      console.log('Server has been stopped');
    });
  },
};
