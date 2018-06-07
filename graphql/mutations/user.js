import {
  GraphQLList,
  GraphQLID,
  GraphQLNonNull
} from 'graphql';

import { UserType, UserInputType, MatchGuessInputType } from '../types';
import getProjection from '../projector';
import models from '../../models';

export const User = {
  type: UserType,
  args: {
    data: {
      name: 'data',
      type: new GraphQLNonNull(UserInputType)
    }
  },
  async resolve (root, params, options, info) {
    console.log(options.user);
    const projections = getProjection(info.fieldNodes[0]);
    const user = await models.User.findOne({_id: options.user._id}).exec();
    if (params.data.goldenPlayerGuessRecord) {
      const player_id = params.data.goldenPlayerGuessRecord;
      const player = models.Team.find({players: { $elemMatch: { _id: player_id }}},{players: { $elemMatch: { _id: player_id}}})
              .exec()
      if (!player) {
        throw new Error('Invalid player chosen!');
      }
      user.goldenPlayerGuessRecord = params.data.goldenPlayerGuessRecord;
    }
    if (params.data.matchGuessRecord) {
      const match = await models.Match.findOne({_id: params.data.matchGuessRecord.match}).exec()
      if (!match) {
        throw new Error('Invalid match chosen!');
      }
      if (match.isMatchStarted(match.startTime)) {
          throw new Error('Match started. You can\'t guess!');
      }
      if (!match.available) {
          throw new Error('Closed. You can\'t guess!');
      }
      if (params.data.matchGuessRecord.guess != match.homeTeam &&
          params.data.matchGuessRecord.guess != match.awayTeam){
              params.data.matchGuessRecord.guess = null;
          }
      let is_record_exist = false;
      for(let i = 0; i < user.matchGuessRecords.length; i++){
        if (user.matchGuessRecords[i].match == params.data.matchGuessRecord.match) {
          user.matchGuessRecords[i].guess = params.data.matchGuessRecord.guess;
          is_record_exist = true;
        }
      }
      if (!is_record_exist) {
          user.matchGuessRecords.push(params.data.matchGuessRecord);
      }
    }

    user.nickName = params.data.nickName ? params.data.nickName : user.nickName;
    //const user = models.User.findOneAndUpdate({_id: params.data._id}, params.data, {new: true}).select(projections).exec()

    if(params.data.timezone) {
        const tz = await models.Tz.findOne({'offset': params.data.timezone})
        if(!tz){
            throw new Error('Invalid timezone chosen!');
        }
        user.timezone = params.data.timezone;
    }
    await user.save();
    return await models.User.findOne({_id: options.user._id}).select(projections).exec()
  }
};
