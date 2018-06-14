import { ArgumentParser } from 'argparse';
import { Match, User } from '../models';

import { mongoose } from '../config';

import path from 'path';

const db = mongoose();

const parser = new ArgumentParser({
  version: '0.0.1',
  addHelp:true,
  description: 'Calculate user score'
});

parser.addArgument(
  '--dryRun',
  {
    help: 'dry run',
    action: 'storeTrue',
    default: false
  }
);

const args = parser.parseArgs();

const updateUserScore = (args) => {
    console.log('start....')
    Match.find({finished: true, available: false}, (err, matches) => {
      if (err) { console.log(err); }
      let userScoreMap = [];
      User.find({}, {}, (err, users) => {
          for(let i=0;i < users.length; i++){
              let user = users[i];
              let score = 0;
              let guessRecords = user.matchGuessRecords;
              // console.log(`calculate match:${match.matchIndex}, winner: ${match.winner}`);
              for(let j=0; j < matches.length; j++){
                  let match = matches[j];
                  for(let k=0; k < guessRecords.length; k++){
                      let record = guessRecords[k];
                      if (String(record.match) === String(match._id)){
                          if (String(record.guess) === String(match.winner)){
                              score += 1;
                          }
                      }
                  }
              }
              console.log(`${user.email} score -> ${score}`);
              if (!args.dryRun){
                user.guessScore = score;
                user.save((err)=>{
                  if (err) { console.log(`save ${user.email} score failed`); }
                  console.log(`save ${user.email} score success`);
                });
              }
          }

      });
    });
};

updateUserScore(args);
