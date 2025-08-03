const mongoose = require('mongoose');

const MangaSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    coverImage: { type: String }, // URL or local path
    description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Manga', MangaSchema);
