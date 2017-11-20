/*
npm run build && \
node bin/avdo --multipass -s \
'
<?xml version="1.0" encoding="utf-8"?>
<vector
  xmlns:android="http://schemas.android.com/apk/res/android"
  android:width="24dp"
  android:height="24dp"
  android:viewportWidth="24"
  android:viewportHeight="24">
  <!-- Useless container group -->
  <group>
    <group>
      <!-- Path #1 -->
      <path android:pathData="M 0 0 L 10 10 L 20 20"/>
      <!-- Path #2 -->
      <path android:pathData="M 100 100 L 200 200 L 300 300"/>
      <group android:rotation="90">
        <!-- Useless empty group. -->
        <group></group>
        <path android:pathData="M 1000 1000 L 2000 2000 L 3000 3000"></path>
      </group>
    </group>
  </group>
</vector>'
*/

// TODO: figure out 'android:pathData' vs. 'pathData' stuff
// TODO: create plugin that removes useless clip-paths?
// TODO: a 'useless clip-paths' plugin would have to run before the 'empty groups' plugin

import * as PROGRAM from 'commander';

import { Avdo, Options } from './avdo';

import { js2xml } from './js2xml';
import { xml2js } from './xml2js';

import FS = require('fs');
import PATH = require('path');
import util = require('util');

const PKG = require('../package.json');
const { promisify } = util;
const readFile = promisify(FS.readFile);
const writeFile = promisify(FS.writeFile);

export function execute() {
  PROGRAM.version(PKG.version)
    .arguments('[files...]')
    .option('-s, --string <string>', 'input VD or AVD string')
    .option('--multipass', 'enable multipass')
    .option('--pretty', 'pretty print the result')
    .parse(process.argv);

  const options: Partial<Options> = {};
  if (PROGRAM.multipass) {
    options.multipass = true;
  }
  if (PROGRAM.pretty) {
    options.pretty = true;
  }

  if (PROGRAM.string) {
    // TODO: run in parallel with other args below?
    // TODO: handle rejected case like SVGO
    new Avdo(options).optimize(PROGRAM.string).then(res => console.log(res));
    return;
  }

  PROGRAM.args.forEach(file => {
    // TODO: run in parallel
    // TODO: handle rejected case like SVGO
    readFile(file, 'utf8').then(
      data =>
        processSVGData(
          data,
          '-', // TODO: use output option instead
          file,
          undefined, // TODO: use options arg instead,
        ),
      // error => checkOptimizeFileError(config, file, output, error),
    );
  });
  // console.log(PROGRAM.args);
}

/**
 * Optimize SVG data.
 * @param {string} data SVG content to optimize
 * @param {string} output where to write optimized file
 * @param {string} [input] input file name (being used if output is a directory)
 * @param {Object} [options] options
 * @return {Promise}
 */
function processSVGData(
  data: string,
  output: string,
  input: string,
  options?: { quiet: boolean },
) {
  const startTime = Date.now();
  const prevFileSize = Buffer.byteLength(data, 'utf8');
  return new Avdo().optimize(data).then(result => {
    const resultFileSize = Buffer.byteLength(result, 'utf8');
    const processingTime = Date.now() - startTime;
    return writeOutput(input, output, result).then(
      () => {
        if (options && !options.quiet && output !== '-') {
          if (input) {
            console.log(`\n${PATH.basename(input)}:`);
          }
          printTimeInfo(processingTime);
          printProfitInfo(prevFileSize, resultFileSize);
        }
      },
      error =>
        Promise.reject(
          new Error(
            error.code === 'ENOTDIR'
              ? `Error: output '${output}' is not a directory.`
              : error,
          ),
        ),
    );
  });
}

/**
 * Write a time taken by optimization.
 * @param {number} time time in milliseconds.
 */
function printTimeInfo(time: number) {
  console.log(`Done in ${time} ms!`);
}

/**
 * Write optimizing information in human readable format.
 * @param {number} inBytes size before optimization.
 * @param {number} outBytes size after optimization.
 */
function printProfitInfo(inBytes: number, outBytes: number) {
  // var profitPercents = 100 - outBytes * 100 / inBytes;

  // console.log(
  //   Math.round(inBytes / 1024 * 1000) / 1000 +
  //     ' KiB' +
  //     (profitPercents < 0 ? ' + ' : ' - ') +
  //     String(Math.abs(Math.round(profitPercents * 10) / 10) + '%').green +
  //     ' = ' +
  //     Math.round(outBytes / 1024 * 1000) / 1000 +
  //     ' KiB',
  // );
  console.log(inBytes, outBytes);
}

/**
 * Write result of an optimization.
 * @param {string} input
 * @param {string} output output file name. '-' for stdout
 * @param {string} data data to write
 * @return {Promise}
 */
function writeOutput(input: string, output: string, data: string) {
  if (output === '-') {
    console.log(data);
    return Promise.resolve();
  }
  return writeFile(output, data, 'utf8').catch(error =>
    checkWriteFileError(input, output, data, error),
  );
}

/**
 * Check for saving file error. If the output is a dir, then write file there.
 * @param {string} input
 * @param {string} output
 * @param {string} data
 * @param {Error} error
 * @return {Promise}
 */
function checkWriteFileError(
  input: string,
  output: string,
  data: string,
  error: any,
) {
  if (error.code === 'EISDIR' && input) {
    return writeFile(PATH.resolve(output, PATH.basename(input)), data, 'utf8');
  } else {
    return Promise.reject(error);
  }
}
