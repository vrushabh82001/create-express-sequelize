#!/usr/bin/env node

const { Command } = require('commander');
const init = require('../src/commands/init');

const program = new Command();

program
    .name('create-my-backend')
    .description('CLI tool to create and set up a backend project')
    .version('1.0.0');

program
    .command('init')
    .description('Initialize a new project with template selection')
    .action(init);

program.parse(process.argv);
