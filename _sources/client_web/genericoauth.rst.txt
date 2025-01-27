GenericOAuth Component
======================

Overview
--------

The `GenericOAuth` component is a reusable button component designed to handle OAuth authentication for various services. It provides a consistent interface for initiating OAuth login flows.

Component Structure
-------------------

- **Props**: The component accepts several props to customize its behavior:
  - `handleLogin`: A function to be called when the button is clicked, initiating the OAuth flow.
  - `buttonText`: The text to display on the button.
  - `disabled`: A boolean indicating whether the button should be disabled.
  - `service`: The name of the OAuth service (e.g., Google, GitHub).
  - `iconSrc`: The source URL for the service's icon.

- **Styling**: The button is styled using Tailwind CSS classes to ensure a consistent look and feel across different services.

Usage
-----

The `GenericOAuth` component is used within the `OAuthButtons` component to render a list of OAuth buttons for different services. Each button is configured with a specific `handleLogin` function and icon.

Example:

.. code-block:: jsx

    <GenericOAuthButton
        handleLogin={handleGoogleLogin}
        buttonText="Sign in with Google"
        service="google"
        iconSrc="/google-icon.png"
    />

Interaction with `config.ts`
----------------------------

The `config.ts` file contains the configuration for each OAuth service, including the `handleLogin` functions. These functions are responsible for constructing the OAuth authorization URL and redirecting the user to the service's login page.

Key Functions in `config.ts`:

- **generateCodeChallenge**: Generates a code challenge for PKCE (Proof Key for Code Exchange) to enhance security during the OAuth flow.
- **handleGoogleLogin**: Constructs the Google OAuth URL and redirects the user.
- **handleGithubLogin**: Constructs the GitHub OAuth URL and redirects the user.

Each service's configuration includes:

- `handler`: The function to initiate the OAuth flow.
- `disabled`: A boolean indicating whether the service is available (based on the presence of required credentials).
- `icon`: The path to the service's icon.

Example Configuration:

.. code-block:: typescript

    const config: Record<string, AuthConfig> = {
        "google": {
            "handler": handleGoogleLogin,
            "disabled": !uri.google.auth.clientId,
            "icon": "/google-icon.png"
        },
        "github": {
            "handler": handleGithubLogin,
            "disabled": !uri.github.auth.clientId,
            "icon": "/github-icon.png"
        },
    }; 