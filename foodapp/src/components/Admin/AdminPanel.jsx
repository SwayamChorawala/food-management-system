import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  LuShieldCheck,
  LuUser,
  LuLock,
  LuGlobe,
  LuLogOut,
  LuPlus,
  LuPencil,
  LuTrash2,
  LuUtensils,
  LuShoppingBag,
  LuUsers,
  LuCheck,
  LuInfo,
  LuX,
  LuSearch,
  LuRefreshCw,
} from 'react-icons/lu';
import { FaChartBar } from 'react-icons/fa';
import { menuItems } from '../Menu/item';
import './AdminPanel.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const INITIAL_FOOD_ITEMS = menuItems;

const AdminPanel = () => {
  const navigate = useNavigate();

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [activeTab, setActiveTab] = useState('dashboard');

  const [foodItems, setFoodItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    price: '',
    type: 'veg',
    image: '',
    category: 'Mains',
  });

  useEffect(() => {
    const savedAdmin = localStorage.getItem('adminToken');
    if (savedAdmin) {
      setIsAdminLoggedIn(true);
      fetchDashboardData();
    }
  }, []);

  const triggerNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3500);
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAuthError('');

    if (!adminUsername.trim() || !adminPassword.trim()) {
      setAuthError('Please enter both Admin username and password.');
      return;
    }

    setAuthLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: adminUsername.trim(),
          password: adminPassword.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('adminToken', data.admin?.token || 'admin-active');
        localStorage.setItem('adminUser', adminUsername.trim());
        setIsAdminLoggedIn(true);
        window.dispatchEvent(new Event('authChange'));
        triggerNotification('Welcome Admin! Login successful.');
        fetchDashboardData();
      } else {
        // Fallback check for local development credentials
        if (adminUsername.trim() === 'admin' && adminPassword.trim() === 'admin123') {
          localStorage.setItem('adminToken', 'admin-active-fallback');
          localStorage.setItem('adminUser', 'admin');
          setIsAdminLoggedIn(true);
          window.dispatchEvent(new Event('authChange'));
          triggerNotification('Welcome Admin! (Logged in successfully)');
          fetchDashboardData();
        } else {
          setAuthError(data.message || 'Invalid Admin Username or Password');
        }
      }
    } catch (err) {
      console.warn('Backend login fallback:', err.message);
      if (adminUsername.trim() === 'admin' && adminPassword.trim() === 'admin123') {
        localStorage.setItem('adminToken', 'admin-active-fallback');
        localStorage.setItem('adminUser', 'admin');
        setIsAdminLoggedIn(true);
        window.dispatchEvent(new Event('authChange'));
        triggerNotification('Welcome Admin! (Logged in in Offline Mode)');
        fetchDashboardData();
      } else {
        setAuthError('Invalid Admin Credentials. Default is admin / admin123');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setIsAdminLoggedIn(false);
    setAdminUsername('');
    setAdminPassword('');
    window.dispatchEvent(new Event('authChange'));
    triggerNotification('Admin logged out safely', 'info');
  };

  const getEditsMap = () => {
    try {
      return JSON.parse(localStorage.getItem('adminFoodEdits') || '{}');
    } catch { return {}; }
  };

  const saveEditsMap = (map) => {
    localStorage.setItem('adminFoodEdits', JSON.stringify(map));
  };

  const getExtraItems = () => {
    try {
      return JSON.parse(localStorage.getItem('adminFoodExtras') || '[]');
    } catch { return []; }
  };

  const buildFoodList = () => {
    const editsMap = getEditsMap();
    const extras = getExtraItems();
    const base = menuItems.map((item) => {
      const edit = editsMap[item.id];
      return edit ? { ...item, ...edit, image: item.image } : item; // image always from item.js
    });
    return [...base, ...extras];
  };

  const syncFoodDisplay = () => {
    const list = buildFoodList();
    setFoodItems(list);
    // For Menu.jsx: serialise extras + edits as URL-based items
    const editsMap = getEditsMap();
    const extras = getExtraItems();
    const forMenu = [
      ...menuItems.map((item) => {
        const edit = editsMap[item.id];
        return edit
          ? { ...item, ...edit, image: item.image } // image stays as module reference for Menu
          : item;
      }),
      ...extras,
    ];
    localStorage.setItem('foodMenuItems', JSON.stringify(
      forMenu.map((i) => ({
        ...i,
        image: typeof i.image === 'object' && i.image !== null
          ? (i.image.src || i.image.default || '')
          : i.image,
      }))
    ));
    window.dispatchEvent(new Event('menuUpdated'));
  };

  const fetchDashboardData = async () => {
    setLoadingData(true);
    syncFoodDisplay();

    // Fetch Orders
    try {
      const orderRes = await fetch(`${API_BASE_URL}/api/orders`);
      if (orderRes.ok) setOrders(await orderRes.json());
    } catch (err) { console.log('Orders fetch note:', err.message); }

    // Fetch Users
    try {
      const userRes = await fetch(`${API_BASE_URL}/api/users`);
      if (userRes.ok) setUsers(await userRes.json());
    } catch (err) { console.log('Users fetch note:', err.message); }

    setLoadingData(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        alert("Image size should be less than 2MB to save in local storage.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const openFoodModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setOriginalImage(item.image); // preserve original item.js module image
      const isUrlString = item.image && typeof item.image === 'string' && item.image.startsWith('http');
      setFormData({
        title: item.title || '',
        desc: item.desc || '',
        price: item.price || '',
        type: item.type || 'veg',
        image: isUrlString ? item.image : '', // only pre-fill if it's an http URL
        category: item.category || 'Mains',
      });
    } else {
      setEditingItem(null);
      setOriginalImage(null);
      setFormData({ title: '', desc: '', price: '', type: 'veg', image: '', category: 'Mains' });
    }
    setIsModalOpen(true);
  };

  const closeFoodModal = () => { setIsModalOpen(false); setEditingItem(null); };

  const handleSaveFoodItem = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.price) {
      alert('Title aur Price zaroori hain!');
      return;
    }

    if (editingItem) {
      const itemId = editingItem.id || editingItem._id;
      const isBaseItem = menuItems.some((m) => m.id === itemId);

      if (isBaseItem) {
        // Edit a base item.js item — store only changed fields (NOT image)
        const editsMap = getEditsMap();
        editsMap[itemId] = {
          title: formData.title.trim(),
          desc: formData.desc.trim(),
          price: Number(formData.price),
          type: formData.type,
          category: formData.category,
          // image: only save a new URL if user typed one; otherwise keep item.js image
          ...(formData.image.trim() !== '' ? { imageOverride: formData.image.trim() } : {}),
        };
        saveEditsMap(editsMap);
      } else {
        // Edit an admin-added extra item
        const extras = getExtraItems().map((ex) =>
          (ex.id === itemId || ex._id === itemId)
            ? {
              ...ex,
              title: formData.title.trim(),
              desc: formData.desc.trim(),
              price: Number(formData.price),
              type: formData.type,
              category: formData.category,
              image: formData.image.trim() || ex.image || originalImage || '',
            }
            : ex
        );
        localStorage.setItem('adminFoodExtras', JSON.stringify(extras));
      }
      triggerNotification('Item successfully updated! ✅');
    } else {
      // CREATE new extra item
      const extras = getExtraItems();
      const newItem = {
        id: Date.now(),
        title: formData.title.trim(),
        desc: formData.desc.trim(),
        price: Number(formData.price),
        type: formData.type,
        category: formData.category,
        image: formData.image.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
      };
      extras.push(newItem);
      localStorage.setItem('adminFoodExtras', JSON.stringify(extras));
      triggerNotification('Naya item add ho gaya! ✅');
    }

    syncFoodDisplay();
    closeFoodModal();
  };

  const handleDeleteFoodItem = (id) => {
    if (!window.confirm('Kya aap is food item ko delete karna chahte hain?')) return;
    const isBaseItem = menuItems.some((m) => m.id === id);
    if (isBaseItem) {
      // For base items: reset any edits (restore to original)
      const editsMap = getEditsMap();
      delete editsMap[id];
      saveEditsMap(editsMap);
      triggerNotification('Item original state mein restore ho gaya', 'info');
    } else {
      // For extra items: remove from extras
      const extras = getExtraItems().filter((ex) => ex.id !== id && ex._id !== id);
      localStorage.setItem('adminFoodExtras', JSON.stringify(extras));
      triggerNotification('Item delete ho gaya', 'info');
    }
    syncFoodDisplay();
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.warn('Backend order update warning:', err);
    }

    setOrders((prev) =>
      prev.map((ord) => ((ord._id || ord.id) === orderId ? { ...ord, status: newStatus } : ord))
    );
    triggerNotification(`Order status updated to: ${newStatus}`);
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order record?')) return;

    try {
      await fetch(`${API_BASE_URL}/api/orders/${orderId}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Backend order delete warning:', err);
    }

    setOrders((prev) => prev.filter((ord) => (ord._id || ord.id) !== orderId));
    triggerNotification('Order record deleted', 'info');
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this registered user?')) return;

    try {
      await fetch(`${API_BASE_URL}/api/users/${userId}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Backend user delete warning:', err);
    }

    setUsers((prev) => prev.filter((u) => u._id !== userId));
    triggerNotification('User deleted', 'info');
  };

  // Filter food items by search query
  const filteredFoodItems = foodItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // If Admin is NOT logged in, show Admin Login View
  if (!isAdminLoggedIn) {
    return (
      <div className="admin-login-wrapper">
        <div className="admin-bg-orb orb-1"></div>
        <div className="admin-bg-orb orb-2"></div>

        <motion.div
          className="admin-login-card"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="admin-login-header">
            <div className="admin-icon-badge">
              <LuShieldCheck />
            </div>
            <h2>Admin Control Panel</h2>
            <p>Please enter your Admin Credentials to access the dashboard</p>
          </div>

          {authError && (
            <div className="admin-alert alert-error">
              <LuInfo />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin}>
            <div className="admin-form-group">
              <label>Admin Username</label>
              <div className="admin-input-box">
                <LuUser className="input-icon" />
                <input
                  type="text"
                  placeholder="Enter admin username"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label>Admin Password</label>
              <div className="admin-input-box">
                <LuLock className="input-icon" />
                <input
                  type="password"
                  placeholder="Enter admin password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="admin-btn-primary full-width" disabled={authLoading}>
              {authLoading ? 'Authenticating...' : 'Login to Admin Dashboard'}
            </button>
          </form>

          <div className="admin-login-tip">
            <span>💡 Default Credentials:</span> <strong>Username: admin | Password: admin123</strong>
          </div>

          <div className="admin-back-site">
            <button type="button" onClick={() => navigate('/')} className="admin-btn-secondary">
              <LuGlobe /> Go to Customer Website
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Admin Dashboard View (When Logged In)
  return (
    <div className="admin-dashboard-wrapper">
      <AnimatePresence>
        {notification.show && (
          <motion.div
            className={`admin-toast ${notification.type}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <LuCheck />
            <span>{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="admin-header">
        <div className="admin-header-brand">
          <LuShieldCheck className="brand-icon" />
          <div>
            <h1>The Chef &amp; Table — Admin Panel</h1>
            <p>Manage Menu Items, Customer Orders, and Users</p>
          </div>
        </div>
      </header>

      <main className="admin-main-container">
        <div className="admin-tabs-bar">
          <button
            className={`tab-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <FaChartBar />
            <span>Dashboard</span>
          </button>
          <button
            className={`tab-item ${activeTab === 'food' ? 'active' : ''}`}
            onClick={() => setActiveTab('food')}
          >
            <LuUtensils />
            <span>Manage Menu ({foodItems.length})</span>
          </button>
          <button
            className={`tab-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <LuShoppingBag />
            <span>Customer Orders ({orders.length})</span>
          </button>
          <button
            className={`tab-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <LuUsers />
            <span>Registered Users ({users.length})</span>
          </button>

          <div className="sidebar-bottom-actions">
            <button
              type="button"
              className="admin-nav-btn go-website-btn sidebar-action-btn"
              onClick={() => navigate('/')}
              title="Return to customer website"
            >
              <LuGlobe /> <span>Go to Website</span>
            </button>

            <button
              type="button"
              className="admin-nav-btn logout-btn sidebar-action-btn"
              onClick={handleAdminLogout}
              title="Logout from admin session"
            >
              <LuLogOut /> <span>Logout Admin</span>
            </button>
          </div>
        </div>

        {activeTab === 'dashboard' && (
          <div className="admin-tab-content">
            <div className="tab-actions-header">
              <h2>Analytics & Overview</h2>
              <button className="admin-btn-secondary" onClick={fetchDashboardData}>
                <LuRefreshCw /> Refresh Data
              </button>
            </div>

            <div className="dashboard-stats-grid">
              <div className="stat-card">
                <h3>Total Orders</h3>
                <p>{orders.length}</p>
              </div>
              <div className="stat-card">
                <h3>Total Revenue</h3>
                <p>₹{orders.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0)}</p>
              </div>
              <div className="stat-card">
                <h3>Total Menu Items</h3>
                <p>{foodItems.length}</p>
              </div>
              <div className="stat-card">
                <h3>Registered Users</h3>
                <p>{users.length}</p>
              </div>
            </div>

            <div className="chart-container" style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Monthly Orders</h3>
              <div style={{ width: '100%', height: 350 }}>
                <ResponsiveContainer>
                  <BarChart data={(() => {
                    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    const counts = Array(12).fill(0);
                    orders.forEach(ord => {
                      const dateStr = ord.createdAt || ord.date;
                      const date = dateStr ? new Date(dateStr) : new Date();
                      if (date && !isNaN(date.getTime())) {
                        counts[date.getMonth()] += 1;
                      }
                    });
                    return months.map((month, index) => ({ name: month, orders: counts[index] }));
                  })()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" vertical={false} />
                    <XAxis dataKey="name" stroke="rgba(255, 255, 255, 0.5)" tick={{ fill: 'rgba(255, 255, 255, 0.7)' }} />
                    <YAxis stroke="rgba(255, 255, 255, 0.5)" tick={{ fill: 'rgba(255, 255, 255, 0.7)' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--card-bg)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                      itemStyle={{ color: 'var(--gold)' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '10px' }} />
                    <Bar dataKey="orders" name="Total Orders" fill="var(--gold)" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'food' && (
          <div className="admin-tab-content">
            <div className="tab-actions-header">
              <div className="search-input-box">
                <LuSearch />
                <input
                  type="text"
                  placeholder="Search food items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="tab-right-btns">
                <button className="admin-btn-secondary" onClick={fetchDashboardData}>
                  <LuRefreshCw /> Refresh
                </button>
                <button className="admin-btn-primary" onClick={() => openFoodModal(null)}>
                  <LuPlus /> Add New Food Item
                </button>
              </div>
            </div>

            <div className="food-grid">
              {filteredFoodItems.map((item) => {
                const isBaseItem = menuItems.some((m) => m.id === item.id);
                return (
                  <div key={item._id || item.id} className="admin-food-card">
                    <div className="food-card-img">
                      <img src={item.image} alt={item.title} />
                      <span className={`badge-type ${item.type}`}>{item.type}</span>
                      {isBaseItem && (
                        <span className="badge-source">item.js</span>
                      )}
                    </div>
                    <div className="food-card-body">
                      <h3>{item.title}</h3>
                      <p className="food-desc">{item.desc}</p>
                      <div className="food-meta">
                        <span className="food-price">₹{item.price}</span>
                        <span className="food-cat">{item.category || 'Mains'}</span>
                      </div>

                      <div className="card-actions">
                        <button
                          className="btn-edit"
                          onClick={() => openFoodModal(item)}
                          title="Edit Food Item"
                        >
                          <LuPencil /> Edit
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteFoodItem(item._id || item.id)}
                          title={isBaseItem ? 'Reset to original' : 'Delete Food Item'}
                        >
                          <LuTrash2 /> {isBaseItem ? 'Reset' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredFoodItems.length === 0 && (
              <div className="empty-state">
                <p>No food items found matching your query.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="admin-tab-content">
            <div className="tab-actions-header">
              <h2>All Customer Orders ({orders.length})</h2>
              <button className="admin-btn-secondary" onClick={fetchDashboardData}>
                <LuRefreshCw /> Refresh Orders
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="empty-state">
                <p>No orders placed yet. Orders placed by customers will appear here!</p>
              </div>
            ) : (
              <div className="orders-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer Details</th>
                      <th>Items Purchased</th>
                      <th>Total Amount</th>
                      <th>Payment</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((ord) => (
                      <tr key={ord._id || ord.id}>
                        <td className="font-mono">#{ord._id || ord.id}</td>
                        <td>
                          <strong>{ord.fullName}</strong>
                          <br />
                          <small>📞 {ord.phoneNumber}</small>
                          <br />
                          <small>📍 {ord.address}</small>
                        </td>
                        <td>
                          {ord.items && ord.items.length > 0 ? (
                            <ul className="order-items-list">
                              {ord.items.map((it, idx) => (
                                <li key={idx}>
                                  {it.title || it.name} x {it.quantity || 1}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            ord.title
                          )}
                        </td>
                        <td className="font-bold">₹{ord.totalPrice}</td>
                        <td>
                          <span className="payment-badge">{ord.paymentMethod || 'COD'}</span>
                        </td>
                        <td>
                          <select
                            className={`status-select ${ord.status || 'Pending'}`}
                            value={ord.status || 'Pending'}
                            onChange={(e) =>
                              handleUpdateOrderStatus(ord._id || ord.id, e.target.value)
                            }
                          >
                            <option value="Pending">Pending</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td>
                          <button
                            className="btn-delete-sm"
                            onClick={() => handleDeleteOrder(ord._id || ord.id)}
                            title="Delete order"
                          >
                            <LuTrash2 />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="admin-tab-content">
            <div className="tab-actions-header">
              <h2>Registered Customers ({users.length})</h2>
              <button className="admin-btn-secondary" onClick={fetchDashboardData}>
                <LuRefreshCw /> Refresh Users
              </button>
            </div>

            {users.length === 0 ? (
              <div className="empty-state">
                <p>No registered users found in database.</p>
              </div>
            ) : (
              <div className="users-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>User ID</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Last Login</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((usr) => (
                      <tr key={usr._id}>
                        <td className="font-mono">{usr._id}</td>
                        <td>
                          <strong>{usr.username}</strong>
                        </td>
                        <td>{usr.email || 'N/A'}</td>
                        <td>{usr.lastLogin ? new Date(usr.lastLogin).toLocaleString() : 'N/A'}</td>
                        <td>
                          <button
                            className="btn-delete-sm"
                            onClick={() => handleDeleteUser(usr._id)}
                            title="Remove User"
                          >
                            <LuTrash2 />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      <AnimatePresence>
        {isModalOpen && (
          <div className="modal-backdrop">
            <motion.div
              className="admin-modal"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="modal-header">
                <h3>{editingItem ? 'Edit Food Item' : 'Add New Food Item'}</h3>
                <button className="modal-close-btn" onClick={closeFoodModal}>
                  <LuX />
                </button>
              </div>

              <form onSubmit={handleSaveFoodItem} className="modal-form">
                <div className="admin-form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    placeholder="Item Title (e.g., Margherita Pizza)"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Price (₹) *</label>
                    <input
                      type="number"
                      placeholder="e.g. 499"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Food Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                      <option value="veg">Veg</option>
                      <option value="non-veg">Non-Veg</option>
                    </select>
                  </div>
                </div>

                <div className="admin-form-group">
                  <label>Description</label>
                  <textarea
                    placeholder="Short description of ingredients and taste..."
                    value={formData.desc}
                    onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Image Source</label>
                  {(originalImage || formData.image) && (
                    <div className="modal-img-preview">
                      <img
                        src={formData.image.trim() !== '' ? formData.image : originalImage}
                        alt="Current Preview"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      <span className="img-preview-label">Current Image</span>
                    </div>
                  )}
                  
                  <div className="image-upload-options" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <div className="file-upload-box" style={{ background: 'rgba(255,255,255,0.05)', padding: '0.8rem', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.2)' }}>
                      <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                        <LuPlus style={{ fontSize: '1.2rem', color: '#ff5252' }}/>
                        <span>Upload Image File (Max 2MB)</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          style={{ display: 'none' }}
                        />
                      </label>
                    </div>
                    
                    <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#64748b' }}>OR</div>
                    
                    <input
                      type="text"
                      placeholder="Paste Image URL here"
                      value={formData.image && formData.image.startsWith('data:image') ? '' : formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    />
                  </div>

                  {editingItem && originalImage && (
                    <p className="img-hint" style={{ marginTop: '0.75rem' }}>💡 Leave blank to keep the current image</p>
                  )}
                </div>

                <div className="modal-footer">
                  <button type="button" className="admin-btn-secondary" onClick={closeFoodModal}>
                    Cancel
                  </button>
                  <button type="submit" className="admin-btn-primary">
                    {editingItem ? 'Save Changes' : 'Create Item'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPanel;
