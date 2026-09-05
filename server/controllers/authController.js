const model = require('../models/authModel')
const bcrypt = require('bcrypt')
const { sendOtpEmail } = require('../utils/email')


//register

const registerUser = async (req, res)=> {
    const {name, email, password} = req.body

    const userExist = await user.findOne({email})
    if(isUserExist) {
        res.status(400).json({message: 'user already exist'})
    }
    const salt = await bcrypt.gernSalt(10)
    const hashPassword = bcrypt.hash(password, salt)

    try{
        const user = new User({name, email, password: hashPassword});
        await user.save()
        res.status(201).json({message: 'user success'})
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`OTP for ${email}: ${otp}`)
        await sendOtpEmail(email, otp, 'account_verification')
    }
    catch (error) {
        res.status(400).json({message: 'user not register'})


    }

}

module.exports = registerUser

