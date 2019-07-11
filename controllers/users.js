module.exports = {
    signUp: async (req, res, next) => {
        try {
            console.log('UsersController.signUp called!')
            next()
        } catch (error) {
            next(error)
        }
    },

    signIn: async (req, res, next) => {
        try {
            console.log('UsersController.signIn called!')
            next()
        } catch (error) {
            next(error)
        }
    },

    secret: async (req, res, next) => {
        try {
            console.log('UsersController.secret called!')
            next()
        } catch (error) {
            next(error)
        }
    }
}