import Email from 'email-templates';
import path from 'path';

const templateDir = path.join(__dirname, './emails')

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
    auth: {
      user: 'mail-smtp-corp',
      pass: 'Oko1GdzNJoAQ'
    },
    host: 'mail.smtp2go.com',
    port: 587,
    secure: false
  }
});

email
  .send({
    template: 'invitation',
    message: {
      to: 'kevin.kong@seedlinktech.com'
    },
    locals: {
      userEmail: 'kevin.kong@seedlinktech.com',
      userPassword: '123456'
    }
  })
  .then(res => {
    console.log('res.originalMessage', res.originalMessage)
  })
  .catch((err) => console.log(err));
