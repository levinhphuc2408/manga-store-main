const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyToken } = require('../middleware/authMiddleware'); // import chính xác hàm verifyToken

// Lấy giỏ hàng của user
router.get('/', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // Lưu ý dùng req.user.id, vì middleware bạn set là req.user = decoded {id, role}
    if (!user) return res.status(404).json({ message: 'User không tồn tại' });
    res.json(user.cart || []);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server khi lấy giỏ hàng' });
  }
});

// Thêm món vào giỏ hàng
router.post('/add', verifyToken, async (req, res) => {
  try {
    const { mangaId, title, price, quantity } = req.body;
    if (!mangaId || !title || !price || !quantity) {
      return res.status(400).json({ message: 'Thiếu dữ liệu' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User không tồn tại' });

    const existingIndex = user.cart.findIndex(item => item.mangaId.toString() === mangaId);
    if (existingIndex >= 0) {
      user.cart[existingIndex].quantity += quantity;
    } else {
      user.cart.push({ mangaId, title, price, quantity });
    }

    await user.save();
    res.json({ message: 'Đã thêm vào giỏ hàng', cart: user.cart });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server khi thêm giỏ hàng' });
  }
});

// Xóa item khỏi giỏ hàng
router.post('/remove', verifyToken, async (req, res) => {
  try {
    const { mangaId } = req.body;
    if (!mangaId) return res.status(400).json({ message: 'Thiếu mangaId' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User không tồn tại' });

    user.cart = user.cart.filter(item => item.mangaId.toString() !== mangaId);

    await user.save();
    res.json({ message: 'Đã xóa khỏi giỏ hàng', cart: user.cart });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server khi xóa giỏ hàng' });
  }
});

module.exports = router;
