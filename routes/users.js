const express = require('express')
const router = express.Router()

const { validateBody, schemas } = require('../helpers/routerHelpers')
const UsersController = require('../controllers/users')

router.route('/signup')
  .post(validateBody(schemas.authSchema), UsersController.signUp)

router.route('/signin')
  .post(UsersController.signIn)

router.route('/secret')
  .post(UsersController.secret)

module.exports = router