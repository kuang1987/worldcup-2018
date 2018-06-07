import express from 'express';
import morgan from 'morgan';

import graphqlHTTP from 'express-graphql';
import cors from 'cors';
import bodyParser from 'body-parser';

import config from './config';

import apiRoutes from './routes/rest';
import loginRequired from './middleware/loginRequired';

import schema from './graphql';

const db = config.mongoose();
const secret = config.app.secret;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(morgan('dev'));

app.use('/api', cors(), apiRoutes);

app.use('/graphql', cors(), loginRequired(secret), graphqlHTTP(req => ({
  schema,
  pretty: true,
  graphiql: true
})));

app.use('/', cors(), (req, res) => {
    return res.status(200).json({ message: 'Welcome to worldcup 2018!' });
});

app.use('*', cors(), (req, res) => {
    return res.status(404).json({ message: 'Are you awake?' });
});

const server = app.listen(8081, () => {
  console.log('Listening at port', server.address().port);
});
