import {
  GraphQLList,
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt
} from 'graphql';

import { TeamType, PlayerType } from '../types';
import getProjection from '../projector';
import models from '../../models';
import mongoose from 'mongoose';

export const Players = {
  type: new GraphQLList(PlayerType),
  args: {
    ids: {
      name: 'ids',
      type: new GraphQLList(GraphQLID)
    },
    team: {
      name: 'team',
      type: GraphQLString
    },
    minGoals: {
      name: 'minGoals',
      type: GraphQLInt
    }
  },
  async resolve (root, params, options, info) {
    const projection = getProjection(info.fieldNodes[0]);
    if (params.ids) {
        params._id = {$in: params.ids.map((id)=>{
            return mongoose.Types.ObjectId(id);
        })};
        delete params.ids;
    }
    if (params.minGoals != undefined) {
      params.goal = {$gt: params.minGoals};
      delete params.minGoals;
    }
    console.log(params);
    const players = await models.Team.aggregate().unwind("$players")
      .project({'team': "$name", 'teamFlagUrl': "$flagUrl", 'pos':"$players.pos", 'name':"$players.name", 'goal': "$players.goal", "_id": "$players._id"})
      .match(params)
      .project(projection)
      .sort({goal:-1, team: 1, name: 1})
      .exec()
    return players;
  }
}

export const Team = {
  type: TeamType,
  args: {
    id: {
      name: 'id',
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  resolve (root, params, options, info) {
    const projection = getProjection(info.fieldNodes[0]);
    return models.Team
      .findById(params.id)
      .select(projection)
      .exec();
  }
};

export const Teams = {
    type: new GraphQLList(TeamType),
    resolve (root, params, options, info) {
      const projection = getProjection(info.fieldNodes[0]);
      return models.Team
        .find()
        .select(projection)
        .exec();
    }
};
