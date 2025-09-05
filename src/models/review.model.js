import mongoose from "mongoose";

const foodPartnerReviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    foodPartnerId: { type: mongoose.Schema.Types.ObjectId, ref: "FoodPartner", required: true },
    rating: { type: Number, min: 1, max: 5, required: true }, // 1–5 stars
    comment: { type: String, trim: true },
  },
  { timestamps: true }
);

// Prevent duplicate review (one user can only review a partner once)
// foodPartnerReviewSchema.index({ userId: 1, foodPartnerId: 1 }, { unique: true });
const FoodPartnerReview = mongoose.model("FoodPartnerReview", foodPartnerReviewSchema);
export default FoodPartnerReview;
