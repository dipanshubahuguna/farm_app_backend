const jwt = require('jsonwebtoken')
const User = require('../models/user')

exports.isAuth = async (req,res,next) =>{

    if(req.headers && req.headers.authorization){
        const token = req.headers.authorization.split(' ')[1]
        try{
            const decode = jwt.verify(token,process.env.JWT_SECRET)
            // console.log(decode)
    
            const user = await User.findById(decode.userId)

            // console.log(user)
    
            if(!user){
                return res.json({success: false,message: 'unauthorized access 1!'})
            }
    
            req.user = user
            next()
        }catch(error){
            if(error.name == 'JsonWebTokenError'){
                return res.json({ success: false,message: 'unauthorized access 2!'})
            }
            if(error.name == 'TokenExpiredError'){
                return res.json({ success: false,message: 'session expired!'})
            }

            res.json({ success: false,message: 'Internal server error!'})
        }

    }else{
        res.json({success: false,message: 'unauthorized access 3!'})
    }

    // console.log(req.headers.authorization)
}