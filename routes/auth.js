const express = require('express');
const {
    check,
    body
} = require('express-validator/check');
const User = require('../models/user');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', [
    body('email')
    .isEmail()
    .withMessage('Enter the valid email')
    .normalizeEmail(),
    body('password', 'Enter the valid password (min 5 numbers or text symbols)')
    .isLength({
        min: 5
    })
    .isAlphanumeric()
    .trim()
], authController.postLogin);

router.post('/signup', [
    check('email')
    .isEmail()
    .withMessage('Enter the valid email')
    .custom((value, {
        req
    }) => {
        return User.findOne({
                email: value
            })
            .then(userDoc => {
                if (userDoc) {
                    return Promise.reject('Email exists already');
                }
            })
    })
    .normalizeEmail(),
    body('password', 'Enter the valid password (min 5 numbers or text symbols)')
    .isLength({
        min: 5
    })
    .isAlphanumeric()
    .trim(),
    body('confirmPassword')
    .trim()
    .custom((value, {
        req
    }) => {
        if (value !== req.body.password) {
            throw new Error('Paswords have to match!');
        }
        return true;
    })
], authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;