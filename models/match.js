import mongoose from 'mongoose';
import moment from 'moment-timezone';

import { matchLabelEnum, matchEndwayEnum } from '../constant';

const matchSchema = new mongoose.Schema({
    startTime: {
        type: String,
        required: true
    },
    matchIndex: {
        type: Number,
        required: true
    },
    homeTeam: {
        type: mongoose.Schema.Types.ObjectId,
    },
    awayTeam: {
        type: mongoose.Schema.Types.ObjectId,
    },
    homeTeamName: {
        type: String
    },
    awayTeamName: {
        type: String
    },
    homeTeamScore: {
        type: Number,
        min: -1,
        required: true,
        default: -1
    },
    awayTeamScore: {
        type: Number,
        min: -1,
        required: true,
        default: -1
    },
    endWay: {
        type: String,
        enum: matchEndwayEnum, //normal,overtime,penalty
        default: 'NR'
    },
    winner: {
        type: String,
        default: "draw"
    },
    finished: {
        type: Boolean,
        required: true,
        default: false
    },
    available: {
        type: Boolean,
        required: true,
        default: false
    },
    finished: {
        type: Boolean,
        required: true,
        default: false
    },
    stage: {
        type: String,
        required: true,
        enum: ['group', 'knockout'] //group, 1/8, 1/4, semi-final, final
    },
    label: {
        type: String,
        required: true,
        enum: matchLabelEnum
    },
    matchDay: {
        type: Number,
        required: true,
        min: 0
    }
});

matchSchema.methods.isMatchStarted = (time_str) => {
    return moment().isAfter(moment(time_str));
}

matchSchema.methods.displayStartTime = (tz) => {

}

export default mongoose.model('Match', matchSchema);
