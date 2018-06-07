import {
  GraphQLList,
  GraphQLID,
  GraphQLNonNull
} from 'graphql';

import { MatchType, MatchInputType } from '../types';
import getProjection from '../projector';
import models from '../../models';
import _ from 'lodash';

export const Match = {
  type: MatchType,
  args: {
    data: {
      name: 'data',
      type: new GraphQLNonNull(MatchInputType)
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
      if (match.finished) {
          throw new Error('Can not update a finished match!')
      }
      console.log(params.data);
      console.log(match);
      _.merge(match, params.data);
      await match.save();
      return await models.Match.findOne({_id: params.data._id}).select(projections).exec()
  }
};
