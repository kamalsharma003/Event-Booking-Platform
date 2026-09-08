const User = require('../models/authModel')
const OTP = require('../models/OTP')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { sendOtpEmail } = require('../utils/email')

// Register
const registerUser = async (req, res) => {
    const { name, email, password } = req.body
    try {
        const userExist = await User.findOne({ email })
        if (userExist) {
            return res.status(400).json({ message: 'User already exists' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const user = await User.create({ name, email, password: hashPassword, role: 'user' })

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
        await OTP.create({ email, otp: otpCode, action: 'account_verification' })
        await sendOtpEmail(email, otpCode, 'account_verification')

        res.status(201).json({ message: 'User registered successfully', email: user.email })
    } catch (error) {
        res.status(400).json({ message: 'User registration failed', error: error.message })
    }
}

// Login
// Login
const loginUser = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' })
        }

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
        await OTP.create({ email, otp: otpCode, action: 'login' })
        await sendOtpEmail(email, otpCode, 'login')

        res.status(200).json({ message: 'OTP sent to your email', email: user.email })
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message })
    }
}

// Verify OTP (completes login)
const verifyOtp = async (req, res) => {
    const { email, otp } = req.body
    try {
        const validOtp = await OTP.findOne({ email, otp, action: 'login' })
        if (!validOtp) {
            return res.status(400).json({ message: 'Invalid or expired OTP' })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: 'User not found' })
        }

        await OTP.deleteOne({ _id: validOtp._id })

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' })

        res.status(200).json({
            message: 'Login successful',
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        })
    } catch (error) {
        res.status(500).json({ message: 'OTP verification failed', error: error.message })
    }
}

module.exports = { registerUser, loginUser, verifyOtp } 

