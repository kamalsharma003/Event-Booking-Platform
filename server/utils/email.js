const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

const sendOtpEmail = async (email, otp) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your Eventora OTP Code',
        text: `Your Eventora OTP code is: ${otp}`
    })
}

const sendBookingEmail = async (email, booking) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Eventora booking confirmed',
        text: `Your booking for ${booking.eventId.title} has been confirmed.\n\nBooking ID: ${booking._id}\nEvent date: ${new Date(booking.eventId.date).toLocaleString()}\nLocation: ${booking.eventId.location}\nAmount: ${booking.amount}`
    })
}

module.exports = { sendOtpEmail, sendBookingEmail }
