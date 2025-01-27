CI/CD Pipeline
=============

Our project uses GitHub Actions for Continuous Integration and Continuous Deployment (CI/CD). We have three main workflows:

1. Docker Build and Test Pipeline
2. Documentation Deployment Pipeline
3. Container Registry Deployment Pipeline

Docker Build and Test Pipeline
-------------------

This pipeline handles testing and building of our Docker containers to ensure code quality and build integrity.

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
   - Verifies build integrity
   - Does not deploy containers

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

Container Registry Deployment
---------------------------

This pipeline handles the deployment of Docker images to our container registry.

Workflow Triggers
~~~~~~~~~~~~~~~

- Push events to main branch
- Manual workflow dispatch

Key Steps
~~~~~~~~

1. **Login to Container Registry**
   
   - Authenticates with container registry credentials
   - Sets up Docker buildx

2. **Build and Push Images**
   
   - Builds optimized production images
   - Tags images with appropriate versions
   - Pushes images to container registry

Access Points
-----------

- Documentation: ``https://asm-studios.github.io/AREA/``
- Container Registry: ``registry.digitalocean.com/area``