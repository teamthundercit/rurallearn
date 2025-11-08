# Testing Auth0 Authentication

This guide helps you test the Auth0 authentication implementation.

## Prerequisites

Before testing, ensure you have:

1. ✅ Completed Auth0 setup (see `AUTH0_SETUP.md`)
2. ✅ Created `.env` files in both `backend` and `frontend` directories
3. ✅ MongoDB Atlas cluster set up and connection string added to backend `.env`
4. ✅ Auth0 credentials added to both `.env` files

## Quick Start

### 1. Start the Backend

Open a terminal and run:

```bash
cd backend
npm run dev
```

You should see:
```
Server running on port 5000
Environment: development
MongoDB Connected: <your-cluster-host>
```

### 2. Start the Frontend

Open a new terminal and run:

```bash
cd frontend
npm start
```

The app should open at `http://localhost:3000`

## Testing the Authentication Flow

### Test 1: Login Page

1. Navigate to `http://localhost:3000`
2. You should see the RuralLearn login page with:
   - "Log In" button
   - "Sign Up" button
   - Feature highlights (Quality Content, AI-Powered, Offline Access)

### Test 2: Sign Up Flow

1. Click the **Sign Up** button
2. You should be redirected to Auth0's Universal Login page
3. Click "Sign up" at the bottom of the Auth0 form
4. Enter your email and password
5. Complete the signup process
6. You should be redirected back to `http://localhost:3000/dashboard`

### Test 3: Dashboard Access

After successful authentication, verify:

1. ✅ Dashboard displays your name and email in the header
2. ✅ Your role is displayed (should be "student" by default)
3. ✅ Profile picture is shown (if available from Auth0)
4. ✅ Three stat cards are visible (Lessons Completed, Average Score, Time Spent)
5. ✅ "Getting Started" section shows authentication as complete

### Test 4: Backend User Sync

Open your browser's Developer Tools (F12) and check the Network tab:

1. Look for a POST request to `/api/auth/callback`
   - Status should be `200 OK`
   - Response should contain user data

2. Look for a GET request to `/api/users/me`
   - Status should be `200 OK`
   - Response should contain your user profile

### Test 5: MongoDB Verification

1. Log in to MongoDB Atlas
2. Navigate to your cluster → Browse Collections
3. Open the `rurallearn` database
4. Check the `users` collection
5. You should see your user document with:
   - `auth0Id`
   - `email`
   - `name`
   - `role` (should be "student")
   - `createdAt` and `updatedAt` timestamps

### Test 6: Logout Flow

1. Click the **Logout** button in the dashboard header
2. You should be redirected to `http://localhost:3000/login`
3. Try accessing `http://localhost:3000/dashboard` directly
4. You should be redirected back to the login page (protected route working)

### Test 7: Login Flow

1. Click the **Log In** button
2. Enter your credentials on the Auth0 page
3. You should be redirected back to the dashboard
4. Verify your data is still displayed correctly

### Test 8: Token Verification

Test the backend authentication middleware:

1. Open a new terminal
2. Try accessing a protected endpoint without a token:

```bash
curl http://localhost:5000/api/users/me
```

Expected response:
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token"
  }
}
```

3. To test with a valid token, you can get it from the browser:
   - Open Developer Tools → Application → Local Storage
   - Look for Auth0 token entries
   - Copy the access token
   - Use it in a curl request:

```bash
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" http://localhost:5000/api/users/me
```

Expected response:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "auth0Id": "...",
      "email": "...",
      "name": "...",
      "role": "student",
      ...
    }
  }
}
```

## Testing Different User Roles

### Create a Mentor User

1. Log in to Auth0 Dashboard
2. Navigate to **User Management** → **Users**
3. Find your test user
4. Click on the user
5. Go to the **Roles** tab
6. Click **Assign Roles**
7. Select the `mentor` role
8. Click **Assign**
9. Log out and log back in to the app
10. Your role should now show as "mentor" in the dashboard

## Common Issues and Solutions

### Issue: "Configuration Error" on frontend

**Solution**: 
- Check that `.env` file exists in the `frontend` directory
- Verify all three Auth0 variables are set:
  - `REACT_APP_AUTH0_DOMAIN`
  - `REACT_APP_AUTH0_CLIENT_ID`
  - `REACT_APP_AUTH0_AUDIENCE`

### Issue: "Callback URL mismatch" error

**Solution**:
- Go to Auth0 Dashboard → Applications → Your App → Settings
- Add `http://localhost:3000` and `http://localhost:3000/callback` to **Allowed Callback URLs**
- Save changes

### Issue: Backend returns 401 Unauthorized

**Solution**:
- Check that `AUTH0_DOMAIN` and `AUTH0_AUDIENCE` in backend `.env` match your Auth0 configuration
- Verify the token is being sent in the Authorization header
- Check that the Auth0 API identifier matches the audience

### Issue: MongoDB connection error

**Solution**:
- Verify `MONGODB_URI` in backend `.env` is correct
- Check that your IP address is whitelisted in MongoDB Atlas
- Ensure the database user has proper permissions

### Issue: User not created in database

**Solution**:
- Check backend console for errors
- Verify MongoDB connection is successful
- Check that the `/api/auth/callback` endpoint is being called
- Look for errors in the browser console

### Issue: Token doesn't contain role information

**Solution**:
- Verify the Auth0 Action is deployed and added to the Login flow
- Check that the namespace in the Action matches your API identifier
- Log out and log back in to get a new token with the updated claims

## API Endpoints Reference

### Authentication Endpoints

```
POST /api/auth/callback
- Creates or updates user in database
- Requires: Valid Auth0 JWT token
- Returns: User data
```

### User Endpoints

```
GET /api/users/me
- Gets current user profile
- Requires: Valid Auth0 JWT token
- Returns: User profile data

PUT /api/users/me
- Updates current user profile
- Requires: Valid Auth0 JWT token
- Body: { name, avatar }
- Returns: Updated user data
```

## Next Steps

After successfully testing authentication:

1. ✅ Task 2.1: Auth0 application configured
2. ✅ Task 2.2: Frontend Auth0 integration complete
3. ✅ Task 2.3: Backend token verification complete
4. ⏭️ Task 3: Set up MongoDB database and models
5. ⏭️ Task 4: Implement user management endpoints
6. ⏭️ Task 5: Build dashboard frontend

## Security Notes

- Never commit `.env` files to version control
- Keep your Auth0 credentials secure
- Use HTTPS in production
- Enable MFA for production users
- Regularly rotate API keys and secrets
- Monitor Auth0 logs for suspicious activity

## Support

If you encounter issues not covered here:

1. Check the browser console for errors
2. Check the backend terminal for errors
3. Review Auth0 logs in the Auth0 Dashboard
4. Verify all environment variables are set correctly
5. Ensure all dependencies are installed (`npm install`)
