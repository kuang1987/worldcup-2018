import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLInputObjectType
} from 'graphql';

import _ from 'lodash';

import { matchLabelEnum, matchStageEnum, matchEndwayEnum } from '../../constant';

const groupEnumVaule = {};
matchStageEnum.forEach((stage) => {
    groupEnumVaule[stage] = {
        value: stage
    }
})

export const MatchStageEnumType = new GraphQLEnumType({
  name: 'MatchStageEnum',
  description: 'match stage - group/knockout',
  values: groupEnumVaule,
});

const labelEnumVaule = {};
matchLabelEnum.forEach((label) => {
    labelEnumVaule[label.replace(/( |-)/g, '_')] = {
        value: label
    }
})

export const MatchLabelEnumType = new GraphQLEnumType({
  name: 'MatchLabelEnum',
  description: 'match label',
  values: labelEnumVaule,
});

const matchEndwayEnumValue = {};
matchEndwayEnum.forEach((endway) => {
    matchEndwayEnumValue[endway] = {
        value: endway
    }
})
export const MatchEndwayEnumType = new GraphQLEnumType({
  name: 'MatchEndwayEnum',
  description: 'match end way',
  values: matchEndwayEnumValue,
});

export const MatchInputType = new GraphQLInputObjectType({
  name: 'MatchInput',
  fields: {
      _id: {
          type: new GraphQLNonNull(GraphQLID)
      },
      homeTeamScore: {
          type: GraphQLInt
      },
      awayTeamScore: {
          type: GraphQLInt
      },
      homeTeam:{
          type: GraphQLID,
      },
      awayTeam:{
          type: GraphQLID,
      },
      started: {
          type: GraphQLBoolean,
      },
      available: {
          type: GraphQLBoolean,
      },
      winner: {
          type: GraphQLString,
      },
      endWay:{
          type: MatchEndwayEnumType,
      }
  }
});

export const MatchType = new GraphQLObjectType({
    name: 'Match',
    fields: {
        _id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        matchIndex: {
            type: GraphQLInt
        },
        startTime: {
            type: GraphQLString
        },
        homeTeam: {
            type: GraphQLID
        },
        awayTeam: {
            type: GraphQLID
        },
        winner: {
            type: GraphQLString
        },
        stage: {
            type: MatchStageEnumType
        },
        label: {
            type: MatchLabelEnumType
        },
        homeTeamScore: {
            type: GraphQLInt
        },
        awayTeamScore: {
            type: GraphQLInt
        },
        available: {
            type: GraphQLBoolean
        },
        endWay: {
            type: MatchEndwayEnumType
        }
    }
});
