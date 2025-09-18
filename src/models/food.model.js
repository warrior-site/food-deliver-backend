import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    foodPartnerId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "FoodPartner",
      required: true,
    },
    video:{
        type: String,
        trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      enum: ["Veg", "Non-Veg", "Vegan", "Dessert", "Beverage", "Other"],
      default: "Other",
    },
    photos: [
      {
        type: String, // URL or path to the image
      },
    ],
    // partner: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "FoodPartner", // who provides this food
    //   // required: true,
    // },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    ratingCount: {
      type: Number,
      default: 0, // number of ratings to calculate average
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Food = mongoose.model("Food", foodSchema);
export default Food;
