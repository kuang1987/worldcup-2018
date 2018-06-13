import {
  GraphQLList,
  GraphQLID,
  GraphQLNonNull
} from 'graphql';

import { MatchType, MatchInputType, MatchInputListType, MatchUpdatedType, MatchInputActionEnumType } from '../types';
import getProjection from '../projector';
import models from '../../models';
import utils from '../../utils';
import _ from 'lodash';

export const Matches = {
  type: MatchUpdatedType,
  args: {
    data: {
      name: 'data',
      type: new GraphQLList(MatchInputType)
    },
    action: {
      name: 'action',
      type: MatchInputActionEnumType
    }
  },
  async resolve (root, params, options, info) {
    // console.log(info.fieldNodes[0].selectionSet.selections[0]);
    // console.log(info.fieldNodes[0].selectionSet.selections[1]);
    // const projections = getProjection(info.fieldNodes[0]);
    let projections = {};
    switch (params.action) {
      case 'OPEN':
        projections = {
          '_id': 1,
          'startTime': 1,
          'matchIndex': 1
        }
        break;
      case 'CLOSE':
        projections = {
          '_id': 1,
          'matchIndex': 1,
          'homeTeamScore': 1,
          'awayTeamScore': 1,
          'endWay': 1,
          'winner': 1,
          'homeTeam': 1,
          'awayTeam': 1,
        }
        break;
      case 'FILL':
        projections = {
          '_id': 1,
          'matchIndex': 1,
          'startTime': 1,
          'homeTeam': 1,
          'awayTeam': 1,
        }
        break;
      default:

    }
    const user = await models.User.findOne({_id: options.user._id}).exec();
    if (!user.admin){
        throw new Error('Permission denied!');
    }
    let success_matches = [];
    let error_matches = [];
    for(let input_match_count = 0;input_match_count<params.data.length; input_match_count++){
        let input_match_data = params.data[input_match_count];
        const match = await models.Match.findOne({matchIndex: input_match_data.matchIndex}).exec();
        if (!match) {
            error_matches.push({
              matchIndex: input_match_data.matchIndex,
              message: "Not Found"
            })
            continue;
        }
        let started = match.isMatchStarted(match.startTime);
        //let started = true;
        switch (params.action) {
          case 'OPEN':
            if (started) {
              error_matches.push({
                matchIndex: input_match_data.matchIndex,
                message: "Match started, can not open!"
              });
              continue;
            }
            match.available = true;
            break;
          case 'CLOSE':
            if (!started) {
              error_matches.push({
                matchIndex: input_match_data.matchIndex,
                message: "Match not start, can not close!"
              });
              continue;
            }
            match.homeTeamScore = input_match_data.homeTeamScore;
            match.awayTeamScore = input_match_data.awayTeamScore;
            if (match.homeTeamScore > match.awayTeamScore){
                match.winner = match.homeTeam;
            }else if (match.homeTeamScore < match.awayTeamScore) {
                match.winner = match.awayTeam;
            }else{
                match.winner = "Draw";
            }
            match.endWay = input_match_data.endWay;
            match.available = false;
            match.finished = true;
            break;
          case 'FILL':
            const homeTeam = await models.Team.findOne({name: input_match_data.homeTeam}).select({_id:1, name:1}).exec();
            if (!homeTeam){
              error_matches.push({
                matchIndex: input_match_data.matchIndex,
                message: "No team named " + input_match_data.homeTeam
              });
            }
            const awayTeam = await models.Team.findOne({name: input_match_data.awayTeam}).select({_id:1, name:1}).exec();
            if (!awayTeam){
              error_matches.push({
                matchIndex: input_match_data.matchIndex,
                message: "No team named " + input_match_data.awayTeam
              });
            }
            match.homeTeam = homeTeam._id;
            match.awayTeam = awayTeam._id;
            match.homeTeamName = homeTeam.name;
            match.awayTeamName = awayTeam.name;
            break
          default:
            error_matches.push({
              matchIndex: input_match_data.matchIndex,
              message: "Wrong action"
            });
            continue;
        }
        await match.save();
        const new_match = await models.Match.findOne({matchIndex: input_match_data.matchIndex}).select(projections).exec();
        if (projections.startTime == 1){
          new_match.startTime = utils.displayStartTime(new_match.startTime, user.timezone);
        }
        if (projections.started == 1){
          new_match.started = new_match.isMatchStarted(new_match.startTime);
        }
        success_matches.push(new_match);
    }
    return {
      'success': success_matches,
      'error': error_matches
    }
  }
};

export const Match = {
  type: MatchType,
  args: {
    data: {
      name: 'data',
      type: MatchInputType
    }
  },
  async resolve (root, params, options, info) {
      const projections = getProjection(info.fieldNodes[0]);
      const user = await models.User.findOne({_id: options.user._id}).exec();
      if (!user.admin){
          throw new Error('Permission denied!');
      }
      const match = await models.Match.findOne({_id: params.data._id}).exec();
      if (!match) {
          throw new Error('No match found!')
      }
      //let match_started = match.isMatchStarted(match.startTime);
      let match_started = true;
      if (match_started) {
          // Close match
          if (match.available && params.data.available == false) {
              let winner_str = params.data.winner;
              if (winner_str && winner_str != 'draw' ) {
                  let win_team = await models.Team.findOne({_id: winner_str}).exec();
                  if (!win_team) {
                      throw new Error('Winner team id is invalid!');
                  }
              }
              match.winner = winner_str;
              // Calculate users score
              let users = await models.User.find({"matchGuessRecords.match": match._id}).select({"matchGuessRecords":1, "guessScore":1}).exec();
              for(let i=0;i<users.length;i++){
                for(let j=0;i<users[i].matchGuessRecords;j++){
                  if (users[i].matchGuessRecords[j].match == match._id && users[i].matchGuessRecords[j].guess == match.winner){
                    users[i].guessScore = users[i].guessScore + 1;
                    break;
                  }
                }
                await users[i].save();
              }
          }
      }else{
          if (match.available && params.data.available == false) {
            throw new Error('Match not started. Can not close!');
          }
          if (match.available == false && params.data.available == true) {
            let homeTeam = await models.Team.findOne({_id: params.data.homeTeam}).exec();
            let awayTeam = await models.Team.findOne({_id: params.data.awayTeam}).exec();
            if (match.stage == 'group') {
                if (homeTeam || awayTeam) {
                   throw new Error('Can not change team of group match!');
                }
            }
            if (match.stage == 'knockout'){
              if (!homeTeam || !awayTeam){
                  throw new Error('Invalid team id when try to open match!');
              }
            }
          }
      }
      _.merge(match, params.data);
      await match.save();
      const new_match = await models.Match.findOne({_id: params.data._id}).select(projections).exec();
      if (projections.startTime == 1){
        new_match.startTime = utils.displayStartTime(match.startTime, user.timezone);
      }
      if (projections.started == 1){
        new_match.started = new_match.isMatchStarted(new_match.startTime);
      }
      return new_match;
  }
};
