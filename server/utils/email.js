
const nodemailer = require('nodemailer')
const dotenv = require('dotenv')

dotenv.config()

// Create transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

// Send OTP email
const sendOtpEmail = async (otp, email, type) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is: ${otp}`
        }

        await transporter.sendMail(mailOptions)

        console.log(`OTP email sent to ${email} for ${type}`)
    } catch (error) {
        console.log(
            `Error sending OTP email to ${email} for ${type}:`,
            error
        )
    }
}

// Send booking confirmation email
const sendBookingEmail = async (email, booking) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Booking Confirmation',
            text: `
Your booking has been confirmed!

Booking ID: ${booking.id}
Date: ${booking.date}
Time: ${booking.time}
Service: ${booking.service}

Thank you for booking with us.
            `
        }

        await transporter.sendMail(mailOptions)

        console.log(`Booking email sent to ${email}`)
    } catch (error) {
        console.log(`Error sending booking email to ${email}:`, error)
    }
}

// Export both functions
module.exports = {
    sendOtpEmail,
    sendBookingEmail
}