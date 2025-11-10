const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getUser);
router.post('/create', userController.addUser);
router.post('/login', userController.login);
router.patch('/name', userController.setDisplayName);
router.get('/search', userController.findUsers);
router.get('/pokemon', userController.getUserPokemon);

module.exports = router;