# Auth0 Setup Guide

This guide walks you through setting up Auth0 authentication for RuralLearn.

## Prerequisites

- An Auth0 account (sign up at https://auth0.com if you don't have one)

## Step 1: Create Auth0 Application

1. Log in to your Auth0 Dashboard (https://manage.auth0.com)
2. Navigate to **Applications** > **Applications** in the sidebar
3. Click **Create Application**
4. Enter the following details:
   - **Name**: RuralLearn
   - **Application Type**: Select **Single Page Web Applications**
5. Click **Create**

## Step 2: Configure Application Settings

After creating the application, you'll be taken to the application settings page.

### Basic Settings

1. Note down the following values (you'll need them for your `.env` files):
   - **Domain** (e.g., `your-tenant.auth0.com`)
   - **Client ID** (e.g., `abc123xyz456`)

### Application URIs

Scroll down to the **Application URIs** section and configure:

1. **Allowed Callback URLs**:
   ```
   http://localhost:3000/callback,
   http://localhost:3000
   ```

2. **Allowed Logout URLs**:
   ```
   http://localhost:3000
   ```

3. **Allowed Web Origins**:
   ```
   http://localhost:3000
   ```

4. **Allowed Origins (CORS)**:
   ```
   http://localhost:3000
   ```

5. Click **Save Changes** at the bottom of the page

### Advanced Settings

1. Scroll down to **Advanced Settings**
2. Click on the **OAuth** tab
3. Ensure **JsonWebToken Signature Algorithm** is set to `RS256`
4. Click **Save Changes**

## Step 3: Create Auth0 API

1. Navigate to **Applications** > **APIs** in the sidebar
2. Click **Create API**
3. Enter the following details:
   - **Name**: RuralLearn API
   - **Identifier**: `https://rurallearn-api` (this is your API audience)
   - **Signing Algorithm**: RS256
4. Click **Create**

## Step 4: Set Up User Roles

1. Navigate to **User Management** > **Roles** in the sidebar
2. Click **Create Role**

### Create Student Role

1. **Name**: `student`
2. **Description**: `Student user with access to lessons and quizzes`
3. Click **Create**
4. Go to the **Permissions** tab
5. Click **Add Permissions**
6. Select **RuralLearn API**
7. Add the following permissions:
   - `read:lessons`
   - `read:progress`
   - `write:progress`
   - `read:recommendations`
8. Click **Add Permissions**

### Create Mentor Role

1. Click **Create Role** again
2. **Name**: `mentor`
3. **Description**: `Mentor user with access to student management`
4. Click **Create**
5. Go to the **Permissions** tab
6. Click **Add Permissions**
7. Select **RuralLearn API**
8. Add the following permissions:
   - `read:lessons`
   - `read:progress`
   - `write:progress`
   - `read:recommendations`
   - `read:students`
   - `write:students`
9. Click **Add Permissions**

## Step 5: Configure User Metadata

To automatically assign roles during signup, we'll use Auth0 Actions.

1. Navigate to **Actions** > **Flows** in the sidebar
2. Click on **Login**
3. Click **Custom** tab, then click the **+** button to create a new action
4. **Name**: `Assign Default Role`
5. **Trigger**: `Login / Post Login`
6. Click **Create**

7. Replace the code with:

```javascript
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://rurallearn-api';
  
  // Check if user already has a role
  if (event.authorization) {
    const roles = event.authorization.roles || [];
    
    // If no roles assigned, assign student role by default
    if (roles.length === 0) {
      api.user.setAppMetadata('role', 'student');
      api.idToken.setCustomClaim(`${namespace}/role`, 'student');
      api.accessToken.setCustomClaim(`${namespace}/role`, 'student');
    } else {
      // Add existing role to token
      const role = roles[0];
      api.idToken.setCustomClaim(`${namespace}/role`, role);
      api.accessToken.setCustomClaim(`${namespace}/role`, role);
    }
  } else {
    // Default to student role
    api.user.setAppMetadata('role', 'student');
    api.idToken.setCustomClaim(`${namespace}/role`, 'student');
    api.accessToken.setCustomClaim(`${namespace}/role`, 'student');
  }
  
  // Add user metadata to tokens
  api.idToken.setCustomClaim(`${namespace}/email`, event.user.email);
  api.idToken.setCustomClaim(`${namespace}/name`, event.user.name);
  api.accessToken.setCustomClaim(`${namespace}/email`, event.user.email);
};
```

8. Click **Deploy**
9. Go back to the **Login** flow
10. Drag the **Assign Default Role** action from the right sidebar to the flow between **Start** and **Complete**
11. Click **Apply**

## Step 6: Update Environment Variables

### Backend (.env)

Create a `.env` file in the `backend` directory (copy from `.env.example`):

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/rurallearn?retryWrites=true&w=majority

# Auth0 Configuration
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_AUDIENCE=https://rurallearn-api

# Gemini AI Configuration
GEMINI_API_KEY=your-gemini-api-key

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

Replace:
- `your-tenant.auth0.com` with your Auth0 Domain
- `https://rurallearn-api` with your API Identifier (if you used a different one)

### Frontend (.env)

Create a `.env` file in the `frontend` directory (copy from `.env.example`):

```env
# Auth0 Configuration
REACT_APP_AUTH0_DOMAIN=your-tenant.auth0.com
REACT_APP_AUTH0_CLIENT_ID=your-client-id
REACT_APP_AUTH0_AUDIENCE=https://rurallearn-api

# Backend API URL
REACT_APP_API_URL=http://localhost:5000
```

Replace:
- `your-tenant.auth0.com` with your Auth0 Domain
- `your-client-id` with your Auth0 Client ID
- `https://rurallearn-api` with your API Identifier (if you used a different one)

## Step 7: Test the Configuration

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. In a new terminal, start the frontend:
   ```bash
   cd frontend
   npm start
   ```

3. Navigate to http://localhost:3000
4. Click the login button (once implemented)
5. You should be redirected to Auth0's Universal Login page
6. Sign up or log in
7. You should be redirected back to the application

## Troubleshooting

### "Callback URL mismatch" error
- Verify that `http://localhost:3000/callback` and `http://localhost:3000` are in the **Allowed Callback URLs**
- Make sure there are no trailing slashes

### "Origin not allowed" error
- Verify that `http://localhost:3000` is in the **Allowed Web Origins** and **Allowed Origins (CORS)**

### Token doesn't contain role information
- Check that the Auth0 Action is deployed and added to the Login flow
- Verify the namespace in the Action matches your API identifier

### User can't access protected routes
- Verify the API permissions are correctly assigned to roles
- Check that users have been assigned the appropriate role

## Production Configuration

When deploying to production, remember to:

1. Add your production URLs to Auth0 Application URIs:
   - Allowed Callback URLs
   - Allowed Logout URLs
   - Allowed Web Origins
   - Allowed Origins (CORS)

2. Update environment variables with production values

3. Enable MFA (Multi-Factor Authentication) for enhanced security:
   - Navigate to **Security** > **Multi-factor Auth**
   - Enable at least one MFA method

4. Configure password policies:
   - Navigate to **Security** > **Attack Protection**
   - Configure Brute Force Protection and Suspicious IP Throttling

## Next Steps

After completing this setup:
- Proceed to implement Auth0 integration in the frontend (Task 2.2)
- Implement Auth0 token verification in the backend (Task 2.3)
