import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    // unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  profilePhoto: {
    type: String,
    default: ""  // can store URL or file path
  },
  location: {
    city: {
      type: String,
    //   required: true
    },
    locality: {
      type: String,
    //   required: true
    },
    coordinates: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        // required: true
      }
    }
  }
});

// for geospatial queries (e.g., find nearby users)
userSchema.index({ "location.coordinates": "2dsphere" });

const User = mongoose.model("User", userSchema);

export default User;
