const { sign, verify } = require("jsonwebtoken");

const createTokens = (user) => {
    const accessToken = sign(
        { 
            id: user.uID, 
            username: user.username, 
            name: user.name
        },
        process.env.TOKEN_SECRET, // Remove this file from github
    );

    return accessToken;
}

const validateToken = (req, res, next) => {
    const accessToken = req.cookies["access-token"]
    if (!accessToken) {
        req.authenticated = false;
        return next();
    }
    try {
        const validToken = verify(accessToken, process.env.TOKEN_SECRET);
        if (validToken) {
            req.authenticated = true;
            req.user = {
                uID: validToken.id,
                username: validToken.username,
            }
            return next();
        }
    } catch(err) {
        return res.status(400).json({ error: err })
    }
}

module.exports = { createTokens, validateToken }