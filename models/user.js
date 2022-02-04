const mongoose = require('mongoose')

const user = {
    username:'',
    phone: '',
    password: '',
    avatar:''
}

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    avatar:{
        type:Buffer
    },
    tokens: [{type: Object}],
    price: {
        type: Number,
        default: 0
    }
})

userSchema.statics.isPhoneInUse = async function(phone){
    if(!phone) throw new Error('Invalid Phone number')
    try{
        const user = await this.findOne({phone})
        if(user) return false

        return true
    }catch(error){
        console.log('some error',error.message)
        return false
    }
}

module.exports = User = mongoose.model('user',userSchema)