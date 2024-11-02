const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRECT;


// middleware to check access token verification
const authenticatJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    let token;
    
    // Check if Authorization header exists and follows the 'Bearer <token>' pattern
    if (req.query.token != undefined) {
        token = (req.query.token).split(' ')[1];
    } else {
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1]; // Extract the token part after "Bearer"
        } else {
            return res.status(401).json({ message: 'Authorization header missing or improperly formatted' });
        };
    };

    // Verify the token
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Session expired, please login or signup again' });
            } else {
                return res.status(401).json({ message: 'Invalid token' });
            }
        };
        req.user = decoded;
        next();
    });
};

module.exports = { authenticatJWT };