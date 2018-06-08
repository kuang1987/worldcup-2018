import {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLList
} from 'graphql';

import {PlayerType} from './team';
import models from '../../models';

export const MatchGuessInputType = new GraphQLInputObjectType({
    name: 'MatchGuessInput',
    fields: {
        match: {
            type: new GraphQLNonNull(GraphQLID)
        },
        guess: {
            type: GraphQLString
        }
    }
});

export const MatchGuessRecordType = new GraphQLObjectType({
    name: 'MatchGuessRecored',
    fields: {
        _id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        match: {
            type: GraphQLID
        },
        guess: {
            type: GraphQLString
        }
    }
});

export const UserInputType = new GraphQLInputObjectType({
    name: 'UserInput',
    fields: {
        nickName: {
            type: GraphQLString
        },
        goldenPlayerGuessRecord: {
            type: GraphQLID,
        },
        matchGuessRecord: {
            type: MatchGuessInputType
        },
        timezone: {
            type: GraphQLString
        }
    }
});

export const UserRankingType = new GraphQLObjectType({
    name: 'UserRanking',
    fields: {
      nickName: {
          type: GraphQLString
      },
      email: {
          type: GraphQLString
      },
      guessScore: {
          type: GraphQLInt
      },
      goldenPlayerGuessRecord: {
          type: GraphQLString
      }
    }
});

export const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        _id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        nickName: {
            type: GraphQLString
        },
        email: {
            type: GraphQLString
        },
        guessScore: {
            type: GraphQLInt
        },
        matchGuessRecords: {
            type: new GraphQLList(MatchGuessRecordType)
        },
        goldenPlayerGuessRecord: {
            type: GraphQLString
        },
        timezone: {
            type: GraphQLString
        }
    }
});
