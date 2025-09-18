import Food from "../models/food.model.js";
import FoodPartner from "../models/foodPartner.model.js";
import imagekit from "../services/imagekit.service.js"; // your configured ImageKit instance

export const addFood = async (req, res) => {
  try {
    const { name, description, price, category, foodPartnerId } = req.body;
    const photos = req.files?.photos || [];
    const video = req.files?.video ? req.files.video[0] : null;

    // Upload photos
    const photoUrls = await Promise.all(
      photos.map((photo, index) =>
        imagekit.upload({
          file: photo.buffer, // buffer from multer memoryStorage
          fileName: `photo_${Date.now()}_${index}.jpg`,
        })
      )
    );

    // Upload video (if provided)
    let videoUrl = null;
    if (video) {
      const uploadedVideo = await imagekit.upload({
        file: video.buffer,
        fileName: `video_${Date.now()}.mp4`,
      });
      videoUrl = uploadedVideo.url;
    }

    // Create food item
    const foodItem = new Food({
      name,
      foodPartnerId,
      description,
      price,
      category,
      photos: photoUrls.map((p) => p.url),
      video: videoUrl,
    });

    await foodItem.save();

    res.status(201).json({
      message: "Food item added successfully",
      foodItem,
    });
  } catch (error) {
    console.error("Error adding food item:", error);
    res.status(500).json({ message: "Error adding food item", error });
  }
};

export const updateFoodPartner = async (req, res) => {
  const partnerId = req.params.id;
  const updates = req.body;

  // handle file uploads (logo / coverImage)
  const logoFile = req.files?.logo?.[0];
  const coverImageFile = req.files?.coverImage?.[0];

  try {
    const partner = await FoodPartner.findById(partnerId);
    if (!partner) {
      return res
        .status(404)
        .json({ success: false, message: "Food partner not found" });
    }

    // 🔒 Prevent updating restricted fields
    delete updates.email;
    delete updates.password;

    // Upload logo if provided
    if (logoFile) {
      const uploadedLogo = await imagekit.upload({
        file: logoFile.buffer,
        fileName: `logo_${Date.now()}.jpg`,
      });
      partner.logo = uploadedLogo.url;
    }

    // Upload cover image if provided
    if (coverImageFile) {
      const uploadedCover = await imagekit.upload({
        file: coverImageFile.buffer,
        fileName: `cover_${Date.now()}.jpg`,
      });
      partner.coverImage = uploadedCover.url;
    }

    // Direct update without Object.keys
    if (updates.name) partner.name = updates.name;
    if (updates.phone) partner.phone = updates.phone;
    if (updates.logo) partner.logo = updates.logo;
    if (updates.coverImage) partner.coverImage = updates.coverImage;
    if (updates.description) partner.description = updates.description;
    if (updates.cuisineTypes) partner.cuisineTypes = updates.cuisineTypes;

    // Handle location separately
    if (updates.location) {
      if (updates.location.city) partner.location.city = updates.location.city;
      if (updates.location.locality) partner.location.locality = updates.location.locality;

      if (updates.location.coordinates) {
        // If client sends [lng, lat]
        if (Array.isArray(updates.location.coordinates)) {
          partner.location.coordinates = {
            type: "Point",
            coordinates: updates.location.coordinates,
          };
        }

        // If client sends { longitude, latitude }
        else if (
          typeof updates.location.coordinates === "object" &&
          updates.location.coordinates.longitude &&
          updates.location.coordinates.latitude
        ) {
          partner.location.coordinates = {
            type: "Point",
            coordinates: [
              updates.location.coordinates.longitude,
              updates.location.coordinates.latitude,
            ],
          };
        }
      }
    }


    await partner.save();

    res.status(200).json({
      success: true,
      message: "Food partner updated successfully",
      partner,
    });
  } catch (error) {
    console.error("Error updating food partner:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("userId", "name").populate("foodItems.foodId", "name");
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Error fetching orders", error });
  }
};

export const changeStatus = async (req, res) => {
  const { orderId, status } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.status(200).json({ success: true, message: "Order status updated successfully", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ success: false, message: "Error updating order status", error });
  }
}; 
