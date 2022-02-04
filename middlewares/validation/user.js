const {check,validationResult} = require('express-validator')

exports.validateUserSignUp = [
    check('username').trim().isLength({ min:3 , max:20}).withMessage('Name Must be within 3 to 20 characters'),
    check('phone').trim().not().isEmpty().isLength({ min:10 , max:10}).withMessage('Invalid Number'),
    check('password').trim().not().isEmpty().withMessage('Password is empty!').isLength({ min:6 , max:20}).withMessage('Password Must be 6 to 20 characters long'),
    check('confirmPassword').trim().not().isEmpty().custom((value,{req})=>{
        if(value !== req.body.password){
            throw new Error('Both passwords must be same!')
        }
        return true
    })
]

exports.userValidation = (req,res,next) =>{
    const result = validationResult(req).array()
    if(!result.length) return next()
    // console.log(result)
    const error = result[0].msg
    res.send({success:false,message:error})
}

exports.validateUserSignIn = [
    check('phone').trim().not().isEmpty().withMessage('Phone number required!'),
    check('password').trim().not().isEmpty().withMessage('password required!')
]