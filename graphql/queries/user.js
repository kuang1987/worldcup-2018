import {
  GraphQLList,
  GraphQLID,
  GraphQLNonNull
} from 'graphql';

import { UserType, UserRankingType } from '../types';
import getProjection from '../projector';
import models from '../../models';

export const User = {
  type: UserType,
  args: {
    // id: {
    //   name: 'id',
    //   type: new GraphQLNonNull(GraphQLID)
    // }
  },
  resolve (root, params, options, info) {
    if (!options.user) {
        throw new Error("No user info found!");
    }
    const projection = getProjection(info.fieldNodes[0]);

    return models.User
      .findById(options.user._id)
      .select(projection)
      .exec();
  }
};

export const UsersRanking = {
  type: new GraphQLList(UserRankingType),
  args: {
  },
  resolve (root, params, options, info) {
    const projection = getProjection(info.fieldNodes[0]);

    return models.User
      .find({admin: false})
      .select(projection)
      .exec();
  }
};
