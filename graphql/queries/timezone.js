import {
  GraphQLList,
  GraphQLID,
  GraphQLNonNull
} from 'graphql';

import { TzType } from '../types';
import getProjection from '../projector';
import models from '../../models';

export const Tz = {
  type: new GraphQLList(TzType),
  resolve (root, params, options, info) {
    if (!options.user) {
        throw new Error("No user info found!");
    }
    const projection = getProjection(info.fieldNodes[0]);

    return models.Tz
      .find()
      .sort( { offset: 1 } )
      .select(projection)
      .exec();
  }
};
