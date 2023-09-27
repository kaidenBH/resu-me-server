const jwt = require('jsonwebtoken');
const axios = require('axios');
const User = require('../models/user');
const dotenv = require('dotenv');
dotenv.config();

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return next();
        }

        // Verify the token
        jwt.verify(token.split(' ')[1], process.env.SECRET_TOKEN, async (err, decoded) => {
            if (err) {
                console.log(token.split(' ')[1]);
                return res.status(401).json({ message: 'Token verification failed.' });
            }

            // Search for the user using the decoded _id
            try {
                const user = await User.findOne({ _id: decoded.id });
                if (!user) {
                    return res.status(401).json({ message: 'User not found.' });
                }

                req.user = user; // Assign the user to req.user
                next();
            } catch (error) {
                console.log(error);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = auth;
