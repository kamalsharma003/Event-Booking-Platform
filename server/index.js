const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const authRoute = require('./routes/authRoute')
const bookingRoute = require('./routes/booking')
const eventRoute = require('./routes/event')

dotenv.config()

const app = express()
app.use(express.json())
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL || 'http://localhost:5173')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    if (req.method === 'OPTIONS') {
        return res.sendStatus(204)
    }

    next()
})

app.use('/api/auth', authRoute)
app.use('/api/event', eventRoute)
app.use('/api/booking', bookingRoute)

mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log('MongoDB connected'))
    .catch((error) => console.log('MongoDB connection failed', error.message))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on ${PORT}`))
