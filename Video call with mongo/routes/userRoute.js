const express = require('express');
const session = require('express-session');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const path = require("path");
const multer = require("multer");

const { SESSION_SECRET } = process.env;
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../public/images"));
    },
    filename: (req, file, cb) => {
        const name = Date.now() + "-" + file.originalname;
        cb(null, name);
    },
});

const upload = multer({ storage: storage });

router.use(session({
    secret: SESSION_SECRET,
    resave: true,  // Set to either true or false
    saveUninitialized: false,
}));

router.get('/', auth.isLogout, userController.loadLogin);
router.post('/', auth.isLogout, userController.login);
router.get('/register', auth.isLogout, userController.loadRegister);
router.post('/register', upload.single("image"), auth.isLogout, userController.register);
router.get('/home', auth.isLogin, userController.loadHome);
router.get('/logout', auth.isLogin, userController.logout);

module.exports = router;