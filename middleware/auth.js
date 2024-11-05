const jwt = require('jsonwebtoken');
const authMiddleware = (req, res, next) => { 
    const authHeader = req.headers.authorization;
    
    if (!authHeader) { 
        
        return res.status(403).json({ message: "Unauthorized 1" });
    }
    const token = authHeader.split(' ')[1];
    


    if (!token) { 

        return res.status(403).json({ message: "Unauthorized 2" });
    }
    try {
        const user = jwt.verify(token, process.env.jwt_secret);
        
        req.userId = user.userId;
        
    }
    catch (err) { 
        console.error("Error verifying token:", err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
    
    next();
}

module.exports = authMiddleware;