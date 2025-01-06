# AREA

AREA (Action Reaction) aims to connect multiple services together, similar to IFTTT.<br>
With AREA, you can create automated workflows that integrate various services and perform actions based on specific triggers.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation & Usage](#installation--usage)
- [Documentation](#documentation)
  - [Requirements](#requirements)
  - [Usage](#usage)
- [Tests](#tests)
- [License](#license)
- [Contributors](#contributors)

## Getting Started

### Prerequisites

- docker
- make

### Installation & Usage

<details>
<summary>Click to expand</summary>

1. Clone the repo

```sh
git clone git@github.com:ASM-Studios/AREA.git
```

2. Create .env files

- Run the following command to create private env files

```sh
cp .env.example .env
cp server/.env.server.example server/.env.server
cp client_web/.env.local.example .env.local
cp client_mobile/.env.mobile.example .env.mobile
```

- Fill the .env, .env.web and .env.mobile files

4. Run the project

- Run the project in full mode

```sh
make start-full
```

- Run the project in web mode (only web client and server)

```sh
make start-web
```

- Run the project in mobile mode (only mobile client and server)

```sh
make start-mobile
```

- Run the project in server mode (only server)

```sh
make start-server
```

</details>

### Documentation

#### Requirements

<details>
<summary>Click to expand</summary>

- Python
- sphinx
- spinx_rtd_theme
- sphinxcontrib-mermaid

sphinx, sphinx_rtd_theme and sphinxcontrib-mermaid can be installed using pip

</details>

#### Usage

The documentation is automatically built and deployed to GitHub Pages when a push is made to the `main` branch.

You can consult the documentation online at [AREA Documentation](https://asm-studios.github.io/AREA/).

You can build the documentation locally by running the following command:

```sh
cd AREA/docs
make docs
```

### Tests

// TODO

## License

![Github License](https://img.shields.io/badge/license-GLP3.0-yellowgreen.svg)

This project is licensed under the terms of the GLP3.0 license. See the [LICENSE](LICENSE) file for details.

## Contributors

This project was developed by:

- Maël RABOT
- Mathieu COULET
- Mathieu BOREL
- Charles MADJERI
- Samuel BRUSCHET
