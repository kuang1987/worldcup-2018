import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        min: 0,
        max: 100
    },
    bday: {
        type: String,
        required: true
    },
    pos: {
        type: String,
        required: true
    },
    goal: {
        type: Number,
        min: 0,
        default: 0,
        required: true
    }
});

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    group: {
        type: String,
        required: true,
        enum: ['A','B','C','D','E','F','G','H']
    },
    groupScore: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    players: {
        type: [playerSchema],
        default: undefined
    },
    flagUrl: {
        type: String,
        required: true
    }
});

export const Team = mongoose.model('Team', teamSchema);
