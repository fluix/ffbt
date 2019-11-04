# FFBT: Fluix Frontend Build Tools
Tool to create a Typescript web app without pain.

`npm i ffbt`

You don't need to install and configure Webpack with a lot of plugins for Typescript, SASS, etc. 
Everything is already preconfigured for you

## What's inside?
- Webpack with configurations for development and production environments
- Dev server with live reload
- Typescript
- SASS with autoprefixer and import-once plugin
- TSlint
- Stylelint

## Configuration
TBD

## How about unit tests?
We don't include a testing framework because it's depends on your needs. 
We suggest to start from [Jest](https://jestjs.io/) because it's fast and reliable solution.

Quick setup (using [ts-jest](https://github.com/kulshekhar/ts-jest) for Typescript support):
```
npm i -D jest ts-jest @types/jest
npx ts-jest config:init
npm test
```




