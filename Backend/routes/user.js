const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');
const { validateToken } = require("../middleware/JWT")

router.get('/', validateToken, controller.getUser);
router.post('/register', controller.register)
router.post('/create', controller.addUser);
router.post('/login', controller.login);
router.get('/auth', validateToken, controller.authenticate)
router.patch('/name', validateToken, controller.setDisplayName);
router.get('/search', controller.findUsers);
router.get('/pokemon', validateToken, controller.getUserPokemon);
router.post('/pokemon', validateToken, controller.addUserPokemon);

module.exports = router;