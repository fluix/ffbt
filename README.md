# FFBT: Fluix Frontend Build Tools [![Build Status](https://travis-ci.org/fluix/ffbt.svg?branch=master)](https://travis-ci.org/fluix/ffbt)

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

## How about unit tests?
We don't include a testing framework because it's depends on your needs. 
We suggest to start from [Jest](https://jestjs.io/) because it's fast and reliable solution.

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

## Configuration
Create a file with name `ffbt-config.js` in the root of your project
Minimal config is `module.exports = {};`. It's enough for most cases

### Full annotated config example:
```javascript
module.exports = {
    // FFBT is environment-centric, almost all configuration describes in environments
    // You can extend environments from each other
    // All environments extend from "default" automatically unless you specify "_extends" property.
    // See example below
    environments: {
        default: {
            // Contains default values for the all flags in the system
            // See list of all flags in the table below

            // Use it if you want to propagate values to the all environments
        },
        development: {
            // Used by default in `ffbt dev`
        },
        production: {
            // Used by default in `ffbt build`
        },
        customProduction: {
            // Custom env extended from the production. You can have as many custom envs as you need
            // Usage example: ffbt build --env=customProduction
            // Environment extension is recursive, so you can use object with deep nesting and everything will be OK


            // For example, you want to make bundle for production but without source maps
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
        // Hook for customizing webpack config
        // You have access to the selected environment and helper for path calculation
        // Just return the part of webpack config and it will be merged with the main config automatically
        // Use it if you want to slightly extend functionality

        // In this example we add OfflinePlugin to add a Offline functionality to your app
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
browserlist |  Currently used only in CSS aftoprefixer. [Syntax Docs](https://github.com/browserslist/browserslist#full-list)
outputPath | Destintation path, your bundle will be created here
sourceMapType | Source map type. [Docs](https://webpack.js.org/configuration/devtool/#devtool)
staticFilesSizeThresholdKb | All assets with size lower than limit will be inlined, oterwise they will be copiled to the destination folder as is
showBuildNotifications | Enable/Disable build and type checker system notification
enableTypeChecking | Enable/Disable typechecking for Typescript
cleanDistFolderBeforeBuild | The name speaks for itself
moveLibrariesToSeparateBundle | If true - move all used libs from node_modules to the separate bundle
devServerConfig | Settings for the WebpackDevServer. [Docs](https://webpack.js.org/configuration/dev-server/)
buildVersion | Some string represents the version of the bundle. Accessible in your code via `FFBT_BUILD_VERSION` constant

There are more flags in the system than described above. If you went to use flags that not described in the table - keep in mind that it can break the build process. Use them at your own risk


