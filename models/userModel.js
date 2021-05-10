const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A user must have a name.']
    },
    email: {
        type: String,
        required: [true, 'A email address is required.'],
        unique: [true, 'Email address already exists! Try login or reset your password.'],
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: String,
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Password is a required field'],
        minlength: 8,
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true, 'Confirm Password is a required field'],
        minlength: 8,
        validate: {
            message: 'Password and Confirm Password fields must match.',
            validator: function (value) {
                return value === this.password
            }
        }
    },
    passwordChangedAt: Date
}, { timestamps: true });

userSchema.pre('save',async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
    next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = this.passwordChangedAt.getTime();
        return JWTTimestamp < changedTimestamp;
    }
}

const User = mongoose.model('User', userSchema);
module.exports = User;
