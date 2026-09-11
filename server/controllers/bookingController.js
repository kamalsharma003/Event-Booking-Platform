const Booking = require('../models/bookingModel')
const Event = require('../models/eventModel')
const OTP = require('../models/OTP')
const User = require('../models/authModel')
const { sendOtpEmail, sendBookingEmail } = require('../utils/email')

const OTP_VERIFICATION_WINDOW_MS = 10 * 60 * 1000
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString()

const sendBookingOTP = async (req, res) => {
    try {
        const otp = generateOtp()
        await OTP.deleteMany({ email: req.user.email, action: 'event_booking' })
        await OTP.create({ email: req.user.email, otp, action: 'event_booking' })
        await sendOtpEmail(req.user.email, otp)
        res.json({ message: 'OTP sent to your email' })
    } catch (error) {
        res.status(500).json({ message: 'Unable to send OTP. Please try again.' })
    }
}

const verifyBookingOTP = async (req, res) => {
    const { otp } = req.body

    if (!otp) {
        return res.status(400).json({ message: 'OTP is required' })
    }

    try {
        const otpRecord = await OTP.findOne({
            email: req.user.email,
            otp,
            action: 'event_booking'
        })

        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid or expired OTP' })
        }

        await OTP.deleteOne({ _id: otpRecord._id })
        await User.findByIdAndUpdate(req.user._id, { bookingOtpVerifiedAt: new Date() })
        res.json({ message: 'OTP verified' })
    } catch (error) {
        res.status(500).json({ message: 'Unable to verify OTP. Please try again.' })
    }
}

const bookEvent = async (req, res) => {
    const { eventId } = req.body

    if (!eventId) {
        return res.status(400).json({ message: 'Event is required' })
    }

    try {
        const user = await User.findById(req.user._id)
        const otpIsCurrent = user?.bookingOtpVerifiedAt &&
            Date.now() - user.bookingOtpVerifiedAt.getTime() < OTP_VERIFICATION_WINDOW_MS

        if (!user?.isVerified || !otpIsCurrent) {
            return res.status(403).json({ message: 'Please verify the booking OTP before submitting a booking.' })
        }

        const event = await Event.findById(eventId)
        if (!event) {
            return res.status(404).json({ message: 'Event not found' })
        }

        if (event.availableSeates <= 0) {
            return res.status(400).json({ message: 'No seats available' })
        }

        const existingBooking = await Booking.findOne({
            userId: req.user._id,
            eventId,
            status: { $in: ['pending', 'confirmed'] }
        })
        if (existingBooking) {
            return res.status(400).json({ message: 'You already have an active booking for this event' })
        }

        const booking = await Booking.create({
            userId: req.user._id,
            eventId,
            status: 'pending',
            paymentStatus: 'non_paid',
            amount: event.ticketPrice
        })

        await User.findByIdAndUpdate(req.user._id, { $unset: { bookingOtpVerifiedAt: 1 } })
        res.status(201).json({ message: 'Booking request created', booking })
    } catch (error) {
        res.status(500).json({ message: 'Unable to create booking. Please try again.' })
    }
}

const getMyBookings = async (req, res) => {
    const bookings = await Booking.find({ userId: req.user._id })
        .populate('eventId')
        .sort({ createdAt: -1 })
    res.json(bookings)
}

const getAllBookings = async (req, res) => {
    const bookings = await Booking.find()
        .populate('userId', 'name email')
        .populate('eventId')
        .sort({ createdAt: -1 })
    res.json(bookings)
}

const confirmBooking = async (req, res) => {
    const paymentStatus = req.body.paymentStatus || 'not_paid'
    const normalizedPaymentStatus = paymentStatus === 'not_paid' ? 'non_paid' : paymentStatus

    if (!['paid', 'non_paid'].includes(normalizedPaymentStatus)) {
        return res.status(400).json({ message: 'Invalid payment status' })
    }

    try {
        const booking = await Booking.findOneAndUpdate(
            { _id: req.params.id, status: 'pending' },
            { status: 'confirmed', paymentStatus: normalizedPaymentStatus },
            { new: true }
        ).populate('userId', 'name email').populate('eventId')

        if (!booking) {
            return res.status(400).json({ message: 'Booking is already confirmed or cancelled' })
        }

        const event = await Event.findOneAndUpdate(
            { _id: booking.eventId._id, availableSeates: { $gt: 0 } },
            { $inc: { availableSeates: -1 } },
            { new: true }
        )

        if (!event) {
            await Booking.findByIdAndUpdate(booking._id, { status: 'pending', paymentStatus: 'non_paid' })
            return res.status(400).json({ message: 'No seats are available' })
        }

        try {
            await sendBookingEmail(booking.userId.email, booking)
        } catch (error) {
            console.error('Booking confirmation email could not be sent:', error.message)
        }

        res.json({ message: 'Booking confirmed', booking })
    } catch (error) {
        res.status(500).json({ message: 'Unable to confirm booking. Please try again.' })
    }
}

const adminCancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' })
        }
        if (booking.status === 'cancelled') {
            return res.status(400).json({ message: 'Booking is already cancelled' })
        }

        const wasConfirmed = booking.status === 'confirmed'
        booking.status = 'cancelled'
        await booking.save()
        if (wasConfirmed) {
            await Event.findByIdAndUpdate(booking.eventId, { $inc: { availableSeates: 1 } })
        }
        res.json({ message: 'Booking cancelled', booking })
    } catch (error) {
        res.status(500).json({ message: 'Unable to cancel booking. Please try again.' })
    }
}

const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findOne({ _id: req.params.id, userId: req.user._id })
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' })
        }

        if (booking.status === 'cancelled') {
            return res.status(400).json({ message: 'Booking is already cancelled' })
        }

        const wasConfirmed = booking.status === 'confirmed'
        booking.status = 'cancelled'
        await booking.save()

        if (wasConfirmed) {
            await Event.findByIdAndUpdate(booking.eventId, { $inc: { availableSeates: 1 } })
        }

        res.json({ message: 'Booking cancelled', booking })
    } catch (error) {
        res.status(500).json({ message: 'Unable to cancel booking. Please try again.' })
    }
}

module.exports = {
    sendBookingOTP,
    verifyBookingOTP,
    bookEvent,
    getMyBookings,
    getAllBookings,
    confirmBooking,
    adminCancelBooking,
    cancelBooking
}

