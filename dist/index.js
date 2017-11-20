"use strict";
// Example: npm run build && node bin/avdo -s '<vector><!-- asdf --></vector>'
Object.defineProperty(exports, "__esModule", { value: true });
var FS = require("fs");
var PATH = require("path");
var PKG = require('../package.json');
var PROGRAM = require("commander");
var util = require("util");
var promisify = util.promisify;
var readFile = promisify(FS.readFile);
var avdo_1 = require("./avdo");
var writeFile = promisify(FS.writeFile);
function execute() {
    PROGRAM.version(PKG.version)
        .arguments('[files...]')
        .option('-s, --string <string>', 'input VD or AVD string')
        .parse(process.argv);
    if (PROGRAM.string) {
        // const parser = new DOMParser();
        // const doc = parser.parseFromString(PROGRAM.string, 'application/xml');
        // xml2js(
        //   PROGRAM.string,
        //   jsApi => {
        //     // console.log(jsApi.content);
        //     // console.log('=====');
        //     console.log(js2xml(jsApi));
        //   },
        //   // TODO: handle error case
        //   error => {},
        // );
        // TODO: run in parallel with other args below?
        // TODO: handle rejected case like SVGO
        new avdo_1.Avdo().optimize(PROGRAM.string).then(function (res) { return console.log(res); });
        return;
    }
    PROGRAM.args.forEach(function (file) {
        // TODO: run in parallel
        // TODO: handle rejected case like SVGO
        readFile(file, 'utf8').then(function (data) {
            return processSVGData(data, '-', // TODO: use output option instead
            file, undefined);
        });
    });
    // console.log(PROGRAM.args);
}
exports.execute = execute;
/**
 * Optimize SVG data.
 * @param {string} data SVG content to optimize
 * @param {string} output where to write optimized file
 * @param {string} [input] input file name (being used if output is a directory)
 * @param {Object} [options] options
 * @return {Promise}
 */
function processSVGData(data, output, input, options) {
    var startTime = Date.now();
    var prevFileSize = Buffer.byteLength(data, 'utf8');
    return new avdo_1.Avdo().optimize(data).then(function (result) {
        var resultFileSize = Buffer.byteLength(result, 'utf8');
        var processingTime = Date.now() - startTime;
        return writeOutput(input, output, result).then(function () {
            if (options && !options.quiet && output !== '-') {
                if (input) {
                    console.log("\n" + PATH.basename(input) + ":");
                }
                printTimeInfo(processingTime);
                printProfitInfo(prevFileSize, resultFileSize);
            }
        }, function (error) {
            return Promise.reject(new Error(error.code === 'ENOTDIR'
                ? "Error: output '" + output + "' is not a directory."
                : error));
        });
    });
}
/**
 * Write a time taken by optimization.
 * @param {number} time time in milliseconds.
 */
function printTimeInfo(time) {
    console.log("Done in " + time + " ms!");
}
/**
 * Write optimizing information in human readable format.
 * @param {number} inBytes size before optimization.
 * @param {number} outBytes size after optimization.
 */
function printProfitInfo(inBytes, outBytes) {
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
function writeOutput(input, output, data) {
    if (output === '-') {
        console.log(data);
        return Promise.resolve();
    }
    return writeFile(output, data, 'utf8').catch(function (error) {
        return checkWriteFileError(input, output, data, error);
    });
}
/**
 * Check for saving file error. If the output is a dir, then write file there.
 * @param {string} input
 * @param {string} output
 * @param {string} data
 * @param {Error} error
 * @return {Promise}
 */
function checkWriteFileError(input, output, data, error) {
    if (error.code === 'EISDIR' && input) {
        return writeFile(PATH.resolve(output, PATH.basename(input)), data, 'utf8');
    }
    else {
        return Promise.reject(error);
    }
}
