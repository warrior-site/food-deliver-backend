// src/models/favorite.model.js
import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    foods: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Food"
      }
    ]
  },
  { timestamps: true }
);
const Favorite = mongoose.model("Favorite", favoriteSchema);

export default Favorite;
