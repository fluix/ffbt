# FFBT: Fluix Frontend Build Tools [![Build Status](https://travis-ci.org/fluix/ffbt.svg?branch=master)](https://travis-ci.org/fluix/ffbt)

A tool to create a Typescript web app without pain. 

`npm i ffbt`

You don't need to install and configure Webpack with a lot of plugins for Typescript, SASS, etc. 
Everything is already preconfigured for you

## What's inside?
- Webpack with configurations for development and production environments
- Dev server with live reload
- Typescript
- SASS with Autoprefixer and import-once plugin
- TSlint
- Stylelint

## Quick start
```sh
npx typescript --init
npm i -g ffbt
touch index.ts
ffbt dev . --server
```

You can run FFBT as a global executable or install it locally and invoke via NPM scripts

## How about unit tests?
We don't include a testing framework. Every project is unique and sometimes needs a specific test environment. 
We suggest starting from [Jest](https://jestjs.io/) because it's a fast and reliable solution.

Quick setup (using [ts-jest](https://github.com/kulshekhar/ts-jest) for Typescript support):
```
npm i -D jest ts-jest @types/jest
npx ts-jest config:init
```
And run jest via NPM command. Here a package.json example:
```json
{
    "scripts": {
        "test": "jest",
    }
}
```

If you want to use Karma or something other which needs Webpack, you can configure it via `configureWebpack` hook in `ffbt-config.js`. See the docs about the configuration below.

## Configuration
Create a file with name `ffbt-config.js` in the root of your project (near the package.json file)

### Full annotated config example:
```javascript
module.exports = {
    // FFBT is the environment-centric tool, almost all configuration describes in environments
    // You can extend environments from each other
    // All environments extend from "default" automatically unless you specify "_extends" property.
    // See the example below
    environments: {
        default: {
            // It contains default values for all flags in the system.
            // See a list of all flags in the table below.

            // Use it if you want to propagate values to all environments
        },
        development: {
            // Used by default in `ffbt dev` command
        },
        production: {
            // Used by default in `ffbt build` command
        },
        customProduction: {
            // Custom env extended from the production. You can have as many custom envs as you need
            // Usage example: ffbt build --env=customProduction
            // Environment extension is recursive, so you can use an object with deep nesting and everything will be OK


            // For example, you want to make a bundle for production but without source maps
            _extends: "production",
            sourceMapType: "(none)",
        }
    },
    aliases: {
        // Aliases for the modules
        // See resolve.alias in Webpack docs
    },
    noParse: [
        // Restrict parsing of the specific modules
        // Can help if you want to tune build performance
        // See module.noParse in Webpack docs
    ],
    configureWebpack: (projectConfig, paths) => {
        // Hook for customizing Webpack config
        // You have access to the selected environment and helper for path calculation
        // Just return the part of Webpack config and it will be merged with the main config automatically
        // Use it if you want to slightly extend functionality

        // In this example, we add OfflinePlugin to add offline functionality to your app
        return {
            plugins: [
                new OfflinePlugin(),
            ]
        }
    },
};

```

### Environment flags
Name | Description
--- | --- 
browserlist |  Currently used only in CSS Aftoprefixer. [Syntax Docs](https://github.com/browserslist/browserslist#full-list)
outputPath | Destination path, your bundle will be created here
sourceMapType | Source map type. [Docs](https://webpack.js.org/configuration/devtool/#devtool)
staticFilesSizeThresholdKb | All assets with a size lower than the limit will be inlined, otherwise, they will be copied to the destination folder as is
showBuildNotifications | Enable/Disable build and type checker system notifications
enableTypeChecking | Enable/Disable typechecking for Typescript
cleanDistFolderBeforeBuild | The name speaks for itself
devServerConfig | Settings for the WebpackDevServer. [Docs](https://webpack.js.org/configuration/dev-server/)
buildVersion | A string represents the version of the bundle. Accessible in your code via `FFBT_BUILD_VERSION` constant

There are more flags in the system than described above. If you want to use flags that not described in the table - keep in mind that it can break the build process. Use them at your own risk

### Environment defaults
[See here](https://github.com/fluix/ffbt/blob/master/src/project-config/default.ts)
