const express = require('express');
const session = require('express-session');
const { SESSION_SECRET } = process.env;
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(session({
    secret: SESSION_SECRET,
    resave: true,  // Set to either true or false
    saveUninitialized: false,
}));

router.get('/', auth.isLogout, userController.loadLogin);
router.post('/', auth.isLogout, userController.login);
router.get('/register', auth.isLogout, userController.loadRegister);
router.post('/register', auth.isLogout, userController.register);
router.get('/home', auth.isLogin, userController.loadHome);
router.get('/logout', auth.isLogin, userController.logout);

module.exports = router;