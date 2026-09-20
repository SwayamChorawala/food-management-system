const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    desc: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ['veg', 'non-veg'],
      default: 'veg',
    },
    image: {
      type: String,
      default: '',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    subCategory: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const FoodItem = mongoose.model('FoodItem', foodItemSchema);

module.exports = FoodItem;
