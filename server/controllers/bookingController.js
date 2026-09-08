// const booking = require('../models/bookingModel')
// const OTP = require('../models/OTP')
// const event = require('../models/eventModel')

// const {sendOTPEmail, sendBookingEmail} = require('../utils/email')

// const generateOtp = () =>{
//     return Math.floor(100000 +Math.random * 900000 ).toString();


// }

// const sendBookingOTP = async (req, res) =>{
//     const otp = generateOtp()
//     await OTP.findOneAndDelete({email: req.user.email, action: 'event_booking'})
//     await OTP.create({email: req.user.email, otp: otp, action: 'event_booking'})
//     await sendOTPEmail(req.user.email, otp, 'event_booking')
//     res.json({message:'OTP sent to email'})
    
// }

// const bookEvent = async (req, res) =>{
//    const {eventId , otp} = req.body

//    const otpRecord = await OTP.findOne({email: req.user.email, otp: otp, action: 'event_booking'})
//    if(!otpRecord){
//     return res.status(400).json({error:'Invalid or expire otp'})
//    }
//    const event = await Event.findById(eventId)
//    return res.status(404).json({error:'Event not found'})

//    if(event.totalSeates <= 0){

//        return res.status(400).json({error: 'No seats available'})
//     }
//     const existingBooking = await booking.findOne(userId: req.user_id, eventId)
//     if(existingBooking){
//         return res.status(400).json({error:'you have already booked this event'})
//     }
//     const booking = await Booking.create({
//         userId: req.user_id,
//         eventId,
//         status:'pending',
//         paymentStatus: 'non_paid',
//         amount: event.ticketPrice
//     })

//     await OTP.deleteMany({email: req.user.email, action: 'event_booking'})
//     return res.status(201).json({message:'booking created, check email for confirmation'})


    
// }

// const confirmBooking = async (req, res) =>{
//     const paymentStatus = req.body.paymentStatus
//     if(!['paid', 'non_paid'].includes(paymentStatus)){
//         return res.status(400).json({error: 'Invalid payment status'})
//     }
//     const booking = await Booking.findById(req.param.id).populate('eventId')
//     if(!booking){

//         return res.status(404).json({error:'booking not found'})
//     }
//     if(booking.status === 'confirmed'){

//         return res.status(400).json({error: 'booking is already confirmed'})
//     }
//     const event = await Event.findById(booking.eventId._id)
//     if(event.totalSeates <= 0){
//         return res.status(400).json({error: 'no sreats available'})
//     }
//     booking.status = 'confirmed'
//     if(paymentStatus){
//         booking.paymentStatus = paymentStatus;

//     }
//     await booking.save();
//     event.totalSeates -= 1;
//     await event.save();

//     await sendBookingEmail(req.user.email, event.title, booking._id)

//     res.json({error: 'Booking confirmed'})
// }

// const getMyBookings = async (req, res) =>{
//     const booking = await Booking.find(userId: req.user._id).populate('eventId')
//     res.json(booking)
// }

// const cancelBooking = async (req, res) =>{
//     const booking = await Booking.findById(req.param.id)
//     if(!booking){
//         return res.status(404).json({message: 'Booking not found'})
//     }
//     if (booking.userId.toString() !== req.user._id.toString());
//     return res.status(403).json({error:'Unauthorized'})

//     booking.status = 'cancelled'
//      await booking.save();

//      if(booking.status === 'confirmed'){
//         const event = await Event.findById(booking.eventId._id)
//         event.totalSeates += 1
//         await event.save();
//      }
//      await booking.remove();
//      res.json({message: 'Booking cancelled'})

// }

const Booking = require('../models/bookingModel')
const OTP = require('../models/OTP')
const Event = require('../models/eventModel')

const { sendOTPEmail, sendBookingEmail } = require('../utils/email')

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

const sendBookingOTP = async (req, res) => {
    const otp = generateOtp()
    await OTP.findOneAndDelete({ email: req.user.email, action: 'event_booking' })
    await OTP.create({ email: req.user.email, otp: otp, action: 'event_booking' })
    await sendOTPEmail(req.user.email, otp, 'event_booking')
    res.json({ message: 'OTP sent to email' })
}

const bookEvent = async (req, res) => {
    const { eventId, otp } = req.body

    const otpRecord = await OTP.findOne({ email: req.user.email, otp: otp, action: 'event_booking' })
    if (!otpRecord) {
        return res.status(400).json({ error: 'Invalid or expired otp' })
    }

    const event = await Event.findById(eventId)
    if (!event) {
        return res.status(404).json({ error: 'Event not found' })
    }

    if (event.totalSeats <= 0) {
        return res.status(400).json({ error: 'No seats available' })
    }

    const existingBooking = await Booking.findOne({ userId: req.user._id, eventId })
    if (existingBooking) {
        return res.status(400).json({ error: 'you have already booked this event' })
    }

    const newBooking = await Booking.create({
        userId: req.user._id,
        eventId,
        status: 'pending',
        paymentStatus: 'non_paid',
        amount: event.ticketPrice
    })

    await OTP.deleteMany({ email: req.user.email, action: 'event_booking' })
    return res.status(201).json({ message: 'booking created, check email for confirmation' })
}

const confirmBooking = async (req, res) => {
    const paymentStatus = req.body.paymentStatus
    if (!['paid', 'non_paid'].includes(paymentStatus)) {
        return res.status(400).json({ error: 'Invalid payment status' })
    }

    const booking = await Booking.findById(req.params.id).populate('eventId')
    if (!booking) {
        return res.status(404).json({ error: 'booking not found' })
    }
    if (booking.status === 'confirmed') {
        return res.status(400).json({ error: 'booking is already confirmed' })
    }

    const event = await Event.findById(booking.eventId._id)
    if (event.totalSeats <= 0) {
        return res.status(400).json({ error: 'no seats available' })
    }

    booking.status = 'confirmed'
    booking.paymentStatus = paymentStatus
    await booking.save()

    event.totalSeats -= 1
    await event.save()

    await sendBookingEmail(req.user.email, event.title, booking._id)

    res.json({ message: 'Booking confirmed' })
}

const getMyBookings = async (req, res) => {
    const bookings = await Booking.find({ userId: req.user._id }).populate('eventId')
    res.json(bookings)
}

const cancelBooking = async (req, res) => {
    const booking = await Booking.findById(req.params.id)
    if (!booking) {
        return res.status(404).json({ message: 'Booking not found' })
    }
    if (booking.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Unauthorized' })
    }

    const wasConfirmed = booking.status === 'confirmed'
    booking.status = 'cancelled'
    await booking.save()

    if (wasConfirmed) {
        const event = await Event.findById(booking.eventId)
        event.totalSeats += 1
        await event.save()
    }

    await booking.deleteOne()
    res.json({ message: 'Booking cancelled' })
}

module.exports = { sendBookingOTP, bookEvent, confirmBooking, getMyBookings, cancelBooking }