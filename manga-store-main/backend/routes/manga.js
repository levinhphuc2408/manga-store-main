const express = require('express')
const router = express.Router()
const Manga = require('../models/Manga') // model manga của bạn

// Lấy danh sách manga
router.get('/', async (req, res) => {
  try {
    const mangas = await Manga.find()
    res.json(mangas)
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server khi lấy manga' })
  }
})

// Lấy chi tiết manga theo id
router.get('/:id', async (req, res) => {
  try {
    const manga = await Manga.findById(req.params.id)
    if (!manga) return res.status(404).json({ error: 'Không tìm thấy manga' })
    res.json(manga)
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server khi lấy chi tiết manga' })
  }
})

module.exports = router
