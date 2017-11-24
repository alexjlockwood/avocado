import { Avdo, plugins } from '../../src/lib/avdo';

import { Plugin } from '../../src/plugins/_types';
import { expect } from 'chai';

import FS = require('fs');
import PATH = require('path');
import OS = require('os');
const regEOL = new RegExp(OS.EOL, 'g');
const regFilename = /^(.*)\.(\d+)\.xml$/;

describe('plugin tests', () => {
  FS.readdirSync(__dirname).forEach(file => {
    const match = file.match(regFilename);
    let index: string;
    let name: string;

    if (match) {
      name = match[1];
      index = match[2];

      file = PATH.resolve(__dirname, file);

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
            normalize(result).should.be.equal(should);
          });
        });
      });
    }
  });
});

function normalize(file: string) {
  return file.trim().replace(regEOL, '\n');
}

function readFile(file: string) {
  return new Promise<string>((resolve, reject) => {
    FS.readFile(file, 'utf8', (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
}
