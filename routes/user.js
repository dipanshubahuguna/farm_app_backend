const express = require('express')

const router = express.Router()

const User = require('../models/user')

const {createUser, userSignIn, signOut, postPrice} = require('../controllers/user')
const { isAuth } = require('../middlewares/auth')
const { validateUserSignUp, userValidation, validateUserSignIn } = require('../middlewares/validation/user')

router.post('/create-user',validateUserSignUp,userValidation,createUser)
router.post('/sign-in',validateUserSignIn,userValidation,userSignIn)
router.get('/sign-out',isAuth,signOut)

router.get('/profile',isAuth,(req,res)=>{
    if(!req.user){
        return res.json({ success: false,message: 'unauthorized access 123!'})
    }
    res.json({
        success: true,
        profile: {
            username: req.user.username,
            phone: req.user.phone,
        }
    })
})
module.exports = router