const mongoose = require('./db');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Pre-save hook to hash password
UserSchema.pre('save', function (next) {
    if (!this.isModified('password')) return next();

    bcrypt.hash(this.password, saltRounds, (err, hash) => {
        if (err) return next(err);
        this.password = hash;
        next();
    });
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
