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
    let started = false;
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
    let tz_matches = _.map(matches, (match) => {
          if (match.startTime){
            match.startTime = utils.displayStartTime(match.startTime, user.timezone);
            return match;
          }
          return match;
        });
    return _.reduce(tz_matches, (res, match) => {
        if (started == match.isMatchStarted(match.startTime)) {
          res.push(match);
        }
        return res;
    },[])

  }
};
