const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Order = require('./models/Order');
const User = require('./models/User');
const FoodItem = require('./models/FoodItem');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/foodapp1';

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend is running' });
});

app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const adminUser = process.env.ADMIN_USER || 'admin';
    const adminPass = process.env.ADMIN_PASS || 'admin123';

    if (username.trim() === adminUser && password.trim() === adminPass) {
      return res.status(200).json({
        message: 'Admin authentication successful',
        admin: { username: adminUser, role: 'admin', token: 'admin-session-token-secret' },
      });
    }

    // Also check if admin exists in DB with role or matching username
    const user = await User.findOne({ username: username.trim() });
    if (user && user.password === password.trim()) {
      return res.status(200).json({
        message: 'Admin authentication successful',
        admin: { username: user.username, role: 'admin', token: 'admin-session-token-secret' },
      });
    }

    res.status(401).json({ message: 'Invalid admin username or password' });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Admin authentication failed', error: error.message });
  }
});

app.get('/api/food', async (req, res) => {
  try {
    let items = await FoodItem.find().sort({ createdAt: -1 });

    if (items.length === 0) {
      // Data is expected to be populated via seed.js now
      console.log('No food items found. Please run "node seed.js" to populate database.');
    }

    res.status(200).json(items);
  } catch (error) {
    console.error('Get food items error:', error);
    res.status(500).json({ message: 'Failed to fetch food items', error: error.message });
  }
});

app.post('/api/food', async (req, res) => {
  try {
    const { title, desc, price, type, image, category } = req.body;
    if (!title || price === undefined) {
      return res.status(400).json({ message: 'Title and price are required' });
    }

    const newItem = new FoodItem({
      title: title.trim(),
      desc: desc || '',
      price: Number(price),
      type: type || 'veg',
      image: image || '',
      category: category || 'Main Course',
    });

    const saved = await newItem.save();
    res.status(201).json({ message: 'Food item created successfully', item: saved });
  } catch (error) {
    console.error('Create food error:', error);
    res.status(500).json({ message: 'Failed to create food item', error: error.message });
  }
});

app.put('/api/food/:id', async (req, res) => {
  try {
    const { title, desc, price, type, image, category } = req.body;
    const updatedItem = await FoodItem.findByIdAndUpdate(
      req.params.id,
      { title, desc, price: Number(price), type, image, category },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    res.status(200).json({ message: 'Food item updated successfully', item: updatedItem });
  } catch (error) {
    console.error('Update food error:', error);
    res.status(500).json({ message: 'Failed to update food item', error: error.message });
  }
});

app.delete('/api/food/:id', async (req, res) => {
  try {
    const deleted = await FoodItem.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    res.status(200).json({ message: 'Food item deleted successfully' });
  } catch (error) {
    console.error('Delete food error:', error);
    res.status(500).json({ message: 'Failed to delete food item', error: error.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const {
      fullName,
      phoneNumber,
      address,
      paymentMethod,
      orderNotes,
      items,
      totalPrice,
    } = req.body;

    if (!fullName || !phoneNumber || !address || !items || items.length === 0) {
      return res.status(400).json({
        message: 'Please provide fullName, phoneNumber, address, and at least one item',
      });
    }

    const title = items
      .map((item) => item.title || item.name || 'Food Item')
      .join(', ');

    const newOrder = new Order({
      title,
      fullName,
      phoneNumber,
      address,
      paymentMethod: paymentMethod || 'COD',
      orderNotes: orderNotes || '',
      items,
      totalPrice: totalPrice || 0,
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({
      message: 'Order saved successfully',
      orderId: savedOrder._id,
      order: savedOrder,
    });
  } catch (error) {
    console.error('Order save error:', error);
    res.status(500).json({
      message: 'Failed to save order',
      error: error.message,
    });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

app.put('/api/orders/:id', async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ message: 'Order updated successfully', order: updatedOrder });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ message: 'Failed to update order', error: error.message });
  }
});

app.delete('/api/orders/:id', async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ message: 'Failed to delete order', error: error.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const existingUser = await User.findOne({ username: username.trim() });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists. Please choose another or login.' });
    }

    const newUser = new User({
      username: username.trim(),
      password,
      email: email ? email.trim() : '',
      lastLogin: new Date(),
    });

    const savedUser = await newUser.save();
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        lastLogin: savedUser.lastLogin,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Failed to register user', error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = await User.findOne({ username: username.trim() });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
});

const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected successfully');

    app.listen(PORT, () => {
      console.log(`Backend server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

startServer();

