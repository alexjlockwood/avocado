// const SVGO = require(process.env.COVERAGE
//   ? '../../lib-cov/svgo'
//   : '../../lib/svgo');
import { Avdo, plugins } from '../../src/avdo';
import { describe, it } from 'mocha';

import { Plugin } from '../../src/plugins/_types';
import { expect } from 'chai';

// describe('Calculator', () => {
//   describe('Add', () => {
//     it('Should return 3 when a = 1 and b = 2', () => {
//       expect(5).to.equal(5);
//     });
//   });
// });

const FS = require('fs');
const PATH = require('path');
const EOL = require('os').EOL;
const regEOL = new RegExp(EOL, 'g');
const regFilename = /^(.*)\.(\d+)\.xml$/;

describe('plugin tests', function() {
  FS.readdirSync(__dirname).forEach(function(file) {
    const match = file.match(regFilename);
    let index: number;
    let name: string;

    if (match) {
      name = match[1];
      index = match[2];

      file = PATH.resolve(__dirname, file);

      it(name + '.' + index, function() {
        return readFile(file).then(function(data) {
          const splitted = normalize(data).split(/\s*@@@\s*/);
          const orig = splitted[0];
          const should = splitted[1];
          const params = splitted[2];
          let avdo: Avdo;

          const plugin = plugins[name];
          if (params) {
            plugin.params = JSON.parse(params);
          }
          avdo = new Avdo({
            plugins: [[plugin]],
            pretty: true,
          });

          return avdo.optimize(orig).then(function(result) {
            // FIXME: results.data has a '\n' at the end while it should not
            expect(normalize(result)).to.equal(should);
          });
        });
      });
    }
  });
});

function normalize(file) {
  return file.trim().replace(regEOL, '\n');
}

function readFile(file) {
  return new Promise(function(resolve, reject) {
    FS.readFile(file, 'utf8', function(err, data) {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
}
