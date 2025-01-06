Development Guide
=================

This guide provides information for developers working on the AREA Client Web project.

Project Structure
-----------------

- **src**: Contains the main source code for the application.
- **Components**: Reusable UI components.
- **Pages**: Different pages of the application.
- **Context**: Context providers for global state management.
- **Config**: Configuration files for API endpoints and OAuth settings.

Key Components
--------------

- **App.tsx**: The main entry point of the application.
- **Layout**: Manages the layout of the application, including the header and footer.
- **OAuthButtons**: Handles OAuth authentication with various providers.
- **GenericCallback.tsx**: Manages the OAuth callback process, handling the exchange of authorization codes for access tokens.

OAuth Authorization Code Flow
-----------------------------

The AREA Client Web application uses the OAuth 2.0 Authorization Code Flow for secure authentication with third-party services. This flow involves the following steps:

1. **Authorization Request**: The user is redirected to the OAuth provider's authorization endpoint, where they log in and grant permissions to the application.

2. **Authorization Code**: After successful login, the provider redirects the user back to the application with an authorization code.

3. **Token Exchange**: The application uses the `GenericCallback.tsx` component to exchange the authorization code for an access token. This involves sending a request to the provider's token endpoint.

4. **Access Token**: Once the access token is received, it can be used to authenticate API requests to the provider on behalf of the user.

The `GenericCallback.tsx` component is responsible for handling the callback from the OAuth provider, verifying the state parameter, and exchanging the authorization code for an access token.

Running the Application
-----------------------

To run the application in development mode:

.. code-block:: sh

    npm run dev

Building for Production
-----------------------

To build the application for production:

.. code-block:: sh

    npm run build 

.. toctree::
    :maxdepth: 2

    app
    genericoauth
    genericcallback