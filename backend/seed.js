const mongoose = require('mongoose');
const dotenv = require('dotenv');
const FoodItem = require('./models/FoodItem');
const Category = require('./models/Category');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/foodapp1';

const itemsData = [
  { title: "Bread & Dips", desc: "Sourdough bread accompanied by hummus, beetroot & whipped feta dips", price: 600, type: "veg", image: "image1.avif", category: "Starters", subCategory: "Bread" },
  { title: "Crispy Spring Rolls", desc: "Hand-rolled crispy skins filled with fresh vegetables and sweet chili sauce", price: 450, type: "veg", image: "image2.avif", category: "Starters", subCategory: "Chinese" },
  { title: "Grilled Chicken Salad", desc: "Fresh greens, avocado, cherry tomatoes, and tender grilled chicken breast", price: 850, type: "non-veg", image: "image3.avif", category: "Starters", subCategory: "Chicken" },
  { title: "Margherita Pizza", desc: "Classic Italian pizza base topped with fresh mozzarella, tomatoes and basil", price: 900, type: "veg", image: "image4.avif", category: "Pizza", subCategory: "Veg Pizza" },
  { title: "Chicken Pepperoni Pizza", desc: "Spicy chicken pepperoni with gooey mozzarella cheese on a crispy crust", price: 950, type: "non-veg", image: "image5.avif", category: "Pizza", subCategory: "Non-Veg Pizza" },
  { title: "Arrabbiata Pasta", desc: "Penne tossed in a spicy garlic and tomato sauce with fresh basil", price: 650, type: "veg", image: "image6.avif", category: "Pasta", subCategory: "Veg Pasta" },
  { title: "Chicken Dum Biryani", desc: "Aromatic basmati rice slow-cooked with tender chicken and authentic spices", price: 800, type: "non-veg", image: "image7.avif", category: "Main Course", subCategory: "Biryani" },
  { title: "Creamy Pasta Carbonara", desc: "Traditional Italian pasta with pancetta, egg yolk, and aged parmesan cheese", price: 750, type: "non-veg", image: "image8.avif", category: "Pasta", subCategory: "Non-Veg Pasta" },
  { title: "Chocolate Lava Cake", desc: "Warm molten chocolate center served with premium vanilla bean ice cream", price: 500, type: "veg", image: "image9.avif", category: "Desserts", subCategory: "Chocolate" },
  { title: "Veg Burger", desc: "Crispy vegetable patty with lettuce, tomato, cheese and special sauce", price: 450, type: "veg", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop", category: "Burgers", subCategory: "Veg Burger" },
  { title: "Chicken Burger", desc: "Juicy chicken patty with cheese, lettuce, tomato and creamy sauce", price: 600, type: "non-veg", image: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?q=80&w=800&auto=format&fit=crop", category: "Burgers", subCategory: "Chicken Burger" },
  { title: "Veg Momos", desc: "Steamed dumplings filled with fresh vegetables and served with spicy chutney", price: 350, type: "veg", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800&auto=format&fit=crop", category: "Starters", subCategory: "Chinese" },
  { title: "Paneer Tikka", desc: "Grilled paneer cubes marinated with yogurt and Indian spices", price: 550, type: "veg", image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=800&auto=format&fit=crop", category: "Indian", subCategory: "Tandoor" },
  { title: "Chicken Tikka", desc: "Tender chicken pieces marinated in spices and grilled in tandoor", price: 700, type: "non-veg", image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=800&auto=format&fit=crop", category: "Indian", subCategory: "Tandoor" },
  { title: "Chocolate Brownie", desc: "Warm chocolate brownie served with vanilla ice cream", price: 400, type: "veg", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800&auto=format&fit=crop", category: "Desserts", subCategory: "Chocolate" },
  { title: "Cheesecake", desc: "Creamy classic cheesecake with a buttery biscuit base", price: 450, type: "veg", image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=800&auto=format&fit=crop", category: "Desserts", subCategory: "Cakes" },
  { title: "Fresh Lime Soda", desc: "Refreshing lime drink available in sweet and salty flavors", price: 200, type: "veg", image: "https://images.unsplash.com/photo-1546173159-315724a31696?q=80&w=800&auto=format&fit=crop", category: "Beverages", subCategory: "Cool Drinks" },
  { title: "Cold Coffee", desc: "Chilled creamy coffee topped with chocolate and whipped cream", price: 300, type: "veg", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=800&auto=format&fit=crop", category: "Beverages", subCategory: "Coffee" },
];

async function seedData() {
  try {
    console.log("Connecting to Database...");
    await mongoose.connect(MONGO_URI);
    console.log("Database connected successfully.");

    console.log("Clearing old data...");
    await FoodItem.deleteMany({});
    await Category.deleteMany({});

    // Step 1: Create categories with empty foodItems
    const uniqueCategoryNames = [...new Set(itemsData.map(item => item.category))];
    const categoryMap = {};

    for (const name of uniqueCategoryNames) {
      const cat = await Category.create({ name, foodItems: [] });
      categoryMap[name] = cat;
    }
    console.log(`Created ${uniqueCategoryNames.length} categories.`);

    // Step 2: Insert food items and embed their details into category
    for (const item of itemsData) {
      const cat = categoryMap[item.category];

      const savedItem = await FoodItem.create({
        title: item.title,
        desc: item.desc,
        price: item.price,
        type: item.type,
        image: item.image,
        category: cat._id,
        subCategory: item.subCategory,
      });

      // Push FULL item details (not just ObjectId) into category
      cat.foodItems.push({
        title: item.title,
        desc: item.desc,
        price: item.price,
        type: item.type,
        image: item.image,
        subCategory: item.subCategory,
      });
    }

    // Step 3: Save all categories with embedded food item details
    for (const name of uniqueCategoryNames) {
      await categoryMap[name].save();
    }

    console.log(`Inserted ${itemsData.length} food items.\n`);
    console.log("--- Category Summary ---");
    for (const name of uniqueCategoryNames) {
      const items = categoryMap[name].foodItems.map(f => f.title).join(', ');
      console.log(`  ${name} (${categoryMap[name].foodItems.length}): ${items}`);
    }

    await mongoose.connection.close();
    console.log("\nMigration Complete!");
  } catch (err) {
    console.error("Migration Error:", err);
    await mongoose.connection.close();
  }
}

seedData();
