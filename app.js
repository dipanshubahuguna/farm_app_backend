const { json } = require('express')
const express = require('express')
require('dotenv').config()
require('./models/db')

const port = process.env.PORT || 8000
const userRouter = require('./routes/user')

const User = require('./models/user')
const app = express()

app.use(express.json())
app.use(userRouter)

app.get('/', (req, res) => {
    res.json({success: true,message:'Welcome to main route!'})
})

app.listen(port, () => {
    console.log(`App is running on port: ${port}`)
})


