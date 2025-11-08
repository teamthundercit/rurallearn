# Debugging 401 Error on Dashboard

## Current Status
✅ Backend server is running on port 5000
✅ User successfully logs in and reaches dashboard
❌ Dashboard gets 401 error when calling API

## The Problem
The dashboard is making API calls but getting 401 (Unauthorized) responses.

## Possible Causes

### 1. Token Not Being Sent
The frontend might not be sending the Auth0 token in the request headers.

### 2. Token Format Issue
The token might not be in the correct format (should be `Bearer <token>`).

### 3. Auth0 Audience Mismatch
The token audience might not match what the backend expects.

### 4. Token Not Yet Available
The token might not be ready when the API calls are made.

## Quick Fix Steps

### Step 1: Check Browser Console
Open browser console (F12) and look for:
- Any error messages
- Network tab → Check the failed request
- Look at the Request Headers → Is `Authorization: Bearer ...` present?
- Look at the Response → What does the error say?

### Step 2: Check Token in Console
Add this to your browser console to see the token:
```javascript
// Check if token is being retrieved
localStorage.getItem('@@auth0spajs@@::waP5AjvUjXbpJBsb7B0BJ6LRTlyw9Qd8::https://rurallearn-api::openid profile email')
```

### Step 3: Verify Backend Environment
The backend `.env` should have:
```
AUTH0_DOMAIN=teamthunder.us.auth0.com
AUTH0_AUDIENCE=https://rurallearn-api
```

### Step 4: Verify Frontend Environment
The frontend `.env` should have:
```
REACT_APP_AUTH0_DOMAIN=teamthunder.us.auth0.com
REACT_APP_AUTH0_CLIENT_ID=waP5AjvUjXbpJBsb7B0BJ6LRTlyw9Qd8
REACT_APP_AUTH0_AUDIENCE=https://rurallearn-api
REACT_APP_API_URL=http://localhost:5000
```

## Common Issues & Solutions

### Issue: "No authorization token was found"
**Solution:** The token isn't being sent. Check that `getAccessTokenSilently()` is working.

### Issue: "jwt malformed"
**Solution:** The token format is wrong. Should be `Bearer <token>`.

### Issue: "jwt audience invalid"
**Solution:** The audience in the token doesn't match the backend's expected audience.

### Issue: "jwt issuer invalid"
**Solution:** The Auth0 domain doesn't match.

## Testing the Token

You can test if your token works by:

1. Get your token from the browser console
2. Test it with curl:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" http://localhost:5000/api/users/me
```

If this works, the problem is in how the frontend is sending the token.
If this fails, the problem is with the token itself or backend configuration.

## Next Steps

1. Check browser console for errors
2. Check Network tab for the failed request
3. Verify the Authorization header is being sent
4. Check if the token audience matches
5. Restart both frontend and backend servers if needed
