# avdo

[![Build status][travis-badge]][travis-badge-url]
[![Coverage status][coveralls-badge]][coveralls-badge-url]
[![npm version][npm-badge]][npm-badge-url]

---

**Important note**: This tool is currently in **alpha** and is not yet ready
to be used in production. Note that there may be breaking changes in the future as well.

---

`avdo` is a command line tool (similar to [`svgo`][svgo]) that optimizes Android
`VectorDrawable` (VD) and `AnimatedVectorDrawable` (AVD) xml files.

## Installation

You can install `avdo` using [npm][npm] using the following command:

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
