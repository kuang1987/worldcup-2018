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

export const MatchInputActionEnumType = new GraphQLEnumType({
  name: 'MatchInputActionEnumType',
  description: 'action can do',
  values: {
    'OPEN': {
      value: 'OPEN'
    },
    'CLOSE': {
      value: 'CLOSE'
    },
    'FILL': {
      value: 'FILL'
    }
  }
});

// export const MatchInputListType = new GraphQLInputObjectType({
//   name: 'MatchInputListType'
//   fields: {
//     matches: {
//         type: new GraphQLList(GraphQLID)
//     },
//     action: {
//         type: new GraphQLNonNull(MatchInputActionEnumType)
//     }
//   }
// })

export const MatchInputType = new GraphQLInputObjectType({
  name: 'MatchInput',
  fields: {
      matchIndex: {
          type: new GraphQLNonNull(GraphQLInt)
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
        started: {
            type: GraphQLBoolean
        },
        endWay: {
            type: MatchEndwayEnumType
        }
    }
});

export const MatchUpdatedErrorType = new GraphQLObjectType({
    name: 'MatchUpdatedErrorType',
    fields: {
      _id: {
          type: new GraphQLNonNull(GraphQLID)
      },
      message: {
          type: GraphQLString
      }
    }
})

export const MatchUpdatedType = new GraphQLObjectType({
    name: 'MatchUpdatedType',
    fields: {
        success: {
            type: new GraphQLList(MatchType)
        },
        error: {
            type: new GraphQLList(MatchUpdatedErrorType)
        }
    }
})
