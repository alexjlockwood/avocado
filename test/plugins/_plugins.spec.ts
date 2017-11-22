import { Avdo, plugins } from '../../src/avdo';
import { describe, it } from 'mocha';

import { Plugin } from '../../src/plugins/_types';
import { expect } from 'chai';

const FS = require('fs');
const PATH = require('path');
const EOL = require('os').EOL;
const regEOL = new RegExp(EOL, 'g');
const regFilename = /^(.*)\.(\d+)\.xml$/;

describe('plugin tests', () => {
  FS.readdirSync(__dirname).forEach(file => {
    const match: [string, string] = file.match(regFilename);
    let index: string;
    let name: string;

    if (match) {
      name = match[1];
      index = match[2];

      file = PATH.resolve(__dirname, file);

      if (name !== 'convertPathData' || index !== '17') {
        return;
      }

      it(name + '.' + index, () => {
        return readFile(file).then(data => {
          const splitted = normalize(data).split(/\s*@@@\s*/);
          const orig = splitted[0];
          const should = splitted[1];
          const params = splitted[2];
          let avdo: Avdo;

          const plugin = plugins[name];
          if (params) {
            plugin.params = { ...plugin.params, ...JSON.parse(params) };
          }
          avdo = new Avdo({
            plugins: [[plugin]],
            pretty: true,
          });

          return avdo.optimize(orig).then(result => {
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
  return new Promise((resolve, reject) => {
    FS.readFile(file, 'utf8', (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
}
