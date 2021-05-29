const express = require('express');
const authController = require('../controllers/authController');
const tourController = require('../controllers/tourController');
const reviewController = require('../controllers/reviewController');

const router = express.Router();

router
    .route('/top-5-cheap')
    .get(tourController.aliasTopTours, tourController.getAllTours)

router
    .route('/tour-stats')
    .get(tourController.getTourStats)

router
    .route('/monthly-plan/:year')
    .get(tourController.getMonthlyPlan)

router
    .route('/')
    .get(authController.protect, tourController.getAllTours)
    .post(tourController.createTour)

router
    .route('/:id')
    .get(tourController.getTourById)
    .patch(tourController.updateTour)
    .delete(
        authController.protect,
        authController.restrictTo('lead-guide', 'admin'),
        tourController.deleteTour
    )

router
    .route('/:tourId/review')
    .post(authController.protect, authController.restrictTo('users'), reviewController.createReview)

module.exports = router;
