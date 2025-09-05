import Food from "../models/food.model.js"
import User from "../models/user.model.js"
import FoodPartner from "../models/foodPartner.model.js"



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
        // const [user, foodPartner] = await Promise.all(
        //     [
        //         User.findById(userId), FoodPartner.find({ "location.city": user.location.city })
        //     ]);

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

}