import Food from "../models/food.model.js";
import FoodPartner from "../models/foodPartner.model.js";
import imagekit from "../services/imagekit.service.js"; // your configured ImageKit instance

export const addFood = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
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
