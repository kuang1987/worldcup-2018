import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLList
} from 'graphql';

import models from '../../models';

export const PlayerType = new GraphQLObjectType({
    name: 'PlayerType',
    fields: {
        _id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        team: {
            type: GraphQLString
        },
        name: {
            type: GraphQLString
        },
        age: {
            type: GraphQLInt
        },
        goal: {
            type: GraphQLInt
        },
        pos: {
            type: GraphQLString
        },
        teamFlagUrl: {
            type: GraphQLString
        }
    }
});

export const TeamType = new GraphQLObjectType({
    name: 'TeamType',
    fields: {
        _id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        name: {
            type: GraphQLString
        },
        flagUrl: {
            type: GraphQLString
        },
        group: {
            type: GraphQLString
        },
        groupScore: {
            type: GraphQLInt
        },
        players: {
            type: new GraphQLList(PlayerType)
        }
    }
});

// export default PlayerType;
