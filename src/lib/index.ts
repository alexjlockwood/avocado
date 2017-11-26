// TODO: figure out 'android:pathData' vs. 'pathData' stuff
// TODO: create plugin that removes useless clip-paths?
// TODO: a 'useless clip-paths' plugin would have to run before the 'empty groups' plugin
// TODO: filter out xml files that don't contain a <vector> or <animated-vector> file?

import * as cli from 'commander';

import { Avdo, Options } from './avdo';

import { js2xml } from './js2xml';

import fs = require('fs');
import path = require('path');
import util = require('util');

const readFileFn = util.promisify(fs.readFile);
const readDirFn = util.promisify(fs.readdir);
const writeFileFn = util.promisify(fs.writeFile);

let avdo: Avdo;

/**
 * Runs the avdo command line tool.
 */
export async function run() {
  const pkgJson: {
    name: string;
    version: string;
    engines: { node: string };
  } = JSON.parse(
    fs.readFileSync(
      path.resolve(__dirname, '..', '..') + '/package.json',
      'utf8',
    ),
  );

  cli
    .version(pkgJson.version)
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
      'optimize and rewrite all *.xml files in a directory',
    )
    .option('-q, --quiet', 'only output error messages')
    // TODO: add precision option
    // .option(
    //   '-p, --precision <number>',
    //   'number of significant digits to use for decimals',
    // )
    .parse(process.argv);

  const input: string[] = cli.input ? [cli.input] : cli.args;
  let output: string[] = cli.output ? [cli.output] : undefined;

  if (
    (!input.length || input[0] === '-') &&
    !cli.string &&
    !cli.dir &&
    process.stdin.isTTY === true
  ) {
    cli.help();
    return;
  }

  if (
    typeof process === 'object' &&
    process.versions &&
    process.versions.node &&
    pkgJson.engines.node
  ) {
    const nodeVersion = String(pkgJson.engines.node).match(/\d*(\.\d+)*/)[0];
    if (parseFloat(process.versions.node) < parseFloat(nodeVersion)) {
      await printErrorAndExit(
        `${pkgJson.name} requires Node.js version ${nodeVersion} or higher.`,
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
            : path.resolve(dir, path.basename(input[i]));
        }
      } else if (output.length < input.length) {
        output = output.concat(input.slice(output.length));
      }
    }
  } else if (input) {
    output = input;
  } else if (cli.string) {
    output = ['-'];
  }

  // if (opts.datauri) {
  //   config.datauri = opts.datauri;
  // }

  if (cli.dir) {
    const outputDir: string = (output && output[0]) || cli.dir;
    await optimizeDirectory({ quiet: cli.quiet }, cli.dir, outputDir).then(
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
        process.stdin.on('data', chunk => (data += chunk)).once('end', () => {
          processData({ quiet: cli.quiet }, data, file).then(resolve, reject);
        });
      });
    } else {
      await Promise.all(
        input.map((file, n) =>
          optimizeFile({ quiet: cli.quiet }, file, output[n]),
        ),
      ).then(() => {}, printErrorAndExit);
    }
    return;
  }

  if (cli.string) {
    // TODO: support decoding data uris or no?
    // const data = decodeSVGDatauri(opts.string);
    const data = cli.string;
    await processData({ quiet: cli.quiet }, data, output[0]);
    return;
  }
}

// TODO: fix implicit any error
function optimizeDirectory(
  config: { quiet: boolean },
  dir: string,
  output: string,
): any {
  if (!config.quiet) {
    console.log(`Processing directory '${dir}':\n`);
  }
  return readDirFn(dir).then(files => {
    // Take only *.xml files.
    const svgFiles = files.filter(name => /\.xml$/.test(name));
    return svgFiles.length
      ? Promise.all(
          svgFiles.map(name =>
            optimizeFile(
              config,
              path.resolve(dir, name),
              path.resolve(output, name),
            ),
          ),
        )
      : Promise.reject(
          new Error(`No XML files were found in directory: '${dir}'`),
        );
  });
}

// TODO: fix implicit any error
function optimizeFile(
  config: { quiet: boolean },
  file: string,
  output: string,
) {
  return readFileFn(file, 'utf8').then(
    data => processData(config, data, output, file),
    error => {
      if (error.code === 'EISDIR') {
        return optimizeDirectory(config, file, output);
      }
      return checkOptimizeFileError(config, file, output, error);
    },
  );
}

function processData(
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
            console.log(`\n${path.basename(input)}:`);
          }
          printTimeInfo(processingTime);
          printProfitInfo(prevFileSize, resultFileSize);
        }
      },
      error =>
        Promise.reject(
          new Error(
            error.code === 'ENOTDIR'
              ? `Output '${output}' is not a directory.`
              : error,
          ),
        ),
    );
  });
}

function writeOutput(input: string, output: string, data: string) {
  if (output === '-') {
    console.log(data);
    return Promise.resolve();
  }
  return writeFileFn(output, data, 'utf8').catch(error =>
    checkWriteFileError(input, output, data, error),
  );
}

function printTimeInfo(time: number) {
  console.log(`Done in ${time} ms!`);
}

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

function checkOptimizeFileError(
  config: { quiet: boolean },
  input: string,
  output: string,
  error: { code: string; path: string },
) {
  if (error.code === 'ENOENT') {
    return Promise.reject(
      new Error(`No such file or directory '${error.path}'.`),
    );
  }
  return Promise.reject(error);
}

function checkWriteFileError(
  input: string,
  output: string,
  data: string,
  error: { code: string },
) {
  if (error.code === 'EISDIR' && input) {
    return writeFileFn(
      path.resolve(output, path.basename(input)),
      data,
      'utf8',
    );
  } else {
    return Promise.reject(error);
  }
}

/**
 * Synchronously check if path is a directory. Tolerant to errors like ENOENT.
 */
function checkIsDir(filePath: string) {
  try {
    return fs.lstatSync(filePath).isDirectory();
  } catch (e) {
    return false;
  }
}

function printErrorAndExit(error: any) {
  console.error(error);
  process.exit(1);
  return Promise.reject(error); // for tests
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
