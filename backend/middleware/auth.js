import { auth } from 'express-oauth2-jwt-bearer';

// Auth0 JWT verification middleware
export const checkJwt = process.env.AUTH0_AUDIENCE && process.env.AUTH0_DOMAIN
  ? auth({
      audience: process.env.AUTH0_AUDIENCE,
      issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
      tokenSigningAlg: 'RS256'
    })
  : (req, res, next) => {
      // Fallback for testing without Auth0 configured
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid or expired authentication token'
        }
      });
    };

// Middleware to extract user info from token
export const extractUserInfo = (req, res, next) => {
  try {
    if (req.auth) {
      const namespace = process.env.AUTH0_AUDIENCE;
      
      // Extract user information from the token
      req.user = {
        auth0Id: req.auth.sub,
        email: req.auth[`${namespace}/email`] || req.auth.email,
        name: req.auth[`${namespace}/name`] || req.auth.name,
        role: req.auth[`${namespace}/role`] || 'student'
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
