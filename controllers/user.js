const jwt = require('jsonwebtoken')
const User = require('../models/user')


exports.createUser = async (req, res) => {
  const { username, phone, password } = req.body
  const isNewPhone = await User.isPhoneInUse(phone)
  if (!isNewPhone) {
    return res.json({ success: false, message: 'This phone number already exists!' })
  }

  const user = await User({
    username,
    phone,
    password
  })
  await user.save()
  res.json({ success: true, user })
}

exports.userSignIn = async (req, res) => {
  const { phone, password } = req.body
  const user = await User.findOne({ phone })
  if (!user) return res.json({ success: false, message: 'user not found with given phone number' })

  if (user.password != password) return res.json({ success: false, message: 'wrong password' })

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1d'
  })

  let oldTokens = user.tokens || []

  if (oldTokens.length) {
    oldTokens = oldTokens.filter(t => {
      const timeDiff = (Date.now() - parseInt(t.signedAt)) / 1000
      if (timeDiff < 86400) {
        return t
      }
    })
  }

  await User.findByIdAndUpdate(user._id, {
    tokens: [...oldTokens, { token, signedAt: Date.now().toString() }],
  })

  const userInfo = {
    username: user.username,
    phone: user.phone,
    // avatar: user.avatar
  }

  return res.json({ success: true, user: userInfo, token: token })

}


exports.signOut = async (req, res) => {
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];
    console.log(token)
    try {
      if (!token) {
        return res.status(401).json({ success: false, message: 'Authorization fail!' });
      }
      
      const tokens = req.user.tokens
      const user = req.user
      // const user = req.user.phone
      // console.log(tokens)
      console.log(user)
      
      const newTokens = tokens.filter(t => t.token !== token);

      await User.findByIdAndUpdate(req.user._id, { tokens: newTokens });
      return res.json({ success: true, message: 'Sign out successfully!' });

    } catch (error) {
      res.json({ success: false, message:'Failed!'})
    }
  }
}

exports.postPrice = async (req, res) => {
  const user = req.body
  const newPrice = user.price
  const newAmount = user.amount

  const oldPrice = req.user.price
  const oldAmount = req.user.amount
  try {
    await User.findByIdAndUpdate(req.user._id,{price : [...oldPrice, newPrice ]})
    await User.findByIdAndUpdate(req.user._id,{amount : [...oldAmount, newAmount ]})    
    res.json({
      success: true,
      totalPrice : newPrice,
      amount : newAmount,
    })
  } catch (error) {
    res.send({
      success: false,
      error: 'Error !'
    })
  }
  // console.log('req.user._id.price : ',[...oldPrice, newPrice ],[...oldAmount, newAmount ],req.user._id)
  // console.log(user)

}