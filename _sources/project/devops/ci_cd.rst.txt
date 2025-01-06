CI/CD Pipeline
=============

Our project uses GitHub Actions for Continuous Integration and Continuous Deployment (CI/CD). We have two main workflows:

1. Docker Build Pipeline
2. Documentation Deployment Pipeline

Docker Build Pipeline
-------------------

This pipeline handles testing and building of our Docker containers.

Workflow Triggers
~~~~~~~~~~~~~~~

- Push events to any branch
- Tag pushes with 'v*' prefix
- Excludes documentation and markdown files

Key Steps
~~~~~~~~

1. **Test Client Web**
   
   - Runs on Node.js 20
   - Executes npm tests
   - Skips if commit message contains 'WIP'/'wip'

2. **Docker Build**
   
   - Builds all service containers
   - Sets up environment variables
   - Pushes to GitHub Container Registry on main branch

Documentation Deployment
----------------------

Automatically builds and deploys documentation to GitHub Pages.

Workflow Triggers
~~~~~~~~~~~~~~~

- Push events to master branch
- Ignores changes in client and server directories

Key Steps
~~~~~~~~

1. **Build Documentation**
   
   - Uses Sphinx with Read the Docs theme
   - Includes support for Mermaid diagrams
   - Generates HTML documentation

2. **Deploy to GitHub Pages**
   
   - Publishes to gh-Pages branch
   - Uses GitHub token for authentication
   - Forces clean deployment

Access Points
-----------

- Documentation: ``https://asm-studios.github.io/AREA/``
- Container Registry: ``ghcr.io/asm-studios/area``