CI/CD Pipeline
=============

This page details our Continuous Integration and Continuous Deployment (CI/CD) pipelines implemented using GitHub Actions.

Documentation Deployment
----------------------

Our documentation is automatically built and deployed using GitHub Actions whenever changes are pushed to the main branch.

Workflow Configuration
~~~~~~~~~~~~~~~~~~~~

.. code-block:: yaml

    name: Deploy Documentation
    
    on:
      push:
        branches:
          - main
        paths:
          - 'docs/**'
          - '.github/workflows/deploy-documentation.yml'

    jobs:
      deploy-documentation:
        runs-on: ubuntu-latest
        
        steps:
          - uses: actions/checkout@v4
          
          - name: Set up Python
            uses: actions/setup-python@v4
            with:
              python-version: '3.x'
          
          - name: Install dependencies
            run: |
              python -m pip install --upgrade pip
              pip install sphinx sphinx_rtd_theme
          
          - name: Build documentation
            run: |
              cd docs
              make html
          
          - name: Deploy to GitHub Pages
            uses: peaceiris/actions-gh-pages@v3
            with:
              github_token: ${{ secrets.GITHUB_TOKEN }}
              publish_dir: ./docs/build/html

Workflow Details
~~~~~~~~~~~~~~

Triggers
^^^^^^^^
The workflow is triggered on:

- Push events to the ``main`` branch
- Changes to files in the ``docs/`` directory
- Changes to the workflow file itself

Steps Explanation
^^^^^^^^^^^^^^^

1. **Checkout Repository**
   
   - Uses ``actions/checkout@v4`` to clone the repository
   - Ensures all documentation source files are available

2. **Python Setup**
   
   - Sets up Python environment using ``actions/setup-python@v4``
   - Uses latest Python version

3. **Dependencies Installation**
   
   - Upgrades pip to latest version
   - Installs Sphinx and Read the Docs theme

4. **Documentation Build**
   
   - Changes to docs directory
   - Runs ``make html`` to build documentation
   - Generates HTML files in ``docs/build/html``

5. **GitHub Pages Deployment**
   
   - Uses ``peaceiris/actions-gh-pages@v3``
   - Deploys built documentation to GitHub Pages
   - Uses ``GITHUB_TOKEN`` for authentication
   - Publishes content from ``./docs/build/html``

Access Points
-----------

The deployed documentation can be accessed at:``https://asm-studios.github.io/AREA/``