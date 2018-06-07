import models from '../models';
import { Types } from 'mongoose';

import { mongoose } from '../config';

const db = mongoose();

let goldenPlayer = "5b0cf69be417bd28015a11a4";

console.log(goldenPlayer);

// models.Team.findOne({players: { $elemMatch: { _id: goldenPlayer }}}).
//         select('name flagUrl players')
//         .exec()
//         .then((player) => {
//           console.log(player);
//         })
//         .catch((err) => {
//             throw new Error('Invalid player chosen!')
//         })

models.Team.aggregate().unwind("$players")
  .project({'teamName': "$name", 'teamFlagUrl': "$flagUrl", 'name':"$players.name", 'goal': "$players.goal", "_id": "$players._id"})
  // .match({"_id": "5b0cf69be417bd28015a11b5" })
  .match({_id: "5b0cf69be417bd28015a11b5"})
  .then((result) => {
    console.log(result)
  })
