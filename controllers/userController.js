const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res) => {
    const users = await User.find();

    res.status(200).json({
        status: 'error',
        results: users.length,
        data: {
            users
        }
    });
});

exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    })
}

exports.getUserById = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    })
}

exports.updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    })
}

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, {active: false});

    res.status(204).json({
        status: 'success',
        data: null
    })
})

exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    })
}
