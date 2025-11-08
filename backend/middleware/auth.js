import { auth } from 'express-oauth2-jwt-bearer';

// Middleware to log incoming requests
export const logRequest = (req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
};

// Auth0 JWT verification middleware - create lazily to ensure env vars are loaded
let jwtMiddleware = null;

export const checkJwt = (req, res, next) => {
  // Initialize middleware on first request (after env vars are loaded)
  if (!jwtMiddleware) {
    if (process.env.AUTH0_AUDIENCE && process.env.AUTH0_DOMAIN) {
      jwtMiddleware = auth({
        audience: process.env.AUTH0_AUDIENCE,
        issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
        tokenSigningAlg: 'RS256'
      });
      console.log('✓ JWT middleware initialized');
    } else {
      console.error('Cannot initialize JWT middleware - missing AUTH0_AUDIENCE or AUTH0_DOMAIN');
      return res.status(500).json({
        success: false,
        error: {
          code: 'SERVER_CONFIG_ERROR',
          message: 'Authentication not configured'
        }
      });
    }
  }
  
  // Call the initialized middleware
  jwtMiddleware(req, res, next);
};

// Middleware to extract user info from token
export const extractUserInfo = async (req, res, next) => {
  try {
    if (req.auth && req.auth.payload) {
      const payload = req.auth.payload;
      const namespace = process.env.AUTH0_AUDIENCE;
      
      // Get user info from token payload
      let email = payload[`${namespace}/email`] || payload.email;
      let name = payload[`${namespace}/name`] || payload.name;
      const sub = payload.sub;
      
      // If email/name not in token, fetch from Auth0 userinfo endpoint
      if (!email || !name) {
        try {
          const token = req.headers.authorization?.replace('Bearer ', '');
          if (token) {
            const axios = (await import('axios')).default;
            const userInfoResponse = await axios.get(
              `https://${process.env.AUTH0_DOMAIN}/userinfo`,
              {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            );
            
            const userInfo = userInfoResponse.data;
            email = email || userInfo.email || sub;
            name = name || userInfo.name || userInfo.nickname || 'User';
          }
        } catch (fetchError) {
          console.error('Error fetching user info from Auth0:', fetchError.message);
          // Fallback to using sub
          email = email || sub;
          name = name || 'User';
        }
      }
      
      // Extract user information from the token
      req.user = {
        auth0Id: sub,
        email: email,
        name: name,
        role: payload[`${namespace}/role`] || 'student',
        avatar: payload.picture || null
      };
    }
    next();
  } catch (error) {
    console.error('Error extracting user info:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'USER_INFO_EXTRACTION_ERROR',
        message: 'Failed to extract user information from token'
      }
    });
  }
};

// Middleware to check user role
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required'
        }
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Insufficient permissions'
        }
      });
    }

    next();
  };
};
