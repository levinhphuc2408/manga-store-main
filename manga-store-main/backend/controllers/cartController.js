const User = require('../models/User');
const Manga = require('../models/Manga');

// GET: view cart
const getCart = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('cart.mangaId');
        res.json(user.cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST: add manga to cart
const addToCart = async (req, res) => {
    try {
        const { mangaId, quantity } = req.body;
        const user = await User.findById(req.user.id);

        const itemIndex = user.cart.findIndex(item => item.mangaId.equals(mangaId));
        if (itemIndex > -1) {
            user.cart[itemIndex].quantity += quantity;
        } else {
            user.cart.push({ mangaId, quantity });
        }

        await user.save();
        res.json(user.cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE: remove manga from cart
const removeFromCart = async (req, res) => {
    try {
        const { mangaId } = req.params;

        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ msg: 'User not found' });

        user.cart = user.cart.filter(item => item.mangaId.toString() !== mangaId);

        await user.save();

        res.status(200).json({ msg: 'Item removed from cart' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const viewCart = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('cart.mangaId');

        if (!user) return res.status(404).json({ msg: 'User not found' });

        res.status(200).json(user.cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



module.exports = {
    getCart,
    addToCart,
    removeFromCart,
    viewCart,
};



