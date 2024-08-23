const { verify } = require('jsonwebtoken');
require('dotenv').config();

const validateToken = (req, res, next) => {
    const accessToken = req.header("accessToken");

    if (accessToken) {
        try {
            const validToken = verify(accessToken, process.env.JWT_SECRET);
            req.user = validToken;
            if (validToken) {
                return next();
            }
        } catch (err) {
            res.json({ error: err });
        }
    } else {
        res.json({ error: "User not logged in!" });
    }
};

module.exports = { validateToken };