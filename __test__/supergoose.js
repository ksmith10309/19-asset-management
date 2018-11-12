import mongoose from 'mongoose';
import MongoMemoryServer from 'mongodb-memory-server';
import supertest from 'supertest';

let mongoServer;

// May require additional time for downloading MongoDB binaries
global.jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

export default (server) => supertest(server);

export const startDB = async () => {
  mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getConnectionString();

  const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
  };

  await mongoose.connect(mongoUri, options, (err) => {
    if (err) console.error(err);
  });
};

export const stopDB = () => {
  mongoose.disconnect();
  mongoServer.stop();
};
