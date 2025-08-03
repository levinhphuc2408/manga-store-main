const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'

// Đăng ký user mới
exports.register = async (req, res) => {
  const { username, email, password } = req.body
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' })
  }
  try {
    const existUser = await User.findOne({ email })
    if (existUser) return res.status(400).json({ message: 'Email đã được đăng ký' })

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({ username, email, password: hashedPassword })
    await newUser.save()

    res.status(201).json({ message: 'Đăng ký thành công' })
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error })
  }
}

// Đăng nhập
exports.login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu' })
  }
  try {
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' })

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' })

    res.json({
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error })
  }
}
