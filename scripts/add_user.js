import { ArgumentParser } from 'argparse';
import { User } from '../models/user';

import { mongoose } from '../config';

const db = mongoose();

const parser = new ArgumentParser({
  version: '0.0.1',
  addHelp:true,
  description: 'Add admin user'
});
parser.addArgument(
  '--emails',
  {
    help: 'Users email',
    required: true,
    nargs: '+',
    type: String
  }
);
parser.addArgument(
  '--password',
  {
    help: 'init password',
    type: String,
    required: true
  }
);
parser.addArgument(
  '--admin',
  {
    help: 'Add as a admin user',
    action: 'storeTrue'
  }
);
const args = parser.parseArgs();

const add_user = (args) => {
    for(let i = 0; i < args.emails.length; i++) {
        let email = args.emails[i];
        let user = new User({
            nickName: '',
            email: email,
            admin: args.admin,
        });
        user.hash_password = user.hashPassword(args.password);
        console.log(user);
        user.save((err) => {
            if(err){
                console.log(`Create user ${email} failed!`);
            }
            console.log(`Create user ${email} success `);
        });
    }
}

add_user(args);
