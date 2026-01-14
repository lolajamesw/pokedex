const asyncHandler = require('../middleware/asyncHandler');
const service = require('../services/userService');

const bcrypt = require('bcrypt')
const { createTokens } = require("../middleware/JWT")

exports.getUser = asyncHandler(async (req, res) => {
    const uID = req.query.uID ? Number(req.query.uID) : Number(req.user.uID);
    const user = await service.getUser(uID);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
});

exports.register = asyncHandler(async (req, res) => {
    const { name, username, password } = req.body;
    bcrypt.hash(password, 7).then(async (hash) => {
        const user = await service.addUser(name, username, hash);
    }).then(() => {
        const accessToken = createTokens(user)
        res.cookie("access-token", accessToken, {
            maxAge: 1000*60*60*24*90, // expire after 90 days
            httpOnly: true,
            path: "/",
        })
        res.json({
            status: "USER REGISTERED",
            user: user
        })
    }).catch((err) => {
        if (err) res.status(400).json({error: err})
    });
});

exports.addUser = asyncHandler(async (req, res) => {
    const name = req.query.name;
    const username = req.query.username;
    const password = req.query.password;    
    const user = await service.addUser(name, username, password);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
});

exports.login = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const user = await service.userExists(username);
    if (!user) res.status(400).json({ error: "User Doesn't Exist" });
    const dbPassword = user.password;
    bcrypt.compare(password, dbPassword).then((match) => {
        if (!match) res.status(400).json({ error: "Password Doesn't Match"});
        else {
            const accessToken = createTokens(user)
            res.cookie("access-token", accessToken, {
                maxAge: 1000*60*60*24*90, // expire after 90 days
                httpOnly: true,
                path: "/",
            })
            res.json({ message: "Login successful", user: {...user, password:password} });
        }
    })
});

exports.authenticate = asyncHandler(async (req, res) => {
    if (req.authenticated) {
        res.json({ message: "Profile Logged In", user: req.user });
    } else {
        res.status(400).json({error: "User not Authenticated"});
    }
})

exports.setDisplayName = asyncHandler(async (req, res) => {
    const uID = req.user.uID;
    const name = req.query.name;
    const result = await service.setDisplayName(uID, name);
    if (!result) return res.status(401).json({ message: 'Couldn\'t update name.' });
    res.json(result);
});

exports.findUsers = asyncHandler(async (req, res) => {
    const prompt = req.query.prompt;
    if (prompt.length === 0) return res.json({ message: 'No prompt provided' });
    const users = await service.findUsers(prompt);
    if (!users) return res.status(404).json({ message: 'Users not found' });
    res.json(users);
});

exports.getUserPokemon = asyncHandler(async (req, res) => {
    const uID = req.query.uID ? Number(req.query.uID) : Number(req.user.uID);
    const result = await service.getUserPokemon(uID);
    if (!result) return res.status(401).json({ message: 'Pokemon not found' });
    res.json(result);
});

exports.addUserPokemon = asyncHandler(async (req, res) => {
  uID = Number(req.user.uID);
  const { name, nickname, level = 100 } = req.body;
  if (!uID || !name) return res.status(400).json({ message: 'uID and name required' });

  const pokemon = await service.addUserPokemon(Number(uID), name, nickname, Number(level));
  res.status(201).json(pokemon);
});
