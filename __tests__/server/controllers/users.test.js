const chai = require('chai')
const { expect } = chai
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const faker = require('faker')
const rewire = require('rewire')

const User = require('../../../server/models/user')
const userController = rewire('../../../server/controllers/users')

chai.use(sinonChai)

let sandbox = sinon.createSandbox()

describe('Users controllers suite: ', function () {
  let req = {
    user: { id: faker.random.number() },
    value: {
      body: {
        email: faker.internet.email(),
        password: faker.internet.password()
      }
    }
  }

  let res = {
    json: function () {
      return this
    },
    status: function () {
      return this
    }
  }

  beforeEach(function () {
    var sandbox = sinon.createSandbox()
  })

  afterEach(function () {
    sandbox.restore()
  })

  describe('secret', () => {
    it('should return secret resource when called', () => {
      sandbox.spy(res, 'json')

      return userController.secret(req, res)
        .then(() => {
          expect(res.json.calledWith({ secret: 'resource' })).to.be.ok
          expect(res.json).to.have.been.calledWith({ secret: 'resource' })
        })
        .catch(error => { throw new Error(error) })
    })
  })

  describe('signIn', () => {
    it('should have status 200 and be called once', () => {
      sandbox.spy(res, 'json')
      sandbox.spy(res, 'status')

      return userController.signIn(req, res)
        .then(() => {
          expect(res.status).to.have.been.calledWith(200)
          expect(res.json.callCount).to.equal(1)
        })
        .catch(error => { throw new Error(error) })
    })

    it('should return fake token using rewire', () => {
      sandbox.spy(res, 'json')

      // fake jwt with rewire
      let signToken = userController.__set__('signToken', user => 'fakeToken')

      return userController.signIn(req, res)
        .then(() => {
          expect(res.json.calledWith({ token: 'fakeToken' })).to.be.ok
          expect(res.json).to.have.been.calledWith({ token: 'fakeToken' })
          signToken()
        })
        .catch(error => { throw new Error(error) })
    })
  })

  describe('signUp', () => {
    it('should return 403 if the user is already in the db', () => {
      sandbox.spy(res, 'json')
      sandbox.spy(res, 'status')
      sandbox.stub(User, 'findOne').returns(Promise.resolve({ id: faker.random.number() }))

      return userController.signUp(req, res)
        .then(() => {
          expect(res.status).to.have.been.calledWith(403)
          expect(res.json).to.have.been.calledWith({ error: 'Email is already in use' })
        })
        .catch(error => { throw new Error(error) })
    })

    it('should return 200 if user is not in db and it was saved', () => {
      sandbox.spy(res, 'json')
      sandbox.spy(res, 'status')
      sandbox.stub(User, 'findOne').returns(Promise.resolve(false))
      sandbox.stub(User.prototype, 'save').returns(Promise.resolve({ id: faker.random.number() }))

      return userController.signUp(req, res)
        .then(() => {
          expect(res.status).to.have.been.calledWith(200)
          expect(res.json.callCount).to.equal(1)
        }).catch(error => { throw new Error(error) })
    })

    it('should return 200 if user in not in db using callback done', done => {
      sandbox.spy(res, 'status')
      sandbox.spy(res, 'json')
      sandbox.stub(User, 'findOne').returns(Promise.resolve(false))
      sandbox.stub(User.prototype, 'save').returns(Promise.resolve({ id: faker.random.number() }))

      userController.signUp(req, res).then(done())

      expect(res.satus).to.have.been.calledWith(200)
      expect(res.json.callCount).to.equal(1)
    })

    it('should return fake token in res.json', () => {
      sandbox.spy(res, 'status')
      sandbox.spy(res, 'json')
      sandbox.stub(User, 'findOne').returns(Promise.resolve(false))
      sandbox.stub(User.prototype, 'save').returns(Promise.resolve({ id: faker.random.number() }))

      let token = 'fakeToken'
      let signToken = userController.__set__('signToken', user => token)

      return userController.signUp(req, res).then(() => {
        expect(res.json).to.have.been.calledWith({ token })
        signToken()
      }).catch(error => { throw new Error(error)})
    })
  })
})