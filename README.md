# avdo

[![Build status][travis-badge]][travis-badge-url]
[![npm version][npm-badge]][npm-badge-url]
[![Coverage status][coveralls-badge]][coveralls-badge-url]

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

`avdo` rewrites the `VectorDrawable` using the smallest number of `<group>`s and `<path>`s possible, reducing their file sizes and making them faster to parse and draw at runtime. The example below shows the contents of a `VectorDrawable` before and after being run through `avdo`.

Before:

```xml
<vector xmlns:android="http://schemas.android.com/apk/res/android" android:width="108dp" android:height="108dp" android:viewportHeight="108" android:viewportWidth="108">
  <path android:fillColor="#26A69A" android:pathData="M0,0h108v108h-108z" />
  <group android:pivotX="54" android:pivotY="54" android:scaleX="1.5" android:scaleY="1.5">
    <path android:fillColor="#00000000" android:pathData="M9,0L9,108" android:strokeColor="#33FFFFFF" android:strokeWidth="0.8" />
    <path android:fillColor="#00000000" android:pathData="M19,0L19,108" android:strokeColor="#33FFFFFF" android:strokeWidth="0.8" />
    <path android:fillColor="#00000000" android:pathData="M29,0L29,108" android:strokeColor="#33FFFFFF" android:strokeWidth="0.8" />
    <path android:fillColor="#00000000" android:pathData="M39,0L39,108" android:strokeColor="#33FFFFFF" android:strokeWidth="0.8" />
    <path android:fillColor="#00000000" android:pathData="M49,0L49,108" android:strokeColor="#33FFFFFF" android:strokeWidth="0.8" />
    <path android:fillColor="#00000000" android:pathData="M59,0L59,108" android:strokeColor="#33FFFFFF" android:strokeWidth="0.8" />
  </group>
  <path android:fillColor="#00000000" android:pathData="M69,0L69,108" android:strokeColor="#33FFFFFF" android:strokeWidth="0.8" />
  <path android:fillColor="#00000000" android:pathData="M79,0L79,108" android:strokeColor="#33FFFFFF" android:strokeWidth="0.8" />
  <path android:fillColor="#00000000" android:pathData="M89,0L89,108" android:strokeColor="#33FFFFFF" android:strokeWidth="0.8" />
  <path android:fillColor="#00000000" android:pathData="M99,0L99,108" android:strokeColor="#33FFFFFF" android:strokeWidth="0.8" />
  <group android:translateX="54" android:translateY="54">
    <group android:pivotX="54" android:pivotY="54" android:rotation="180">
      <path android:fillColor="#00000000" android:pathData="M0,9L108,9" android:strokeColor="#33FFFFFF" android:strokeWidth="0.8" />
      <path android:fillColor="#00000000" android:pathData="M0,19L108,19" android:strokeColor="#33FFFFFF" android:strokeWidth="0.8" />
      <path android:fillColor="#00000000" android:pathData="M0,29L108,29" android:strokeColor="#33FFFFFF" android:strokeWidth="0.8" />
      <path android:fillColor="#00000000" android:pathData="M0,39L108,39" android:strokeColor="#33FFFFFF" android:strokeWidth="0.8" />
      <path android:fillColor="#00000000" android:pathData="M0,49L108,49" android:strokeColor="#33FFFFFF" android:strokeWidth="0.8" />
      <path android:fillColor="#00000000" android:pathData="M0,59L108,59" android:strokeColor="#33FFFFFF" android:strokeWidth="0.8" />
    </group>
    <path android:fillColor="#00000000" android:pathData="M0,69L108,69" android:strokeColor="#33FFFFFF" android:strokeWidth="0.8" />
    <path android:fillColor="#00000000" android:pathData="M0,79L108,79" android:strokeColor="#33FFFFFF" android:strokeWidth="0.8" />
    <path android:fillColor="#00000000" android:pathData="M0,89L108,89" android:strokeColor="#33FFFFFF" android:strokeWidth="0.8" />
    <path android:fillColor="#00000000" android:pathData="M0,99L108,99" android:strokeColor="#33FFFFFF" android:strokeWidth="0.8" />
    <path android:fillColor="#00000000" android:pathData="M19,29L89,29" android:strokeColor="#33FFFFFF" android:strokeWidth="0.8" />
    <path android:fillColor="#00000000" android:pathData="M19,39L89,39" android:strokeColor="#33FFFFFF" android:strokeWidth="0.8" />
    <path android:fillColor="#00000000" android:pathData="M19,49L89,49" android:strokeColor="#33FFFFFF" android:strokeWidth="0.8" />
    <path android:fillColor="#00000000" android:pathData="M19,59L89,59" android:strokeColor="#33FFFFFF" android:strokeWidth="0.8" />
    <path android:fillColor="#00000000" android:pathData="M19,69L89,69" android:strokeColor="#33FFFFFF" android:strokeWidth="0.8" />
    <path android:fillColor="#00000000" android:pathData="M19,79L89,79" android:strokeColor="#33FFFFFF" android:strokeWidth="0.8" />
    <path android:fillColor="#00000000" android:pathData="M29,19L29,89" android:strokeColor="#33FFFFFF" android:strokeWidth="0.8" />
    <path android:fillColor="#00000000" android:pathData="M39,19L39,89" android:strokeColor="#33FFFFFF" android:strokeWidth="0.8" />
    <path android:fillColor="#00000000" android:pathData="M49,19L49,89" android:strokeColor="#33FFFFFF" android:strokeWidth="0.8" />
    <path android:fillColor="#00000000" android:pathData="M59,19L59,89" android:strokeColor="#33FFFFFF" android:strokeWidth="0.8" />
    <path android:fillColor="#00000000" android:pathData="M69,19L69,89" android:strokeColor="#33FFFFFF" android:strokeWidth="0.8" />
    <path android:fillColor="#00000000" android:pathData="M79,19L79,89" android:strokeColor="#33FFFFFF" android:strokeWidth="0.8" />
  </group>
</vector>
```

After:

```xml
<vector xmlns:android="http://schemas.android.com/apk/res/android" android:width="108dp" android:height="108dp" android:viewportHeight="108" android:viewportWidth="108">
  <path android:fillColor="#26A69A" android:pathData="M0 0h108v108H0z" />
  <path android:fillColor="#00000000" android:pathData="M-13.5-27v162m15-162v162m15-162v162m15-162v162m15-162v162m15-162v162M69 0v108M79 0v108M89 0v108M99 0v108m63 63h108m-108 10h108m-108 10h108m-108 10h108m-108 10h108m-108 10h108M54 123h108M54 133h108M54 143h108M54 153h108M73 83h70M73 93h70m-70 10h70m-70 10h70m-70 10h70m-70 10h70M83 73v70m10-70v70m10-70v70m10-70v70m10-70v70m10-70v70" android:strokeColor="#33FFFFFF" android:strokeWidth="0.8" />
</vector>
```

## Build instructions

If you want to contribute, first be sure to install the latest version of
[`Node.js`](https://nodejs.org/) and [`npm`](https://www.npmjs.com/).
If you're not sure what IDE to use, I highly recommend checking out
[vscode][vscode].

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
  [npm]: https://www.npmjs.com/get-npm
