import mongoose from 'mongoose';
const env = process.env.NODE_ENV || 'development';
const secret = process.env.JWT_SECRET || '1234567890!@#$%^&*()';

const dbConfig = {
    development: 'mongodb://127.0.0.1:27017/worldcup',
    production: 'mongodb://mongo/worldcup'
}

const db = (env) => {
    return () => {
        mongoose.Promise = global.Promise;
        let db = mongoose.connect(dbConfig[env]);
        mongoose.connection.on('error', function (err) {
            console.log('Error: Could not connect to MongoDB. Did you forget to run `mongod`?'.red);
        }).on('open', function () {
            console.log('Connection extablised with MongoDB')
        })
        return db;
    };
}

module.exports = {
    mongoose: db(env),
    app: {
        name: 'worldcup',
        secret: secret
    }
};
