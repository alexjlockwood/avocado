# avdo

[![Build status][travis-badge]][travis-badge-url]
[![npm version][npm-badge]][npm-badge-url]
[![Coverage status][coveralls-badge]][coveralls-badge-url]

---

**Important note**:

This tool is currently in **alpha** and is not yet ready to be used in production.

Note that there may be breaking changes in the future as well.

---

`avdo` is a command line tool (similar to [`svgo`][svgo]) that optimizes Android
`VectorDrawable` (VD) and `AnimatedVectorDrawable` (AVD) xml files.

## Installation

You can install `avdo` using [npm][npm] w/ the following command:

```sh
npm install -g avdo
```

## Usage

```text
  Usage: avdo [options] [file]

  Options:

    -V, --version          output the version number
    -s, --string <string>  input VD or AVD string
    -i, --input <file>     input file/directory, or "-" for STDIN
    -o, --output <file>    output file/directory (same as the input file by default), or "-" for STDOUT
    -d, --dir <dir>        optimizes and rewrite all *.xml files in a directory
    -q, --quiet            only output error messages
    -h, --help             output usage information
```

### Examples

with files:

```sh
# Optimize (and overwrite) a VD/AVD file.
avdo vector.xml

# Optimize (and overwrite) multiple VD/AVD files.
avdo *.xml

# Optimize a VD/AVD file and write the output to a new file.
avdo vector.xml -o vector.min.xml

# Optimize a VD/AVD using standard input and standard output.
cat vector.xml | avdo -i - -o - > vector.min.xml

# Optimize (and overwrite) all of the VD/AVD files in a directory.
avdo -d path/to/directory

# Optimize all VD/AVD files in a directory and write them to a new directory.
avdo -d path/to/input/directory -o path/to/output/directory

# Optimize all files ending with '.xml' and write them to a new directory.
avdo *.xml -o path/to/output/directory

# Pass a string as input and write the output to a new file.
avdo -s '<vector>...</vector>' -o vector.min.xml
```

## Build instructions

If you want to contribute, first be sure to install the latest version of
[`Node.js`](https://nodejs.org/) and [`npm`](https://www.npmjs.com/).
I recommend using [vscode][vscode] as your IDE, as it has great,
out-of-the-box support for TypeScript.

Then clone this repository and in the root directory, run:

```sh
npm install
```

To build the tool, run:

```sh
npm run build
```

To test the tool, run:

```sh
npm run test
```

  [travis-badge]: https://travis-ci.org/alexjlockwood/avdo.svg?branch=master
  [travis-badge-url]: https://travis-ci.org/alexjlockwood/avdo
  [coveralls-badge]: https://coveralls.io/repos/github/alexjlockwood/avdo/badge.svg?branch=master
  [coveralls-badge-url]: https://coveralls.io/github/alexjlockwood/avdo?branch=master
  [npm-badge]: https://badge.fury.io/js/avdo.svg
  [npm-badge-url]: https://www.npmjs.com/package/avdo
  [svgo]: https://github.com/svg/svgo
  [vscode]: https://code.visualstudio.com/
