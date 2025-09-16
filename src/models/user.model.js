import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true, // will be hashed before saving
  },
  accountStatus: {
    type: String,
    enum: ["complete", "incomplete"],
    default: "incomplete"
  },
  profilePhoto: {
    type: String,
    default: "", // can store URL or file path
  },
  location: {
    city: String,
    locality: String,
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: undefined,
    },
  },
  totalOrders: {
    type: Number,
    default: 0
  },
  totalSpent: {
    type: Number,
    default: 0
  },
  totalRefunds: {
    type: Number,
    default: 0
  },

}, { timestamps: true });

// (no geo index for now, keep signup simple)

const User = mongoose.model("User", userSchema);

export default User;
