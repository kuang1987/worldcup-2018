import {
  GraphQLList,
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
  GraphQLBoolean,
  GraphQLInt
} from 'graphql';

import { MatchType, MatchStageEnumType, MatchLabelEnumType } from '../types';
import getProjection from '../projector';
import models from '../../models';
import utils from '../../utils';

import _ from 'lodash';

export const Match = {
  type: new GraphQLList(MatchType),
  args: {
    id: {
        name: 'id',
        type: GraphQLID
    },
    available: {
        name: 'available',
        type: GraphQLBoolean
    },
    stage: {
        name: 'stage',
        type: GraphQLString
    },
    label: {
        name: 'label',
        type: GraphQLString
    },
    started: {
        name: 'started',
        type: GraphQLBoolean
    },
    matchIndex: {
        name: 'matchIndex',
        type: GraphQLInt
    }
  },
  async resolve (root, params, options, info) {
    let started = undefined;
    if (params.id){
      params._id = params.id;
      delete params.id;
    }
    if (params.started != undefined){
        started = params.started;
        delete params.started;
    }
    const projection = getProjection(info.fieldNodes[0]);

    const matches = await models.Match.find(params).select(projection).sort({matchIndex:1}).exec();
    const user = await models.User.findOne({_id: options.user._id}).exec();
    let filter_started_match = _.reduce(matches, (res, match) =>{
        if (started == undefined) {
          res.push(match);
        } else {
          if (started == match.isMatchStarted(match.startTime)){
            res.push(match);
          }
        }
        return res;
    }, []);
    console.log(filter_started_match);
    return _.map(filter_started_match, (match) => {
          if (projection.startTime == 1){
            match.startTime = utils.displayStartTime(match.startTime, user.timezone);
          }
          if (projection.started == 1){
            match.started = match.isMatchStarted(match.startTime);
          }
          return match;
        });
  }
};
