import fs from 'fs';
import path from 'path';
import _ from 'lodash';

import moment from 'moment-timezone';
import { tzlist } from '../data/tzlist'

import { mongoose } from '../config';

import { Match, Team, Tz } from '../models';

const db = mongoose();

const getObjectFromJsonFile = (path) => {
    let json = fs.readFileSync(path);
    return JSON.parse(json);
};

const getTeamFlagUrl = (teamName, flagUrls) => {
    // console.log(teamName);
    return _.filter(flagUrls, (e) => {
        return e.name == teamName
    })[0].flag
};

// const getKnockOutTypeAlias = (type) => {
//     let alias = {
//         'round_16': 'Round Of 16',
//         'round_8': 'Quarter-finals',
//         'round_4': 'Semi-Final',
//         'round_2_loser': 'Play-off for 3rd place',
//         'round_2'
//     }
// }

let teams = getObjectFromJsonFile(path.join(__dirname, '..', 'data', 'teams.json'));
let matches = getObjectFromJsonFile(path.join(__dirname, '..', 'data', 'matches.json'));
let flagUrls = _.map(matches.teams, (team) => {
    return { name: team.name, flag: team.flag };
});
let teamNames = _.map(matches.teams, (team) => {
    return team.name;
});

// console.log(flagUrls);

// Team.remove({}, (err) => {
//     console.log(err);
// });
//
// console.log(getTeamFlagUrl('Colombia', flagUrls));

teams.forEach((team) => {
    Team.findOneAndDelete({'name': team.name}, (err) => {
        if (err) {console.log('delete team err!')}
    });
    let teamDoc = new Team();
    teamDoc.name = team.name;
    teamDoc.group = team.group;
    teamDoc.flagUrl = getTeamFlagUrl(team.name, flagUrls)
    console.log(teamDoc);
    let players = [];
    for(let i = 0; i < team.players.length; i++){
        let player = team.players[i];
        players.push(player);
    }
    teamDoc.players = players;
    teamDoc.save((err, team) => {
        if (err) { console.log(err) };
        console.log(team.name);
    })
});

_.keys(matches.groups).forEach((group) => {
    matches.groups[group].matches.forEach((match) => {
        Match.findOneAndDelete({'matchIndex': match.name}, (err) => {
            if (err) {console.log('delete match err!')}
        });
        Team.findOne({'name': teamNames[match.home_team - 1] }).select('_id').exec()
            .then((home_team) => {
                return Team.findOne({'name': teamNames[match.away_team - 1] }).select('_id').exec()
                            .then((away_team) => {
                                return [home_team._id, away_team._id]
                            });
            })
            .then((result) => {
                let matchDoc = new Match();
                matchDoc.startTime = match.date;
                matchDoc.matchIndex = match.name ;
                matchDoc.homeTeam = result[0] ;
                matchDoc.awayTeam = result[1] ;
                matchDoc.stage = 'group' ;
                matchDoc.label = group.toUpperCase() ;
                matchDoc.matchDay = match.matchday ;
                return matchDoc;
            }).then((matchDoc) => {
                return matchDoc.save();
            }).then((matchDoc) => {
                console.log(`insert ${matchDoc.matchIndex} success!`);
            }).catch((err) => {
                console.log(`insert ${matchDoc.matchIndex} failed!`);
            });
    });
});

_.keys(matches.knockout).forEach((type) => {
    matches.knockout[type].matches.forEach((match) => {
        Match.findOneAndDelete({'matchIndex': match.name}, (err) => {
            if (err) {console.log('delete match err!')}
        });
        let matchDoc = new Match();
        matchDoc.startTime = match.date;
        matchDoc.matchIndex = match.name ;
        matchDoc.stage = 'knockout' ;
        matchDoc.label = matches.knockout[type].name ;
        matchDoc.matchDay = match.matchday ;
        matchDoc.save().then((matchDoc) => {
            console.log(`insert ${matchDoc.matchIndex} success!`);
        }).catch((err) => {
            console.log(`insert ${matchDoc.matchIndex} failed!`);
            console.log(err);
        });
    });
});

for(let i = 0; i < tzlist.length; i++){
    Tz.remove({'index': i}, (err) => {
        if (err) {console.log('delete tz err!')};
    });
    let now = moment();
    let offset = now.tz(tzlist[i].value).format('Z');
    let tzDoc = new Tz();
    tzDoc.index = i;
    tzDoc.value = tzlist[i].value;
    tzDoc.text = tzlist[i].text.replace(/[+-]\d\d:\d\d/g, offset);
    tzDoc.place = tzlist[i].place;
    tzDoc.offset = offset;
    tzDoc.save()
      .then((tz) => {
          console.log(`insert ${tzDoc.value} success`);
      })
      .catch((err) => {
          console.log(`insert ${tzDoc.value} failed`);
          console.log(err);
      });
}
