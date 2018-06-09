import {
  GraphQLList,
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
  GraphQLBoolean
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

    const matches = await models.Match.find(params).select(projection).exec();
    const user = await models.User.findOne({_id: options.user._id}).exec();
    console.log(matches);
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
    // return _.reduce(tz_matches, (res, match) => {
    //     if (started == match.isMatchStarted(match.startTime)) {
    //       res.push(match);
    //     }
    //     return res;
    // },[])

  }
};
