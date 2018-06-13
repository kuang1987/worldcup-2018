import Email from 'email-templates';

const email = new Email({
  message: {
    from: 'devops@seedlinktech.com'
  },
  // uncomment below to send emails in development/test env:
  //send: true,
  transport: {
    jsonTransport: true
  }
});

email
  .send({
    template: 'invitation',
    message: {
      to: 'kevin.kong@seedlinktech.com'
    },
    locals: {
      name: 'Kevin'
    }
  })
  .then(res => {
    console.log('res.originalMessage', res.originalMessage)
  })
  .catch((err) => console.log(err));
