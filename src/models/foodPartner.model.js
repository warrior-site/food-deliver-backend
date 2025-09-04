import mongoose from "mongoose";

const foodPartnerSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        sparse: true // allows multiple docs without email
    },
    password: {
        type: String
    },
    phone: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        default: ""
    },
    coverImage: {
        type: String,
        default: ""
    },
    description: {
        type: String,
        maxlength: 500
    },
    cuisineTypes: {
        type: [String],
        default: []
    },
    location: {
        city: String,
        locality: String,
        coordinates: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point"
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                index: "2dsphere"
            }
        }
    },
    rating: {
        type: Number,
        default: 0 // store average rating
    },
    ratingCount: {
        type: Number,
        default: 0 // number of ratings received
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const FoodPartner = mongoose.model("FoodPartner", foodPartnerSchema);

export default FoodPartner;
