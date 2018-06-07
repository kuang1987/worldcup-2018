import jwt from 'jsonwebtoken';

export default (secret) => {
    return (req, res, next) => {
        if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            // verifies secret and checks exp
            jwt.verify(req.headers.authorization.split(' ')[1], secret, function(err, decoded) {
            if (err) {
                return res.status(403).json({ message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.user = decoded;
                next();
            }
            });
        } else {
            return res.status(403).json({ message: 'No authenticate token.' });
        }
    };
};
