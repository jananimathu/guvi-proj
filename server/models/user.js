import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: { type: String, required:  true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  age: { type: Number},
  dob: { type: String},
  gender: { type: String},
  mobile: { type: String},
  address: { type: String},
});

export default mongoose.model("User", userSchema);