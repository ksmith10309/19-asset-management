import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  link: { type: String, required: true },
  profile: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
});

const Image = mongoose.model('Image', imageSchema);

// Console log image database contents
Image.find(function (err, image) {
  if (err) return console.error(err);
  console.log('IMAGE DATABASE CONTENTS', image);
});

export default Image;
