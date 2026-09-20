const image1 = "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=800&auto=format&fit=crop"; // Bread & Dips

const image2 = "https://d1mxd7n691o8sz.cloudfront.net/static/recipe/recipe/2023-12/Vegetable-Spring-Rolls-2-1-906001560ca545c8bc72baf473f230b4.jpg";

const image3 = "https://images.unsplash.com/photo-1546793665-c74683f339c1?q=80&w=800&auto=format&fit=crop"; // Grilled Chicken Salad

const image4 = "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=800&auto=format&fit=crop"; // Margherita Pizza

const image5 = "https://images.unsplash.com/photo-1579751626657-72bc17010498?q=80&w=800&auto=format&fit=crop"; // Chicken Pepperoni Pizza

const image6 = "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=800&auto=format&fit=crop"; // Arrabbiata Pasta

const image7 = "https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=800&auto=format&fit=crop"; // Chicken Biryani

const image8 = "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=800&auto=format&fit=crop"; // Pasta Carbonara

const image9 = "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800&auto=format&fit=crop"; // Chocolate Lava Cake

const image10 = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop"; // Veg Burger

const image11 = "https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=800&auto=format&fit=crop"; // Chicken Burger

const image12 = "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=800&auto=format&fit=crop"; // Veg Momos

const image13 = "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=800&auto=format&fit=crop"; // Paneer Tikka

const image14 = "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=800&auto=format&fit=crop"; // Chicken Tikka

const image15 = "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800&auto=format&fit=crop"; // Chocolate Brownie

const image16 = "https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=800&auto=format&fit=crop"; // Cheesecake

const image17 = "https://images.unsplash.com/photo-1546173159-315724a31696?q=80&w=800&auto=format&fit=crop"; // Fresh Lime Soda

const image18 = "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=800&auto=format&fit=crop"; // Cold Coffee

export const menuItems = [
    { id: 1, image: image1, title: "Bread & Dips", desc: "Sourdough bread accompanied by hummus, beetroot & whipped feta dips", price: 600, type: "veg", quantity:1, category: "Starters", subCategory: "Bread" },
    { id: 2, image: image2, title: "Crispy Spring Rolls", desc: "Hand-rolled crispy skins filled with fresh vegetables and sweet chili sauce", price: 450, type: "veg", quantity:1, category: "Starters", subCategory: "Chinese" },
    { id: 3, image: image3, title: "Grilled Chicken Salad", desc: "Fresh greens, avocado, cherry tomatoes, and tender grilled chicken breast", price: 850, type: "non-veg", quantity:1, category: "Starters", subCategory: "Chicken" },
    { id: 4, image: image4, title: "Margherita Pizza", desc: "Classic Italian pizza base topped with fresh mozzarella, tomatoes and basil", price: 900, type: "veg", quantity:1, category: "Pizza", subCategory: "Veg Pizza" },
    { id: 5, image: image5, title: "Chicken Pepperoni Pizza", desc: "Spicy chicken pepperoni with gooey mozzarella cheese on a crispy crust", price: 950, type: "non-veg", quantity:1, category: "Pizza", subCategory: "Non-Veg Pizza" },
    { id: 6, image: image6, title: "Arrabbiata Pasta", desc: "Penne tossed in a spicy garlic and tomato sauce with fresh basil", price: 650, type: "veg", quantity:1, category: "Pasta", subCategory: "Veg Pasta" },
    { id: 7, image: image7, title: "Chicken Dum Biryani", desc: "Aromatic basmati rice slow-cooked with tender chicken and authentic spices", price: 800, type: "non-veg", quantity:1, category: "Main Course", subCategory: "Biryani" },
    { id: 8, image: image8, title: "Creamy Pasta Carbonara", desc: "Traditional Italian pasta with pancetta, egg yolk, and aged parmesan cheese", price: 750, type: "non-veg", quantity:1, category: "Pasta", subCategory: "Non-Veg Pasta" },
    { id: 9, image: image9, title: "Chocolate Lava Cake", desc: "Warm molten chocolate center served with premium vanilla bean ice cream", price: 500, type: "veg", quantity:1, category: "Desserts", subCategory: "Chocolate" },
    {
        id: 10,
        image: image10,
        title: "Veg Burger",
        desc: "Crispy vegetable patty with lettuce, tomato, cheese and special sauce",
        price: 450,
        type: "veg",
        category: "Burgers",
        subCategory: "Veg Burger",
        quantity: 1
    },
    {
        id: 11,
        image: image11,
        title: "Chicken Burger",
        desc: "Juicy chicken patty with cheese, lettuce, tomato and creamy sauce",
        price: 600,
        type: "non-veg",
        category: "Burgers",
        subCategory: "Chicken Burger",
        quantity: 1
    },
    {
        id: 12,
        image: image12,
        title: "Veg Momos",
        desc: "Steamed dumplings filled with fresh vegetables and served with spicy chutney",
        price: 350,
        type: "veg",
        category: "Starters",
        subCategory: "Chinese",
        quantity: 1
    },
    {
        id: 13,
        image: image13,
        title: "Paneer Tikka",
        desc: "Grilled paneer cubes marinated with yogurt and Indian spices",
        price: 550,
        type: "veg",
        category: "Indian",
        subCategory: "Tandoor",
        quantity: 1
    },
    {
        id: 14,
        image: image14,
        title: "Chicken Tikka",
        desc: "Tender chicken pieces marinated in spices and grilled in tandoor",
        price: 700,
        type: "non-veg",
        category: "Indian",
        subCategory: "Tandoor",
        quantity: 1
    },
    {
        id: 15,
        image: image15,
        title: "Chocolate Brownie",
        desc: "Warm chocolate brownie served with vanilla ice cream",
        price: 400,
        type: "veg",
        category: "Desserts",
        subCategory: "Chocolate",
        quantity: 1
    },
    {
        id: 16,
        image: image16,
        title: "Cheesecake",
        desc: "Creamy classic cheesecake with a buttery biscuit base",
        price: 450,
        type: "veg",
        category: "Desserts",
        subCategory: "Cakes",
        quantity: 1
    },
    {
        id: 17,
        image: image17,
        title: "Fresh Lime Soda",
        desc: "Refreshing lime drink available in sweet and salty flavors",
        price: 200,
        type: "veg",
        category: "Beverages",
        subCategory: "Cool Drinks",
        quantity: 1
    },
    {
        id: 18,
        image: image18,
        title: "Cold Coffee",
        desc: "Chilled creamy coffee topped with chocolate and whipped cream",
        price: 300,
        type: "veg",
        category: "Beverages",
        subCategory: "Coffee",
        quantity: 1
    }
];   