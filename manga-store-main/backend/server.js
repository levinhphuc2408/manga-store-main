const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())

// Routes
const authRoutes = require('./routes/auth')
const orderRoutes = require('./routes/order')
const mangaRoutes = require('./routes/manga')
const adminRouter = require('./routes/admin')
app.use('/api/auth', authRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/mangas', mangaRoutes)
app.use('/api/admin', adminRouter)

// Các route khác, ví dụ manga...

const PORT = process.env.PORT || 5000
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected')
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch(err => console.log(err))
