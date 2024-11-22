import { verifyToken } from '../utils/jwt.util.js';

export const checkAuth = (req, res, next) => {
    // Method 1: Session-based auth
    if (req.isAuthenticated()) {
        return next();
    }

    // Method 2: JWT-based auth
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
            const decoded = verifyToken(token);
            // Fetch user and attach to request
            User.findById(decoded.id)
                .then(user => {
                    req.user = user;
                    next();
                })
                .catch(err => res.status(401).json({ message: "Invalid token" }));
        } catch (err) {
            res.status(401).json({ message: "Invalid token" });
        }
    } else {
        res.status(401).json({ message: "Unauthorized" });
    }
}; 