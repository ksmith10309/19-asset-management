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

// POST - 200 - test that the upload worked and a resource object is returned
describe('Test /upload route', () => {
  it('should upload a file', async () => {
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
    const profileId = response.body._id;
    
    response = await server(app).post('/upload')
      .auth(token, {type:'bearer'})
      .attach('img', `${__dirname}/../asset/hero-luna.jpg`);

    expect(response.status).toBe(200);
    expect(response.body.filename).toMatch(/hero-luna.jpg/);
    expect(response.body.link).toMatch(/s3.amazonaws.com/);
    expect(response.body.profile).toBe(profileId);
  });
});
