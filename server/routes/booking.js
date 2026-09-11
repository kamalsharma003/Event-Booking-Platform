const express = require('express')
const router = express.Router()
const { protect, admin } = require('../middleware/auth')
const {
    sendBookingOTP,
    verifyBookingOTP,
    bookEvent,
    getMyBookings,
    getAllBookings,
    confirmBooking,
    adminCancelBooking,
    cancelBooking
} = require('../controllers/bookingController')

router.post('/send-otp', protect, sendBookingOTP)
router.post('/verify-otp', protect, verifyBookingOTP)
router.post('/', protect, bookEvent)
router.get('/my', protect, getMyBookings)
router.get('/', protect, admin, getAllBookings)
router.put('/:id/confirm', protect, admin, confirmBooking)
router.put('/:id/cancel', protect, admin, adminCancelBooking)
router.delete('/:id', protect, cancelBooking)

module.exports = router

