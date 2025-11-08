/**
 * Frontend Error Handling Verification Tests
 * Tests error scenarios, user-friendly messages, and graceful degradation in the UI
 * Requirements: 1.5, 2.3, 5.5
 */

import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import axios from 'axios';
import DashboardPage from '../pages/DashboardPage';
import LessonPage from '../pages/LessonPage';

// Mock axios
jest.mock('axios');

// Mock Auth0
const mockAuth0 = {
  user: {
    sub: 'auth0|123',
    email: 'test@example.com',
    name: 'Test User'
  },
  isAuthenticated: true,
  isLoading: false,
  getAccess