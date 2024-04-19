# GEC

## Requirements

- NodeJS 12+
- NPM 6+
- PostgreSQL 9.5+

You will also need to provide the `config/default.json` file. This file contains credentials and other sensible information so it is not pushed to the repository. Ask the mantainers for an example of this file. After that open this file and complete/change with your local credentials. Make sure that the database exists before running the app.

## Install

    npm install


## Run locally

    npm start

## Build frontend files for production

    npm run build

After this command the compiled files are in the `dist` directory

## Run in production

    npm run production