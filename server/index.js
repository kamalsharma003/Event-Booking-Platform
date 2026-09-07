const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const authRoute = require('./routes/authRoute')
const bookingRoute = require('./routes/booking')
const eventRoute = require('./routes/event')

dotenv.config();

const app = express();

app.use('/api/auth', authRoute)

mongoose.connect(process.env.MONGODB_URL)
.then( ()=>{
    console.log('mongo connected')
})
.catch((error) =>{
    console.log('not connected', error)
})


const PORT = process.env.PORT || 5000
app.listen(PORT, ()=>{
    console.log(`server running on ${PORT}`)
})


