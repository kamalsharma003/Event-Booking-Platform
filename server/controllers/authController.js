const User = require('../models/authModel')
const OTP = require('../models/OTP')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { sendOtpEmail } = require('../utils/email')

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString()

const registerUser = async (req, res) => {
    const { name, email, password } = req.body
    const normalizedEmail = email?.trim().toLowerCase()

    if (!name?.trim() || !normalizedEmail || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required' })
    }

    try {
        const userExists = await User.findOne({ email: normalizedEmail })
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' })
        }

        const passwordHash = await bcrypt.hash(password, 10)
        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: passwordHash,
            role: 'user'
        })
        const otp = generateOtp()

        await OTP.deleteMany({ email: normalizedEmail, action: 'account_verification' })
        await OTP.create({ email: normalizedEmail, otp, action: 'account_verification' })
        await sendOtpEmail(normalizedEmail, otp)

        res.status(201).json({ message: 'OTP sent to your email', email: user.email })
    } catch (error) {
        res.status(400).json({ message: 'User registration failed' })
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body
    const normalizedEmail = email?.trim().toLowerCase()

    if (!normalizedEmail || !password) {
        return res.status(400).json({ message: 'Email and password are required' })
    }

    try {
        const user = await User.findOne({ email: normalizedEmail })
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: 'Invalid email or password' })
        }

        const otp = generateOtp()
        await OTP.deleteMany({ email: normalizedEmail, action: 'login' })
        await OTP.create({ email: normalizedEmail, otp, action: 'login' })
        await sendOtpEmail(normalizedEmail, otp)

        res.json({ message: 'OTP sent to your email', email: user.email })
    } catch (error) {
        res.status(500).json({ message: 'Login failed' })
    }
}

const verifyOtp = async (req, res) => {
    const { email, otp, action } = req.body
    const normalizedEmail = email?.trim().toLowerCase()

    if (!normalizedEmail || !otp || !['account_verification', 'login'].includes(action)) {
        return res.status(400).json({ message: 'Invalid verification request' })
    }

    try {
        const validOtp = await OTP.findOne({ email: normalizedEmail, otp, action })
        if (!validOtp) {
            return res.status(400).json({ message: 'Invalid or expired OTP' })
        }

        const user = await User.findOne({ email: normalizedEmail })
        if (!user) {
            return res.status(400).json({ message: 'User not found' })
        }

        await OTP.deleteOne({ _id: validOtp._id })
        user.isVerified = true
        await user.save()

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' })
        res.json({
            message: 'Authentication successful',
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        })
    } catch (error) {
        res.status(500).json({ message: 'OTP verification failed' })
    }
}

module.exports = { registerUser, loginUser, verifyOtp }
