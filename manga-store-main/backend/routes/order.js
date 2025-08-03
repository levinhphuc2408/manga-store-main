const express = require('express')
const router = express.Router()
const Order = require('../models/Order')
const { verifyToken } = require('../middleware/authMiddleware')

// Tạo đơn hàng mới (checkout)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { customer, items, totalPrice } = req.body
    if (!customer || !items || items.length === 0 || !totalPrice) {
      return res.status(400).json({ message: 'Thiếu dữ liệu đơn hàng' })
    }

    const newOrder = new Order({
      userId: req.user.userId, // lấy userId từ token
      customer,
      items,
      totalPrice,
      status: 'pending',
    })

    await newOrder.save()
    res.status(201).json({ message: 'Tạo đơn hàng thành công', order: newOrder })
  } catch (error) {
    res.status(500).json({ message: 'Lỗi tạo đơn hàng', error: error.message })
  }
})

// Lấy danh sách đơn hàng của user đã đăng nhập
router.get('/myorders', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId }).sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy đơn hàng', error: error.message })
  }
})

module.exports = router
