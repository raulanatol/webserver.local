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
    default: '.'
  })
  .option('port', {
    alias: 'p',
    description: 'Port',
    type: 'number',
    default: 3000
  })
  .options('trace', {
    alias: 't',
    description: 'Trace mode',
    type: 'boolean',
    default: false
  })
  .help().alias('help', 'h').argv;

const folder = argv.directory.startsWith('/') ? path.resolve(argv.directory) : path.join(basePath, argv.directory);

function generateMorganFormatter() {
  if (argv.trace) {
    return morgan(function(tokens, req, res) {
      const headers = JSON.stringify(req.headers, null, 2);
      const result = [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        `headers: ${headers}`
      ];
      return result.join(' ');
    });
  }
  return morgan('tiny');
}

app.use(generateMorganFormatter());
app.use(express.static(folder));

app.get('/*', function(req, res) {
  res.sendFile(path.join(folder, 'index.html'));
});

console.log(chalk.blue('Starting up http server, serving'), chalk.yellow(folder));
app.listen(argv.port, () => {
  console.log(' ');
  console.log('⚡️', chalk.green.bold(`http://127.0.0.1:${argv.port}`));
});

