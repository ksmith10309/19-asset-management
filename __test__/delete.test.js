import server, { startDB, stopDB } from './supergoose.js';
import { app } from '../src/app.js';
import User from '../src/auth/user.js';
import Profile from '../src/models/profile.js';
import Image from '../src/models/image.js';

require('dotenv').config();

beforeAll(startDB);
afterAll(stopDB);

beforeEach(async () => {
  await User.deleteMany({});
  await Profile.deleteMany({});
  await Image.deleteMany({});
});

// DELETE - 204 - test to ensure the object was deleted from s3
describe('Test /delete route', () => {
  it('should delete a file', async () => {
    const userObj = {
      username: 'user',
      password: 'password',
    };

    let response = await server(app).post('/signup').send(userObj);
    const token = response.text;

    const profileObj = {
      firstname: 'Katherine',
      lastname: 'Smith',
    };

    response = await server(app).post('/signin')
      .auth(token, {type:'bearer'})
      .send(profileObj);
    
    response = await server(app).post('/upload')
      .auth(token, {type:'bearer'})
      .attach('img', `${__dirname}/../asset/hero-luna.jpg`);
    const imageId = response.body._id;

    response = await server(app).delete('/delete/' + imageId)
      .auth(token, {type:'bearer'});

    expect(response.res.statusCode).toBe(204);
    expect(response.res.statusMessage).toBe('No Content');
    expect(response.body).toBeUndefined;
  });
});
