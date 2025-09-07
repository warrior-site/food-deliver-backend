import Food from "../models/food.model.js"
import User from "../models/user.model.js"
import FoodPartner from "../models/foodPartner.model.js"
import FoodPartnerReview from "../models/review.model.js"
import Order from "../models/order.model.js"
import Favorite from "../models/favourite.model.js"


 

export const foodRecommend = async (req, res) => {



    const userId = req.query.id
    const page = parseInt(req.query.page) || 1; // current page
    const limit = parseInt(req.query.limit) || 10; // items per page
    const skip = (page - 1) * limit;



    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const foodPartner = await FoodPartner.find({ "location.city": user.location.city });
        if (foodPartner.length === 0) {
            return res.status(404).json({ success: false, message: "No food partners found in your city" });
        }

        const ids = foodPartner.map(partner => partner._id);
        const foods = await Food.find({ foodPartner: { $in: ids } })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }); // optional sorting

        const total = await Food.countDocuments({ foodPartner: { $in: ids } });


        res.status(200).json({
            success: true,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            foods,
        });

    } catch (error) {
        console.log(error)
    }

};

export const getFoodFromId = async (req, res) => {
    const foodId = req.params.id;

    try {
        const food = await Food.findById(foodId);
        if (!food) {
            return res.status(404).json({ success: false, message: "Food not found" });
        }
        res.status(200).json({ success: true, food });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const createOrder = async (req, res) => {
  const { userId, foodItems, totalAmount, status } = req.body;

  try {
    // 1. Validate
    if (!userId || !foodItems || foodItems.length === 0) {
      return res.status(400).json({ message: "UserId and food items are required" });
    }

    // 2. Build order
    const order = new Order({
      userId,
      foodItems: foodItems.map(item => ({
        foodId: item.foodId,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount,
      status: status || "placed",
    });

    // 3. Save
    const savedOrder = await order.save();

    res.status(201).json({ message: "Order created successfully", order: savedOrder });
  } catch (error) {
    res.status(500).json({ message: "Error creating order", error: error.message });
  }
};

export const rateFoodItem = async (req, res) => {
    const foodId = req.params.id;
    const { rating } = req.body;

    try {
        const food = await Food.findById(foodId);
        if (!food) {
            return res.status(404).json({ success: false, message: "Food not found" });
        }

        food.ratingCount += 1
        food.rating = ((food.rating * (food.ratingCount - 1)) + rating) / food.ratingCount;
        await food.save();

        res.status(200).json({ success: true, message: "Food rated successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const reviewFoodPartner = async (req,res)=>{
   const { userId, foodPartnerId, rating, comment } = req.body;

   try {
       // Validate
       if (!userId || !foodPartnerId || !rating) {
           return res.status(400).json({ message: "UserId, foodPartnerId and rating are required" });
       }

       // Create review
       const review = new FoodPartnerReview({
           userId,
           foodPartnerId,
           rating,
           comment
       });

       await review.save();

       res.status(201).json({success:true, message: "Review created successfully", review });
   } catch (error) {
       res.status(500).json({success:false, message: "Error creating review", error: error.message });
   }
}

export const addToFavourite = async (req,res)=>{
  const userId = req.params;
  const {foodItemId} = req.body;

  try {
      // Find user
      
      if (!user) {
          return res.status(404).json({success:false, message: "User not found" });
      }

      // Check if food item exists
      const foodItem = await Food.findById(foodItemId);
      if (!foodItem) {
          return res.status(404).json({success:false, message: "Food item not found" });
      }

     const fav = await Favorite.create({
        user: userId,
        foods: [foodItem]
     })

      res.status(200).json({success:true, message: "Food item added to favourites", fav });
  } catch (error) {
      res.status(500).json({success:false, message: "Error adding to favourites", error: error.message });
  }
}

