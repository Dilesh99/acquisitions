import aj from '#config/arcjet.js';
import { slidingWindow } from '@arcjet/node';
import logger from '#config/logger.js';


const securityMiddleware = async (req, res, next) => {
  try {
    const role = req.user?.role || 'guest';

    let limit;
    let message;

    switch (role) {
      case 'admin':
        limit = 20; // High limit for admin
        message = 'Admin request limit exceeded (20 per minute). Slow down!';
        break;
      case 'user':
        limit = 10; // Medium limit for authenticated users
        message = 'User request limit exceeded (10 per minute). Slow down!';
        break;
      case 'guest':
        limit = 5; // Low limit for guests
        message = 'Guest request limit exceeded (5 per minute). Slow down!';
        break;
    } 
    
    const client = aj.withRule(slidingWindow({
      mode: 'LIVE',
      interval: '1m', // 1 minute intervals
      max: limit,    // max requests per role
      name: `Rate limit for ${role}`,
    }));

    const decision = await client.protect(req);

    if (decision.isDenied() && decision.reason.isBot()) {
      logger.warn('Bot request blocked',{
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
        
      });
      return res.status(403).json({ error: 'Forbidden', message: 'Bot activity detected. Access denied.' });
    }

    if (decision.isDenied() && decision.reason.isShield()) {
      logger.warn('Shield request blocked',{
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
        method: req.method,
      });
      return res.status(403).json({ error: 'Forbidden', message: 'Request blocked by security policy. Access denied.' });
    }

    if (decision.isDenied() && decision.reason.isRateLimit()) {
      logger.warn('Rate limit exceeded',{
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
        
      });
      return res.status(403).json({ error: 'Forbidden', message: 'Too many requests.' });
    }
    next();
   

  } catch (e) {
    console.error('Arcjet middleware error:', e);
    res.status(500).json({ error: 'Internal Server Error', message: 'Arcjet Security middleware failure' });
    
  }
};

export default securityMiddleware;