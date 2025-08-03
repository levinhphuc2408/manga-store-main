const Manga = require('../models/Manga');

// GET all
const getAllMangas = async (req, res) => {
    try {
        const mangas = await Manga.find().sort({ createdAt: -1 });
        res.json(mangas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET single
const getMangaById = async (req, res) => {
    try {
        const manga = await Manga.findById(req.params.id);
        if (!manga) return res.status(404).json({ msg: 'Manga not found' });
        res.json(manga);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST create
const createManga = async (req, res) => {
    try {
        const { title, author, genre, price, stock, coverImage, description } = req.body;

        const newManga = new Manga({
            title, author, genre, price, stock, coverImage, description
        });

        const saved = await newManga.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// PUT update
const updateManga = async (req, res) => {
    try {
        const updated = await Manga.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ msg: 'Manga not found' });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE
const deleteManga = async (req, res) => {
    try {
        const deleted = await Manga.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ msg: 'Manga not found' });
        res.json({ msg: 'Manga deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAllMangas,
    getMangaById,
    createManga,
    updateManga,
    deleteManga
};
