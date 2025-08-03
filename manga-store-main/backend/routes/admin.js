const express = require('express')
const router = express.Router()
const Manga = require('../models/Manga')
const { verifyToken } = require('../middleware/authMiddleware')
const { verifyAdmin } = require('../middleware/adminMiddleware')

// Lấy danh sách manga (admin)
router.get('/mangas', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const mangas = await Manga.find()
    res.json(mangas)
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách manga', error: err.message })
  }
})

// Thêm manga mới (admin)
router.post('/mangas', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const manga = new Manga(req.body)
    await manga.save()
    res.status(201).json(manga)
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi tạo manga', error: err.message })
  }
})

// Cập nhật manga (admin)
router.put('/mangas/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const manga = await Manga.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!manga) return res.status(404).json({ message: 'Manga không tồn tại' })
    res.json(manga)
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi cập nhật manga', error: err.message })
  }
})

// Xóa manga (admin)
router.delete('/mangas/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const manga = await Manga.findByIdAndDelete(req.params.id)
    if (!manga) return res.status(404).json({ message: 'Manga không tồn tại' })
    res.json({ message: 'Xóa manga thành công' })
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi xóa manga', error: err.message })
  }
})

module.exports = router
