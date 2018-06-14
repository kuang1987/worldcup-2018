import { ArgumentParser } from 'argparse';
import { User } from '../models/user';

import { mongoose } from '../config';
import randomstring from 'randomstring';


import Email from 'email-templates';
import path from 'path';

const templateDir = path.join(__dirname, './emails')

const db = mongoose();

const email = new Email({
  views: {
      root: templateDir
  },
  message: {
    from: 'Worldcup 2018<worldcup-2018@app.seedlinktech.com>'
  },
  // uncomment below to send emails in development/test env:
  send: true,
  transport: {
    port: 25,
    secure: false
  }
});

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
    type: String
  }
);
parser.addArgument(
  '--admin',
  {
    help: 'Add as a admin user',
    action: 'storeTrue'
  }
);
parser.addArgument(
  '--mail',
  {
    help: 'send mail?',
    action: 'storeTrue'
  }
);
const args = parser.parseArgs();

const add_user = (args) => {
    for(let i = 0; i < args.emails.length; i++) {
        let useremail = args.emails[i];
        let user = new User({
            nickName: '',
            email: useremail,
            admin: args.admin,
        });
        let origin_password = '';
        if(args.admin){
          origin_password = args.password;
        }else{
          origin_password = randomstring.generate(7);
        }
        user.hash_password = user.hashPassword(origin_password);
        user.save((err) => {
            if(err){
                console.log(`Create user ${email} failed!`);
            }
            console.log(`Create user ${email} success `);
            if(!args.mail){
                return;
            }
            email
              .send({
                template: 'invitation',
                message: {
                  to: useremail
                },
                locals: {
                  userEmail: useremail,
                  userPassword: origin_password
                }
              })
              .then(res => {
                console.log('success');
              })
              .catch((err) => console.log(err));
        });
    }
}

add_user(args);
