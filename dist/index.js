"use strict";
/*
node bin/avdo -s \
'<vector
xmlns:android="http://schemas.android.com/apk/res/android"
android:width="24dp"
android:height="24dp"
android:viewportWidth="24"
android:viewportHeight="24">
<!-- Path #1 -->
<path android:pathData="M 0 0 L 10 10 L 20 20"/>
<!-- Path #2 -->
<path android:pathData="M 100 100 L 200 200 L 300 300"/>
</vector>'
*/
Object.defineProperty(exports, "__esModule", { value: true });
var PROGRAM = require("commander");
var avdo_1 = require("./avdo");
var FS = require("fs");
var PATH = require("path");
var util = require("util");
var PKG = require('../package.json');
var promisify = util.promisify;
var readFile = promisify(FS.readFile);
var writeFile = promisify(FS.writeFile);
function execute() {
    PROGRAM.version(PKG.version)
        .arguments('[files...]')
        .option('-s, --string <string>', 'input VD or AVD string')
        .option('--multipass', 'enable multipass')
        .parse(process.argv);
    var options = {};
    if (PROGRAM.multipass) {
        options.multipass = true;
    }
    if (PROGRAM.string) {
        // TODO: run in parallel with other args below?
        // TODO: handle rejected case like SVGO
        new avdo_1.Avdo(options).optimize(PROGRAM.string).then(function (res) { return console.log(res); });
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
