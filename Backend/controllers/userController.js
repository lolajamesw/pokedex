const asyncHandler = require('../middleware/asyncHandler');
const userService = require('../services/userService');

exports.getUser = asyncHandler(async (req, res) => {
    const uID = Number(req.query.uID);
    const user = await userService.getUser(uID);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
});

exports.addUser = asyncHandler(async (req, res) => {
    const name = req.query.name;
    const username = req.query.username;
    const password = req.query.password;    
    const user = await userService.addUser(name, username, password);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
});

exports.login = asyncHandler(async (req, res) => {
    const username = req.query.username;
    const password = req.query.password;
    const user = await userService.login(username, password);
    if (!user) return res.status(401).json({ message: 'Invalid username or password.' });
    res.json(user);
});

exports.setDisplayName = asyncHandler(async (req, res) => {
    const uID = req.query.uID;
    const name = req.query.name;
    const result = await userService.setDisplayName(uID, name);
    if (!result) return res.status(401).json({ message: 'Couldn\'t update name.' });
    res.json(result);
});

exports.findUsers = asyncHandler(async (req, res) => {
    const prompt = req.query.prompt;
    if (prompt.length === 0) return res.json({ message: 'No prompt provided' });
    const users = await userService.findUsers(prompt);
    if (!users) return res.status(404).json({ message: 'Users not found' });
    res.json(users);
});

exports.getUserPokemon = asyncHandler(async (req, res) => {
    const uID = Number(req.query.uID);
    const result = await userService.getUserPokemon(uID);
    if (!result) return res.status(401).json({ message: 'Pokemon not found' });
    res.json(result);
});
