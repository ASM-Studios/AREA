App Component
=============

Overview
--------

The `App` component is the main entry point of the AREA Client Web application. It sets up routing, context providers, and global UI elements like the particle background and toast notifications.

Component Structure
-------------------

- **State**: Manages the initialization state for particles and the background color.
- **Effects**: Uses `useEffect` to initialize the particle engine and set the background color from session storage.
- **Routing**: Uses `react-router-dom` to define routes for different pages of the application.

Key Features
------------

- **Particles Background**: Uses `tsparticles` to render an animated particle background.
- **Toast Notifications**: Integrates `react-toastify` for displaying notifications.
- **Routing**: Defines routes for pages like Home, Login, Register, Dashboard, and more.

Usage
-----

The `App` component is rendered at the root of the application and wraps all other components. It provides the main layout and routing logic.

Example:

.. code-block:: jsx

    <ContextManager>
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </Router>
    </ContextManager> 