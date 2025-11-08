import { auth } from 'express-oauth2-jwt-bearer';

// Middleware to log incoming requests for debugging
export const logRequest = (req, res, next) => {
  console.log('=== Incoming Request ===');
  console.log('Method:', req.method);
  console.log('Path:', req.path);
  console.log('Authorization header:', req.headers.authorization ? 'Present' : 'Missing');
  if (req.headers.authorization) {
    const token = req.headers.authorization.replace('Bearer ', '');
    console.log('Token preview:', token.substring(0, 50) + '...');
    // Decode token payload (without verification) for debugging
    try {
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      console.log('Token payload:', JSON.stringify(payload, null, 2));
    } catch (e) {
      console.log('Could not decode token payload');
    }
  }
  console.log('=======================');
  next();
};

// Auth0 JWT verification middleware - create lazily to ensure env vars are loaded
let jwtMiddleware = null;

export const checkJwt = (req, res, next) => {
  // Initialize middleware on first request (after env vars are loaded)
  if (!jwtMiddleware) {
    console.log('Initializing JWT middleware...');
    console.log('AUTH0_DOMAIN:', process.env.AUTH0_DOMAIN);
    console.log('AUTH0_AUDIENCE:', process.env.AUTH0_AUDIENCE);
    
    if (process.env.AUTH0_AUDIENCE && process.env.AUTH0_DOMAIN) {
      jwtMiddleware = auth({
        audience: process.env.AUTH0_AUDIENCE,
        issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
        tokenSigningAlg: 'RS256'
      });
      console.log('JWT middleware initialized successfully');
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
    console.log('=== Extracting User Info ===');
    
    if (req.auth && req.auth.payload) {
      const payload = req.auth.payload;
      const namespace = process.env.AUTH0_AUDIENCE;
      
      console.log('Token payload:', payload);
      
      // Get user info from token payload
      let email = payload[`${namespace}/email`] || payload.email;
      let name = payload[`${namespace}/name`] || payload.name;
      const sub = payload.sub;
      
      // If email/name not in token, use sub as fallback
      if (!email || !name) {
        console.log('Email or name missing from token, using sub as fallback');
        // Use sub (user ID) as email fallback
        email = sub;
        // Extract name from sub (e.g., "google-oauth2|113181514516139244142" -> "113181514516139244142")
        name = sub.includes('|') ? sub.split('|')[1] : sub;
      }
      
      // Extract user information from the token
      req.user = {
        auth0Id: sub,
        email: email,
        name: name,
        role: payload[`${namespace}/role`] || 'student'
      };
      
      console.log('Extracted user:', req.user);
      console.log('===========================');
    } else {
      console.log('No req.auth.payload found');
      console.log('===========================');
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
