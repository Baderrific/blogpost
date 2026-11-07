const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is Required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is Required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is Required'],
        select: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

// usernames are unique regardless of casing (john = John)
userSchema.index(
    { username: 1 },
    { unique: true, collation: { locale: 'en', strength: 2 } }
);

module.exports = mongoose.model('User', userSchema);
