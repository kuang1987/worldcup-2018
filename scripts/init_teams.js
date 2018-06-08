import fs from 'fs';
import path from 'path';
import _ from 'lodash';

import { mongoose } from '../config';

import { Team } from '../models';

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

let teams = getObjectFromJsonFile(path.join(__dirname, '..', 'data', 'teams.json'));
let matches = getObjectFromJsonFile(path.join(__dirname, '..', 'data', 'matches.json'));
let flagUrls = _.map(matches.teams, (team) => {
    return { name: team.name, flag: team.flag };
});
let teamNames = _.map(matches.teams, (team) => {
    return team.name;
});

teams.forEach((team) => {
    Team.findOneAndDelete({'name': team.name}, (err) => {
        if (err) {console.log('delete team err!')}
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
        });
    });
});
