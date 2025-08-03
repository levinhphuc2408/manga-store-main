const Order = require('../models/Order')

// Lấy lịch sử đơn hàng của user đăng nhập
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.userId
    const orders = await Order.find({ 'customer.userId': userId }).sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error })
  }
}
