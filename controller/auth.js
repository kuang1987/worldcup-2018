import jwt from 'jsonwebtoken';
import config from '../config';
import bcrypt from 'bcryptjs';
import {User} from '../models/user';

const secret = config.app.secret;

export const login = (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) throw err;
        console.log(user);
        if (!user || !user.comparePassword(req.body.password, user.hash_password)) {
            return res.status(403).json({ message: 'Authentication failed. Invalid user or password.' });
        }
        if (user && user.comparePassword(req.body.password, user.hash_password) && user.password_need_change ){
            return res.status(401).json({ message: 'Password need change.' });
        }
        return res.status(200).json({
            token: jwt.sign(
                //payload
                {email: user.email,
                 nickName: user.nickName,
                 _id: user._id
                },
                //secret
                secret,
                //options
                {expiresIn: '1h'}
                )
            });
    });
}

export const changePassword = (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) throw err;
        if (!user || !user.comparePassword(req.body.old_password, user.hash_password)) {
            return res.status(403).json({ message: 'Authentication failed. Invalid user or old password.' });
        }
        if (user && user.comparePassword(req.body.old_password, user.hash_password)){
            if (req.body.new_password != req.body.new_password_confirm) {
                return res.status(400).json({ message: 'New password is not consistent with confirm passowrd.' });
            }
            if (req.body.old_password === req.body.new_password) {
                return res.status(400).json({ message: 'New password is same with new password.' });
            }
        }
        user.hash_password = bcrypt.hashSync(req.body.new_password, 10);
        user.password_need_change = false;
        user.save((err, user) => {
            if (err) throw err;
            return res.status(200).json({
                token: jwt.sign(
                    //payload
                    {email: user.email,
                     nickName: user.nickName,
                     _id: user._id
                    },
                    //secret
                    secret,
                    //options
                    {expiresIn: '1h'}
                    )
                });
        });
        return;
    });
}
