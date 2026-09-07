const jwt = require('jsonwebtoken')
const User = require('../models/authModel')

const protect = async (req, res, next) =>{
    let token = req.headers.authorization &&  req.headers.authorization.startsWith('Bearer') ?  req.headers.authorization.split(' ')[1]: null

    if(token){
        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = await User.findById(decoded.id).select('-password')
            if(!req.user){
                return res.status(401).json({message: 'not athorize'})
            }
            next()
        } catch (error){
            return res.status(401).json({message: 'not authorize, token failed'})
        }
    }
    else{
        return res.status(401).json({message: 'not authorize, no token '})
    }
 }

 const admin = (req, res, next) =>{
    if(req.user && req.user.role === 'admin'){
        next()
    }
    else{
        return res.status(403).json({message: 'forbiden, admin can access only'})
    }
 }

 module.exports = {protect, admin}

