const express = require('express')

const {registerUser, loginUser, verifyOtp} = require('../controllers/authController')

const router = express.Router()


router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/verify', verifyOtp)


module.exports = router