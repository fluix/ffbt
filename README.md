# FFBT: Fluix Frontend Build Tools
CLI utility for compiling, testing and linting your TypeScript code.

`npm i ffbt`

### What's inside?
- Webpack (With preconfigured cache busting for production builds)
- Webpack Dev Server
- Typescript
- Node-Sass with import-once plugin
- Autoprefixer
- Karma + Jasmine (With Console and TeamCity reporters)
- Tslint + Stylelint with ready to use configs (linters dir)
- WebWorkers support (experimental, will be stable in 1.0)

## What I need to do to build my project?
- `npm i ffbt`
- Create an entrypoint for your app. Call it `app.ts`.
- Create a `ffbt-config.js` file near the `package.json`.
- `ffbt dev`

### ffbt-config.js example
```javascript
module.exports = {
    profiles: {
        dev: {
            // custom variables for index.html in DEV profile
        },
        production: {
            // custom variables for index.html in PRODUCTION profile
        },
    },
    supportedBrowsers: "last 2 versions", // strictly supports Autoprefixer's config format
    vendorContents: [
        // list of packages in your vendor bundle
    ],
    aliases: {
        // aliases, if you need them
    },
    noParse: [
        // list of absolute paths
    ],
    buildPath: "./public/build", // path to your dist directory
    indexFilePath: "./public/index.html" // path to result html file (includes file name)

    //You can specify the path to your custom lint config if the default config doesn't fit your needs
    tsLintConfigPath: "",
    styleLintConfigPath: "",
    devServer: {
        // Here you can override DevServer's settings.
        // FFBT proxies this object directly to the Webpack config
        // More info: https://webpack.js.org/configuration/dev-server
    }
};
```

## Available commands
- `dev`. Watches your files and recompile them after each change
- `dev-server`. The same as `dev`, but starts the local development server.
- `build`. Builds the project for production and staging servers
- `test`. Run unit tests
- `lint-style`. Lints SASS files
- `lint-ts`. Lints TS files

##### Each command has the following options:
- `ci`. Enabling CI mode, now it useful only in pair with the test command. It changes the Karma output by running the Teamcity reporter
- `output`. You can override buildPath config property via this option
- `analyze`. Runs webpack-bundle-analyzer plugin that displays a map of your dependencies

## Info for developers

#### I Want to make an improvement/fix, but I don't understand how it works. What I have to do?
Firstly, you need to open the `cli/cli.js` file. It's the main entrypoint for all commands.

Each CLI command executes the corresponding command file.

There are two types of command: `build` and `lint`. The commands are just the JS functions.
- The `build` commands (dev, dev-server, build, test) need the webpack to work, so they received the build config as a first parameter
- The `lint` commands doesn't need the build config, so they received a `library root path` and a `working directory path` as a parameters

The command functions return nothing. You can do anything inside them. They are just containers for commands code

Command files are stored in `cli/commands` directory.
The lint commands are stored deeply in `cli/commands/lint` directory.
