#!/usr/bin/env node
const basePath = process.cwd();
const express = require('express');
const path = require('path');
const app = express();
const chalk = require('chalk');
const morgan = require('morgan');
const pkg = require('./package');
const updateNotifier = require('update-notifier');
const yargs = require('yargs');

updateNotifier({ pkg }).notify({ isGlobal: true });

const argv = yargs
  .option('directory', {
    alias: 'd',
    description: 'Base folder',
    type: 'string',
    default: basePath
  })
  .option('port', {
    alias: 'p',
    description: 'Port',
    type: 'number',
    default: 3000
  })
  .help().alias('help', 'h').argv;

app.use(express.static(argv.directory));
morgan('tiny');

app.get('/*', function(req, res) {
  res.sendFile(path.join(argv.directory, 'index.html'));
});

console.log(chalk.blue('Starting up http server, serving'), chalk.yellow(argv.directory));
app.listen(argv.port, () => {
  console.log(' ');
  console.log('⚡️', chalk.green.bold(`http://127.0.0.1:${argv.port}`));
});

