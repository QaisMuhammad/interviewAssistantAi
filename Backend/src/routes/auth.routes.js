const {Router} = require('express');

const authRouter = Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public   
 */
authRouter.post('/register', authController.registerUserController);

/**
 * @route POST /api/auth/login
 * @desc Login a user with email and password
 * @access Public   
 */
authRouter.post('/login', authController.loginUserController);

/**
 * @route POST /api/auth/logout
 * @desc Logout a user by blacklisting the token
 * @access Private   
 */
authRouter.post('/logout', authController.logoutUserController);

/**
 * @route GET /api/auth/get-me
 * @desc Get the current logged in user's details
 * @access Private   
 */
authRouter.get('/get-me', authMiddleware.authUser, authController.getMeController);




module.exports = authRouter;