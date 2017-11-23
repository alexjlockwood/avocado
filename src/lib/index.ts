// TODO: figure out 'android:pathData' vs. 'pathData' stuff
// TODO: create plugin that removes useless clip-paths?
// TODO: a 'useless clip-paths' plugin would have to run before the 'empty groups' plugin
// TODO: filter out xml files that don't contain a <vector> or <animated-vector> file?

import * as PROGRAM from 'commander';

import { Avdo, Options } from './avdo';

import { js2xml } from './js2xml';

import FS = require('fs');
import PATH = require('path');
import util = require('util');

const PKG = require('../../package.json');
const { promisify } = util;
const readFile = promisify(FS.readFile);
const readDir = promisify(FS.readdir);
const writeFile = promisify(FS.writeFile);
let avdo: Avdo;

export async function execute() {
  PROGRAM.version(PKG.version)
    .arguments('[file]')
    .option('-s, --string <string>', 'input VD or AVD string')
    // TODO: support multiple inputs/outputs?
    .option('-i, --input <file>', 'input file/directory, or "-" for STDIN')
    // TODO: support multiple inputs/outputs
    .option(
      '-o, --output <file>',
      'output file/directory (same as the input file by default), or "-" for STDOUT',
    )
    .option(
      '-d, --dir <dir>',
      'optimizes and rewrite all *.xml files in a directory',
    )
    .option('-q, --quiet', 'only output error messages')
    // TODO: add precision option
    // .option(
    //   '-p, --precision <number>',
    //   'number of significant digits to use for decimals',
    // )
    .parse(process.argv);

  const input: string[] = PROGRAM.input ? [PROGRAM.input] : PROGRAM.args;
  let output: string[] = PROGRAM.output;

  if (
    (!input || input[0] === '-') &&
    !PROGRAM.string &&
    !PROGRAM.dir &&
    process.stdin.isTTY === true
  ) {
    PROGRAM.help();
    return;
  }

  if (
    typeof process === 'object' &&
    process.versions &&
    process.versions.node &&
    PKG &&
    PKG.engines.node
  ) {
    const nodeVersion = String(PKG.engines.node).match(/\d*(\.\d+)*/)[0];
    if (parseFloat(process.versions.node) < parseFloat(nodeVersion)) {
      await printErrorAndExit(
        `Error: ${PKG.name} requires Node.js version ${nodeVersion} or higher.`,
      );
      return;
    }
  }

  avdo = new Avdo();

  if (output) {
    if (input && input[0] !== '-') {
      if (output.length === 1 && checkIsDir(output[0])) {
        const dir = output[0];
        for (let i = 0; i < input.length; i++) {
          output[i] = checkIsDir(input[i])
            ? input[i]
            : PATH.resolve(dir, PATH.basename(input[i]));
        }
      } else if (output.length < input.length) {
        output = output.concat(input.slice(output.length));
      }
    }
  } else if (input) {
    output = input;
  } else if (PROGRAM.string) {
    output = ['-'];
  }

  // if (opts.datauri) {
  //   config.datauri = opts.datauri;
  // }

  if (PROGRAM.dir) {
    const outputDir: string = (output && output[0]) || PROGRAM.dir;
    await optimizeFolder({ quiet: PROGRAM.quiet }, PROGRAM.dir, outputDir).then(
      () => {},
      printErrorAndExit,
    );
    return;
  }

  if (input) {
    if (input[0] === '-') {
      await new Promise<void>((resolve, reject) => {
        const file = output[0];
        let data = '';
        process.stdin
          .on('data', chunk => (data += chunk))
          .once('end', () =>
            processSVGData({ quiet: PROGRAM.quiet }, data, file).then(
              resolve,
              reject,
            ),
          );
      });
    } else {
      await Promise.all(
        input.map((file, n) =>
          optimizeFile({ quiet: PROGRAM.quiet }, file, output[n]),
        ),
      ).then(() => {}, printErrorAndExit);
    }
    return;
  }

  if (PROGRAM.string) {
    // TODO: support decoding data uris or no?
    // const data = decodeSVGDatauri(opts.string);
    const data = PROGRAM.string;
    await processSVGData({ quiet: PROGRAM.quiet }, data, output[0]);
    return;
  }
}

/**
 * Optimize SVG files in a directory.
 * @param {Object} config options
 * @param {string} dir input directory
 * @param {string} output output directory
 * @return {Promise}
 */
function optimizeFolder(
  config: { quiet: boolean },
  dir: string,
  output: string,
) {
  if (!config.quiet) {
    console.log(`Processing directory '${dir}':\n`);
  }
  return readDir(dir).then(files =>
    processDirectory(config, dir, files, output),
  );
}

/**
 * Process given files, take only SVG.
 * @param {Object} config options
 * @param {string} dir input directory
 * @param {Array} files list of file names in the directory
 * @param {string} output output directory
 * @return {Promise}
 */
function processDirectory(
  config: { quiet: boolean },
  dir: string,
  files: string[],
  output: string,
) {
  // Take only *.xml files.
  const svgFiles = files.filter(name => /\.xml$/.test(name));
  return svgFiles.length
    ? Promise.all(
        svgFiles.map(name =>
          optimizeFile(
            config,
            PATH.resolve(dir, name),
            PATH.resolve(output, name),
          ),
        ),
      )
    : Promise.reject(
        new Error(`No SVG files have been found in '${dir}' directory.`),
      );
}

/**
 * Read SVG file and pass to processing.
 * @param {Object} config options
 * @param {string} file
 * @param {string} output
 * @return {Promise}
 */
function optimizeFile(
  config: { quiet: boolean },
  file: string,
  output: string,
) {
  return readFile(file, 'utf8').then(
    data => processSVGData(config, data, output, file),
    error => checkOptimizeFileError(config, file, output, error),
  );
}

/**
 * Optimize SVG data.
 * @param {Object} config options
 * @param {string} data SVG content to optimize
 * @param {string} output where to write optimized file
 * @param {string} [input] input file name (being used if output is a directory)
 * @return {Promise}
 */
function processSVGData(
  config: { quiet: boolean },
  data: string,
  output: string,
  input?: string,
) {
  const startTime = Date.now();
  const prevFileSize = Buffer.byteLength(data, 'utf8');

  return avdo.optimize(data).then(result => {
    // if (config.datauri) {
    //   result.data = encodeSVGDatauri(result.data, config.datauri);
    // }
    const resultFileSize = Buffer.byteLength(result, 'utf8');
    const processingTime = Date.now() - startTime;

    return writeOutput(input, output, result).then(
      () => {
        if (!config.quiet && output !== '-') {
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
  const profitPercents = 100 - outBytes * 100 / inBytes;
  console.log(
    Math.round(inBytes / 1024 * 1000) / 1000 +
      ' Kb' +
      (profitPercents < 0 ? ' + ' : ' - ') +
      '\x1b[32m' +
      String(Math.abs(Math.round(profitPercents * 10) / 10) + '%') +
      '\x1b[0m' +
      ' = ' +
      Math.round(outBytes / 1024 * 1000) / 1000 +
      ' Kb',
  );
}

/**
 * Check for errors, if it's a dir optimize the dir.
 * @param {Object} config
 * @param {string} input
 * @param {string} output
 * @param {Error} error
 * @return {Promise}
 */
function checkOptimizeFileError(
  config: { quiet: boolean },
  input: string,
  output: string,
  error: { code: string; path: string },
) {
  if (error.code === 'EISDIR') {
    return optimizeFolder(config, input, output);
  } else if (error.code === 'ENOENT') {
    return Promise.reject(
      new Error(`Error: no such file or directory '${error.path}'.`),
    );
  }
  return Promise.reject(error);
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
  error: { code: string },
) {
  if (error.code === 'EISDIR' && input) {
    return writeFile(PATH.resolve(output, PATH.basename(input)), data, 'utf8');
  } else {
    return Promise.reject(error);
  }
}

/**
 * Synchronously check if path is a directory. Tolerant to errors like ENOENT.
 * @param {string} path
 */
function checkIsDir(path: string) {
  try {
    return FS.lstatSync(path).isDirectory();
  } catch (e) {
    return false;
  }
}

/**
 * Show list of available plugins with short description.
 */
// function showAvailablePlugins() {
//   console.log('Currently available plugins:');

//   // Flatten an array of plugins grouped per type, sort and write output
//   var list = [].concat
//     .apply([], new Avdo().config.plugins)
//     .sort((a, b) => a.name.localeCompare(b.name))
//     .map(plugin => ` [ ${plugin.name.green} ] ${plugin.description}`)
//     .join('\n');
//   console.log(list);
// }

/**
 * Write an error and exit.
 * @param {Error} error
 * @return {Promise} a promise for running tests
 */
function printErrorAndExit(error: any) {
  console.error(error);
  process.exit(1);
  return Promise.reject(error); // for tests
}

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

// /**
//  * Optimize SVG data.
//  * @param {string} data SVG content to optimize
//  * @param {string} output where to write optimized file
//  * @param {string} [input] input file name (being used if output is a directory)
//  * @param {Object} [options] options
//  * @return {Promise}
//  */
// function processXml(
//   data: string,
//   output: string,
//   input?: string,
//   options: { quiet?: boolean } = {},
// ) {
//   const startTime = Date.now();
//   const prevFileSize = Buffer.byteLength(data, 'utf8');
//   return new Avdo().optimize(data).then(result => {
//     const resultFileSize = Buffer.byteLength(result, 'utf8');
//     const processingTime = Date.now() - startTime;
//     return writeOutput(input, output, result).then(
//       () => {
//         if (options && !options.quiet && output !== '-') {
//           if (input) {
//             console.log(`\n${PATH.basename(input)}:`);
//           }
//           printTimeInfo(processingTime);
//           printProfitInfo(prevFileSize, resultFileSize);
//         }
//       },
//       error =>
//         Promise.reject(
//           new Error(
//             error.code === 'ENOTDIR'
//               ? `Error: output '${output}' is not a directory.`
//               : error,
//           ),
//         ),
//     );
//   });
// }

// function printTimeInfo(timeMillis: number) {
//   console.log(`Done in ${timeMillis} ms!`);
// }

// function printProfitInfo(inBytes: number, outBytes: number) {
//   const profitPercents = 100 - outBytes * 100 / inBytes;
//   console.log(
//     Math.round(inBytes / 1024 * 1000) / 1000 +
//       ' KiB' +
//       (profitPercents < 0 ? ' + ' : ' - ') +
//       (String(Math.abs(Math.round(profitPercents * 10) / 10) + '%') as any)
//         .green +
//       ' = ' +
//       Math.round(outBytes / 1024 * 1000) / 1000 +
//       ' KiB',
//   );
//   console.log(inBytes, outBytes);
// }

// /**
//  * Write result of an optimization.
//  * @param {string} input
//  * @param {string} output output file name. '-' for stdout
//  * @param {string} data data to write
//  * @return {Promise}
//  */
// function writeOutput(input: string, output: string, data: string) {
//   if (output === '-') {
//     console.log(data);
//     return Promise.resolve();
//   }
//   return writeFile(output, data, 'utf8').catch(error =>
//     checkWriteFileError(input, output, data, error),
//   );
// }

// /**
//  * Check for saving file error. If the output is a dir, then write file there.
//  * @param {string} input
//  * @param {string} output
//  * @param {string} data
//  * @param {Error} error
//  * @return {Promise}
//  */
// function checkWriteFileError(
//   input: string,
//   output: string,
//   data: string,
//   error: any,
// ) {
//   if (error.code === 'EISDIR' && input) {
//     return writeFile(PATH.resolve(output, PATH.basename(input)), data, 'utf8');
//   } else {
//     return Promise.reject(error);
//   }
// }
