import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
});

const Profile = mongoose.model('Profile', profileSchema);

// Console log profile database contents
Profile.find(function (err, profile) {
  if (err) return console.error(err);
  console.log('PROFILE DATABASE CONTENTS', profile);
});

export default Profile;
