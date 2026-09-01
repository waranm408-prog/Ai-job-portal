import jwt from 'jsonwebtoken';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  console.log('Auth middleware - Authorization header:', authHeader ? 'Present' : 'Missing');
  console.log('Auth middleware - Token:', token ? 'Present' : 'Missing');
  
  if (!token) return res.status(401).json({ error: 'Token missing' });

  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
    if (err) {
      console.log('Auth middleware - Token verification failed:', err.message);
      return res.status(403).json({ error: 'Invalid token' });
    }
    
    console.log('Auth middleware - Decoded user:', user);
    req.user = user;
    next();
  }); 1 `87`
}

export { authenticateToken };
