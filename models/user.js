import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { timezoneEnum } from '../constant';

const recordSchema = new mongoose.Schema({
    match: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    guess: {
        type: mongoose.Schema.Types.ObjectId,
    }
});

const userSchema = new mongoose.Schema({
    nickName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lower: true
    },
    hash_password: {
        type: String,
        required: true
    },
    date_joined: {
        type: Date,
        default: Date.now
    },
    last_login: {
        type: Date,
        default: Date.now
    },
    admin: {
        type: Boolean,
        default: false,
        required: true
    },
    password_need_change: {
        type: Boolean,
        default: true
    },
    matchGuessRecords: {
        type: [recordSchema],
        default: []
    },
    goldenPlayerGuessRecord: {
        type: mongoose.Schema.Types.ObjectId
    },
    guessScore: {
        type: Number,
        min: 0,
        default: 0
    },
    timezone: {
        type: String,
        default: '+08:00'
    }
});

userSchema.methods.comparePassword = (password, hash_password) => {
    return bcrypt.compareSync(password, hash_password);
}

userSchema.methods.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
}
export const User = mongoose.model('User', userSchema);
export const MatchGuessRecored = mongoose.model('Record', recordSchema);
