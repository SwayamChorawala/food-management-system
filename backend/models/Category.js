const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    foodItems: [
      {
        title: { type: String, required: true },
        desc: { type: String, default: '' },
        price: { type: Number, required: true },
        type: { type: String, enum: ['veg', 'non-veg'], default: 'veg' },
        image: { type: String, default: '' },
        subCategory: { type: String, default: '' },
      }
    ],
  },
  { timestamps: true }
);

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
