const express = require('express')
const router = express.Router()
const passport = require('passport')

const passportConf = require('../passport')

const { validateBody, schemas } = require('../helpers/routerHelpers')
const UsersController = require('../controllers/users')

router.route('/signup')
  .post(validateBody(schemas.authSchema), UsersController.signUp)

router.route('/signin')
  .post(UsersController.signIn)

router.route('/secret')
  .post(passport.authenticate('jwt', { session: false }), UsersController.secret)

module.exports = router