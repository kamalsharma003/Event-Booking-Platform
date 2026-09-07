const express = require('express')
const router = express.Router()

router.post('/', protect, BlobEvent)
router.post('/send-otp', protect, sendBookingOTP)
router.get('/my', protect, getMyBooking)
router.put('/:id/confirm', protect,admin ,Confirmbooking )
router.delete('/:id', cancelBooking)

module.exports = router


