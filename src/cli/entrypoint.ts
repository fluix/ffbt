#!/usr/bin/env node

// This is the OClif entrypoint
// Entrypoints for developers located in "commands" directory
// If you're trying to figure out what's going on - go there and look for the command you interesting in

require('@oclif/command').run()
    .then(require('@oclif/command/flush'))
    .catch(require('@oclif/errors/handle'));
