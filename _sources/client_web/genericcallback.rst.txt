GenericCallback Component
=========================

Overview
--------

The `GenericCallback` component is responsible for handling the OAuth callback process. It manages the exchange of authorization codes for access tokens, ensuring secure authentication with third-party services.

Component Structure
-------------------

- **State Management**: 
  - `error`: Stores any error messages encountered during the callback process.
  - `service`: Identifies the OAuth service being used.
  - `hasHandledCallback`: A ref to ensure the callback is only processed once.

- **Key Functions**:
  - `getServiceFromLocation`: Determines the service based on the current URL.
  - `handleCallback`: Processes the OAuth callback, exchanges the authorization code for an access token, and handles any errors.

- **Effects**:
  - `useEffect`: Initializes the service and handles the callback when the component mounts.

OAuth Process
-------------

The `GenericCallback` component plays a crucial role in the OAuth 2.0 Authorization Code Flow:

1. **Service Identification**: Determines which OAuth service is being used based on the URL.
2. **State Verification**: Ensures the state parameter matches the stored value to prevent CSRF attacks.
3. **Token Exchange**: Sends a request to the OAuth provider's token endpoint to exchange the authorization code for an access token.
4. **Error Handling**: Manages errors during the callback process and provides user feedback.

Usage
-----

The `GenericCallback` component is used in the routing configuration to handle OAuth callbacks. It ensures that the application can securely authenticate users with various OAuth providers.

Example:

.. code-block:: jsx

    <Route path="/auth/:service/callback" element={<GenericCallback />} />

Error Handling
--------------

The component provides user feedback in case of errors during the OAuth process. It displays error messages and redirects the user to the appropriate page after a short delay.

Example Error Handling:

.. code-block:: jsx

    {error ? (
        <>
            <h3 style={{ color: '#ff4d4f' }}>
                {error}
            </h3>
            <p>
                {translations?.callback.redirect.message}
            </p>
        </>
    ) : (
        <Spin size="large" />
    )} 