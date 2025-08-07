import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';

export const authRequired = (req, res, next) => {
    // Buscar token en cookie o en header Authorization
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    if(!token) 
        return res.status(401).json({ message: 'Access denied, no token provided' });

    jwt.verify(token, TOKEN_SECRET, (err, user) => {
        if (err)
            return res.status(403).json({ message: "Invalid Token" });

        req.user = user;
        next();
    });
}