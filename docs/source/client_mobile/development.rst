Development Guide
=================

This guide provides information for developers working on the AREA Client Mobile project.

Project Structure
-----------------

- **lib**: Contains the main source code for the application.
- **widgets**: Reusable UI components.
- **pages**: Different pages of the application.
- **config**: Configuration files for API endpoints and OAuth settings.
- **services**: Services used to call backend (Login, Register, OAuth...)

Key Components
--------------

- **main.dart**: The main entry point of the application.
- **OAuthButtons**: Handles OAuth authentication with various providers.

OAuth Authorization Code Flow
-----------------------------

The AREA Client Mobile application uses the OAuth 2.0 Authorization Code Flow for secure authentication with third-party services. This flow involves the following steps:

1. **Authorization Request**: The user is redirected to the OAuth provider's authorization endpoint, where they log in and grant permissions to the application.

2. **Authorization Code**: After successful login, the provider redirects the user back to the application with an authorization code.

3. **Token Exchange**: The application uses the `OAuthService.dart` component to exchange the authorization code for an access token. This involves sending a request to the provider's token endpoint.

4. **Access Token**: Once the access token is received, it can be used to authenticate API requests to the provider on behalf of the user.

The `OAuthService.dart` component is responsible for handling the callback from the OAuth provider, verifying the state parameter, and exchanging the authorization code for an access token.

Running the Application
-----------------------

To run the application in development mode:

.. code-block:: sh

    flutter run

Building for Production
-----------------------

To build the application for production:

.. code-block:: sh

    flutter build apk --release

.. toctree::
    :maxdepth: 2

    app
    genericoauth
    genericcallback