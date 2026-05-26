const userModel = require('../models/user.model');
const Blacklist = require('../models/blacklist');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * @name registerUserController
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public   
 */
async function registerUserController(req, res) {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email, and password are required' });
    }
    try {
        const existingUser = await userModel.findOne({
            $or: [{ username }, { email }]
        });

        if (existingUser) {
            return res.status(400).json({ message: 'Account already exists with this username or email' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new userModel({
            username,
            email,
            password: hashedPassword
        });

        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        await newUser.save();

        res.cookie("token", token);
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * @name loginUserController
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public   
 */
async function loginUserController(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.cookie("token", token);
        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * @name logoutUserController
 * @route POST /api/auth/logout
 * @desc Logout a user by blacklisting the token
 * @access Public 
 */

async function logoutUserController(req, res) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(400).json({ message: 'No token provided' });
    }
    await Blacklist.create({ token })
    res.clearCookie("token");
    res.status(200).json({ message: 'Logout successful' });
};

/**
 * @name getUserProfileController
 * @route GET /api/auth/get-me
 * @desc Get the current logged in user's details
 * @access Private 
 */
async function getMeController(req, res) {
    const user = await userModel.findById(req.user.userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
};


module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
};