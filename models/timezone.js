import mongoose from 'mongoose';

const tzSchema = new mongoose.Schema({
    index: {
        type: Number,
        required: true,
        min: 0
    },
    value: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    place: {
        type: String,
        required: true
    },
    offset: {
        type: String,
        required: true
    }
});

export const Tz = mongoose.model('Tz', tzSchema);
