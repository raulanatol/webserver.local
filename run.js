#!/usr/bin/env node
const basePath = process.cwd();
const express = require('express');
const path = require('path');
const app = express();
const chalk = require('chalk');
const morgan = require('morgan');

const port = process.env.PORT || 3000;

app.use(express.static(basePath));
morgan('tiny');

app.get('/*', function (req, res) {
    res.sendFile(path.join(basePath, 'index.html'));
});

console.log(chalk.blue('Starting up http server, serving'), chalk.yellow(basePath));
app.listen(port, () => {
    console.log(' ');
    console.log('⚡️', chalk.green.bold(`http://127.0.0.1:${port}`));
});

