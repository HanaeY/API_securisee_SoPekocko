const express = require('express');
const router = express.Router(); // création d'un routeur express

// import des middlewares 
const validator = require('../middleware/signup_validator');
const userCtrl = require('../controllers/user_ctrl');
const limiter = require('../middleware/rate_limiter');

// détail des routes pour les requêtes envoyées à '/api/sauces' + extension URI
router.post('/signup', validator.validateEmail, validator.validatePassword, userCtrl.signup);
router.post('/login', limiter, userCtrl.login);

module.exports = router; // export du routeur qui sera importé dans le fichier app.js