# Auth0 Redirect Fix Guide

## Problem
After signup, users are redirected to the login page instead of the dashboard.

## Solution

### 1. Configure Auth0 Application Settings

Go to your Auth0 Dashboard: https://manage.auth0.com/

Navigate to: **Applications** → **Applications** → **Your Application (RuralLearn)**

#### Update the following settings:

**Allowed Callback URLs:**
```
http://localhost:3000
```
⚠️ **Important:** Only add `http://localhost:3000` (the root URL). Do NOT add `/dashboard` or any other path. Auth0 will redirect to the root, then our app will navigate to the dashboard.

**Allowed Logout URLs:**
```
http://localhost:3000
http://localhost:3000/login
```

**Allowed Web Origins:**
```
http://localhost:3000
```

**Allowed Origins (CORS):**
```
http://localhost:3000
```

### 2. Application Type
Make sure your application type is set to: **Single Page Application**

### 3. Advanced Settings

Go to **Advanced Settings** → **OAuth** tab:

- **JsonWebToken Signature Algorithm:** RS256
- **OIDC Conformant:** Enabled

### 4. Grant Types

Ensure these grant types are enabled:
- ✅ Implicit
- ✅ Authorization Code
- ✅ Refresh Token

### 5. Save Changes

Click **Save Changes** at the bottom of the page.

## Testing

1. Clear your browser cache and localStorage:
   ```javascript
   // Open browser console and run:
   localStorage.clear();
   sessionStorage.clear();
   ```

2. Restart your frontend development server:
   ```bash
   cd frontend
   npm start
   ```

3. Try signing up with a new account

4. Check the browser console for debug logs:
   - Look for "=== Starting Signup Flow ==="
   - Look for "=== Auth0 Redirect Callback ==="
   - Check for any error messages

## Common Issues

### Issue 1: "Callback URL mismatch"
**Solution:** Make sure `http://localhost:3000` is in the Allowed Callback URLs

### Issue 2: Still redirecting to login
**Solution:** 
- Clear browser cache and localStorage
- Check that the Auth0 domain and client ID in `.env` match your Auth0 application
- Verify the application type is "Single Page Application"

### Issue 3: CORS errors
**Solution:** Add `http://localhost:3000` to Allowed Origins (CORS)

## Debug Checklist

- [ ] Auth0 Callback URLs configured correctly
- [ ] Application type is "Single Page Application"
- [ ] Browser cache and localStorage cleared
- [ ] Frontend server restarted
- [ ] Console shows no Auth0 errors
- [ ] Environment variables are correct in `.env`

## Current Configuration

Your `.env` file should have:
```
REACT_APP_AUTH0_DOMAIN=teamthunder.us.auth0.com
REACT_APP_AUTH0_CLIENT_ID=waP5AjvUjXbpJBsb7B0BJ6LRTlyw9Qd8
REACT_APP_AUTH0_AUDIENCE=https://rurallearn-api
REACT_APP_API_URL=http://localhost:5000
```

## What Changed in the Code

1. **Auth0ProviderWithHistory.jsx**: Added better logging and a small delay to ensure Auth0 state is updated
2. **App.jsx**: 
   - Added detection for Auth0 callback (checks for `code` and `state` URL parameters)
   - Shows loading spinner during callback processing to prevent premature redirects
   - Improved route guards to redirect authenticated users away from login page
   - Added comprehensive debug logging
3. **LoginPage.jsx**: Added explicit redirect_uri to both login and signup flows

### The Key Fix
The main issue was that when Auth0 redirected back to your app with `?code=...&state=...`, the app would check `isAuthenticated` (which was still `false`) and immediately redirect to `/login` before Auth0 could process the callback. Now we detect the callback and show a loading state until Auth0 finishes processing.

## Next Steps

After configuring Auth0:
1. Clear browser data
2. Restart frontend server
3. Try signup again
4. Check console logs for any errors
5. If still not working, check the Network tab for Auth0 API calls
