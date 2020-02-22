const express = require('express')

const router = express.Router()

const userRouter = require('./user/user-router')

router.get('/api', (req, res) => {
    res.send("Hey! You're looking at the Matterwiki API")
})

router.use('/api/user', userRouter)

module.exports = router
