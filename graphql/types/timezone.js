import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
  GraphQLInt
} from 'graphql';

export const TzType = new GraphQLObjectType({
    name: 'TzType',
    fields: {
        _id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        index: {
            type: GraphQLInt
        },
        value: {
            type: GraphQLString
        },
        text: {
            type: GraphQLString
        },
        place: {
            type: GraphQLString
        },
        offset: {
            type: GraphQLString
        }
    }
});
