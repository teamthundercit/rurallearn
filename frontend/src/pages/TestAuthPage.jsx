import { useAuth0 } from '@auth0/auth0-react';

const TestAuthPage = () => {
    const {
        isAuthenticated,
        isLoading,
        user,
        error,
        loginWithRedirect,
        logout
    } = useAuth0();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
                <h1 className="text-3xl font-bold mb-6 text-center">Auth0 Debug Page</h1>

                <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded">
                        <h2 className="font-semibold mb-2">Authentication Status:</h2>
                        <p><strong>Is Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
                        <p><strong>Is Authenticated:</strong> {isAuthenticated ? 'Yes ✅' : 'No ❌'}</p>
                        <p><strong>Has Error:</strong> {error ? 'Yes ❌' : 'No ✅'}</p>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 rounded border border-red-200">
                            <h2 className="font-semibold text-red-700 mb-2">Error:</h2>
                            <pre className="text-sm text-red-600 whitespace-pre-wrap">
                                {JSON.stringify(error, null, 2)}
                            </pre>
                        </div>
                    )}

                    {user && (
                        <div className="p-4 bg-green-50 rounded border border-green-200">
                            <h2 className="font-semibold text-green-700 mb-2">User Info:</h2>
                            <pre className="text-sm text-green-600 whitespace-pre-wrap">
                                {JSON.stringify(user, null, 2)}
                            </pre>
                        </div>
                    )}

                    <div className="p-4 bg-blue-50 rounded">
                        <h2 className="font-semibold mb-2">Environment Variables:</h2>
                        <p><strong>Domain:</strong> {process.env.REACT_APP_AUTH0_DOMAIN || '❌ Missing'}</p>
                        <p><strong>Client ID:</strong> {process.env.REACT_APP_AUTH0_CLIENT_ID ? '✅ Set' : '❌ Missing'}</p>
                        <p><strong>Audience:</strong> {process.env.REACT_APP_AUTH0_AUDIENCE || '❌ Missing'}</p>
                        <p><strong>API URL:</strong> {process.env.REACT_APP_API_URL || '❌ Missing'}</p>
                    </div>

                    <div className="flex gap-4">
                        {!isAuthenticated ? (
                            <button
                                onClick={() => loginWithRedirect()}
                                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                Login with Auth0
                            </button>
                        ) : (
                            <button
                                onClick={() => logout({ returnTo: window.location.origin })}
                                className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
                            >
                                Logout
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestAuthPage;
