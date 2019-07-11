const express = require('express')
const router = express.Router()

const UsersController = require('../controllers/users')

router.route('/signup')
    .post(UsersController.signUp)

router.route('/signin')
    .post(UsersController.signIn)

router.route('/secret')
    .post(UsersController.secret)

module.exports = router