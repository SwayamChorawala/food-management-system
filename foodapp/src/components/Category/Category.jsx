import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../Navbar';
import Footer from '../Footer';
import './Category.css';
import { menuItems } from '../Menu/item';
import { LuLeafyGreen, LuArrowRight, LuSparkles } from 'react-icons/lu';
import { GiChickenOven, GiBowlOfRice, GiBroccoli } from 'react-icons/gi';

const Category = () => {
  const navigate = useNavigate();
  const [vegCount, setVegCount] = useState(0);
  const [nonVegCount, setNonVegCount] = useState(0);

  useEffect(() => {
    try {
      const editsMap = JSON.parse(localStorage.getItem('adminFoodEdits') || '{}');
      const extras = JSON.parse(localStorage.getItem('adminFoodExtras') || '[]');
      const base = menuItems.map((item) => {
        const edit = editsMap[item.id];
        if (!edit) return item;
        return { ...item, ...edit };
      });
      const fullList = [...base, ...extras];
      
      const vCount = fullList.filter(item => item.type === 'veg').length;
      const nvCount = fullList.filter(item => item.type === 'non-veg').length;
      
      setVegCount(vCount);
      setNonVegCount(nvCount);
    } catch (e) {
      setVegCount(menuItems.filter(i => i.type === 'veg').length);
      setNonVegCount(menuItems.filter(i => i.type === 'non-veg').length);
    }
  }, []);

  const handleCategorySelect = (type) => {
    navigate(`/menu?type=${type}`);
  };

  return (
    <motion.div
      className="category-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar />

      <div className="category-container">
        <div className="category-header">
          <motion.div
            className="category-badge"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LuSparkles /> Choose Your Preference
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Food Categories
          </motion.h1>
          <motion.p
            className="category-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Select a category to explore our mouth-watering dishes crafted with love and passion.
          </motion.p>
        </div>

        <div className="category-cards-grid">
          {/* VEG CARD */}
          <motion.div
            className="category-card veg-card"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            whileHover={{ y: -8 }}
            onClick={() => handleCategorySelect('veg')}
          >
            <div className="card-top-accent veg-accent"></div>
            <div className="category-icon-wrapper veg-icon-bg">
              <LuLeafyGreen className="category-icon veg-icon" />
              <span className="veg-dot-badge"></span>
            </div>

            <div className="category-content">
              <div className="category-tag veg-tag">100% Pure Veg</div>
              <h2 className="category-title">Vegetarian Special</h2>
              <p className="category-description">
                Fresh, plant-based delicacies prepared with farm-fresh organic vegetables, aromatic spices, and rich paneer.
              </p>

              <div className="category-features">
                <span className="feature-pill"><GiBroccoli /> Fresh & Organic</span>
                <span className="feature-pill">🌱 Healthy Choice</span>
                <span className="feature-pill">✨ {vegCount} Dishes</span>
              </div>

              <div className="category-action">
                <button
                  className="category-btn veg-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCategorySelect('veg');
                  }}
                >
                  <span>Explore Veg Menu</span>
                  <LuArrowRight className="btn-arrow" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* NON-VEG CARD */}
          <motion.div
            className="category-card nonveg-card"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            whileHover={{ y: -8 }}
            onClick={() => handleCategorySelect('non-veg')}
          >
            <div className="card-top-accent nonveg-accent"></div>
            <div className="category-icon-wrapper nonveg-icon-bg">
              <GiChickenOven className="category-icon nonveg-icon" />
              <span className="nonveg-dot-badge"></span>
            </div>

            <div className="category-content">
              <div className="category-tag nonveg-tag">Chef's Non-Veg Special</div>
              <h2 className="category-title">Non-Vegetarian Feast</h2>
              <p className="category-description">
                Succulent, tender meats, juicy grilled chicken, aromatic biryanis, and rich savory gravies cooked to perfection.
              </p>

              <div className="category-features">
                <span className="feature-pill"><GiBowlOfRice /> Juicy & Tender</span>
                <span className="feature-pill">🔥 Tandoori Specials</span>
                <span className="feature-pill">✨ {nonVegCount} Dishes</span>
              </div>

              <div className="category-action">
                <button
                  className="category-btn nonveg-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCategorySelect('non-veg');
                  }}
                >
                  <span>Explore Non-Veg Menu</span>
                  <LuArrowRight className="btn-arrow" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="all-menu-banner"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p>Want to see all dishes together?</p>
          <button className="all-menu-btn" onClick={() => handleCategorySelect('all')}>
            View Full Menu
          </button>
        </motion.div>
      </div>

      <Footer />
    </motion.div>
  );
};

export default Category;
