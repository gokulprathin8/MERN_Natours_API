const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router
    .post('/signup', authController.signUp);
router
    .post('/login', authController.login);
router
    .post('/forgotPassword', authController.forgotPassword)
router
    .patch('/resetPassword/:token', authController.resetPassword)
router
    .patch('/updateMyPassword', authController.protect, authController.updatePassword);
router.delete('/deleteMe', authController.protect, userController.deleteMe)

router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser)

router
    .route('/:id')
    .get(userController.getUserById)
    .patch(userController.updateUser)
    .delete(userController.deleteUser)



module.exports = router;
