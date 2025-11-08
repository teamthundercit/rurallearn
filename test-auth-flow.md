# Test Auth Flow - Step by Step

## Before Testing

1. **Configure Auth0 Dashboard** (see AUTH0_REDIRECT_FIX.md)
   - Add callback URLs
   - Verify application type
   - Save changes

2. **Clear Browser Data**
   ```javascript
   // Open browser console (F12) and run:
   localStorage.clear();
   sessionStorage.clear();
   location.reload();
   ```

3. **Restart Frontend Server**
   ```bash
   cd frontend
   npm start
   ```

## Test Signup Flow

### Step 1: Open Application
- Navigate to: http://localhost:3000
- You should see the login page

### Step 2: Click "Sign Up"
- Click the "Sign Up" button
- You should be redirected to Auth0's signup page

### Step 3: Complete Signup
- Enter email and password
- Complete signup form
- Click "Continue" or "Sign Up"

### Step 4: Check Console Logs
Open browser console (F12) and look for:
```
=== Starting Signup Flow ===
=== Auth0 Redirect Callback ===
appState: {returnTo: '/dashboard'}
Redirecting to: /dashboard
```

### Step 5: Verify Dashboard
- You should land on the dashboard page
- URL should be: http://localhost:3000/dashboard
- You should see your user info

## Test Login Flow

### Step 1: Logout
- Click logout button (if available)
- Or clear localStorage and reload

### Step 2: Click "Log In"
- Click the "Log In" button
- You should be redirected to Auth0's login page

### Step 3: Enter Credentials
- Enter your email and password
- Click "Continue" or "Log In"

### Step 4: Verify Dashboard
- You should land on the dashboard page
- No redirect to login page

## Troubleshooting

### If you see "Callback URL mismatch" error:
1. Go to Auth0 Dashboard
2. Check Allowed Callback URLs includes: `http://localhost:3000`
3. Save and try again

### If redirected back to login after signup:
1. Check browser console for errors
2. Verify Auth0 configuration
3. Clear browser cache completely
4. Try in incognito/private window

### If you see CORS errors:
1. Add `http://localhost:3000` to Allowed Origins (CORS) in Auth0
2. Restart frontend server

## Expected Console Output

### On Login Page:
```
=== LOGIN PAGE DEBUG ===
isAuthenticated: false
isLoading: false
error: null
ENV - Domain: teamthunder.us.auth0.com
ENV - Client ID: Set
ENV - Audience: https://rurallearn-api
========================
```

### After Clicking Signup:
```
=== Starting Signup Flow ===
```

### After Auth0 Redirect:
```
=== Auth0 Redirect Callback ===
appState: {returnTo: '/dashboard'}
window.location: http://localhost:3000/?code=...&state=...
Redirecting to: /dashboard
```

### On Dashboard:
```
LoginPage - isAuthenticated: true
User is authenticated, redirecting to dashboard...
```

## Success Criteria

✅ Signup redirects to dashboard (not login page)
✅ Login redirects to dashboard
✅ No console errors
✅ User can access protected routes
✅ Logout works correctly

## If Still Not Working

1. Check Network tab in browser DevTools
2. Look for Auth0 API calls
3. Check response status codes
4. Verify token is being received
5. Share console logs for debugging
