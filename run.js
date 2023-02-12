#!/usr/bin/env node
import chalk from 'chalk';
import express from 'express';
import morgan from 'morgan';
import updateNotifier from 'update-notifier';
import meow from 'meow';
import { join, resolve } from 'node:path';
import { readFile } from 'fs/promises';

export const getPackageInfo = async () => {
  const pkg = await readFile(new URL('./package.json', import.meta.url));
  return JSON.parse(pkg);
};

export const autoUpdate = async () => {
  const pkg = await getPackageInfo();
  updateNotifier({ pkg }).notify({ isGlobal: true });
};

const basePath = process.cwd();
const app = express();
autoUpdate().catch(console.error);

const cli = meow(`
  Usage
    $ webserver.local <input>

  Options
    --port, -p Port to open
    --directory, -d The index.html path
    --trace, -t Trace mode

  Examples
    $ webserver.local --port 8080
`, {
  importMeta: import.meta,
  autoHelp: true,
  autoVersion: true,
  flags: {
    directory: {
      type: 'string',
      alias: 'd',
      default: '.'
    },
    port: {
      type: 'number',
      alias: 'p',
      default: 3000
    },
    trace: {
      type: 'boolean',
      alias: 't',
      default: false
    }
  }
});

const { directory, port, trace } = cli.flags;
const folder = directory.startsWith('/') ? resolve(directory) : join(basePath, directory);

const generateMorganFormatter = () => {
  if (trace) {
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
};

app.use(generateMorganFormatter());
app.use(express.static(folder));

app.get('/*', function(req, res) {
  res.sendFile(join(folder, 'index.html'));
});

console.log(chalk.blue('Starting up http server, serving'), chalk.yellow(folder));
app.listen(port, () => {
  console.log(' ');
  console.log('⚡️', chalk.green.bold(`http://127.0.0.1:${port}`));
});

