import { Attr, JsApi } from '../../src/lib/jsapi';

import { xml2js } from '../../src/lib/xml2js';

import FS = require('fs');
import PATH = require('path');
import SHOULD = require('should');

describe('xml2js', () => {
  describe('working xml', () => {
    const filepath = PATH.resolve(__dirname, './test.good.xml');
    let root: JsApi;

    before(done => {
      FS.readFile(filepath, 'utf8', (err, data) => {
        if (err) {
          throw err;
        }
        xml2js(
          data,
          result => {
            root = result;
            done();
          },
          _ => {},
        );
      });
    });

    describe('root', () => {
      it('should exist', () => {
        return root.should.exist;
      });

      it('should be an instance of Object', () => {
        return root.should.be.an.instanceOf(Object);
      });

      it('should have property "content"', () => {
        return root.should.have.property('content');
      });
    });

    describe('root.content', () => {
      it('should be an instance of Array', () => {
        return root.content.should.be.an.instanceOf(Array);
      });

      it('should have length 4', () => {
        return root.content.should.have.lengthOf(3);
      });
    });

    describe('root.content[0].processinginstruction', () => {
      it('should exist', () => {
        return root.content[0].processingInstruction.should.exist;
      });

      it('should be an instance of Object', () => {
        return root.content[0].processingInstruction.should.be.an.instanceOf(
          Object,
        );
      });

      it('should have property "name" with value "xml"', () => {
        return root.content[0].processingInstruction.should.have.property(
          'name',
          'xml',
        );
      });

      it('should have property "body" with value "version="1.0" encoding="utf-8""', () => {
        return root.content[0].processingInstruction.should.have.property(
          'body',
          'version="1.0" encoding="utf-8"',
        );
      });
    });

    describe('root.content[1].comment', () => {
      it('should exist', () => {
        return root.content[1].comment.should.exist;
      });

      it('should equal "Some random comment #1"', () => {
        return root.content[1].comment.text.should.equal(
          'Some random comment #1',
        );
      });
    });

    describe('elem', () => {
      it('should have property elem: "svg"', () => {
        return root.content[2].should.have.property('elem', 'svg');
      });

      it('should have property prefix: ""', () => {
        return root.content[2].should.have.property('prefix', '');
      });

      it('should have property local: "svg"', () => {
        return root.content[2].should.have.property('local', 'svg');
      });
    });

    describe('attributes', () => {
      describe('root.content[2].attrs', () => {
        it('should exist', () => {
          return root.content[2].attrs.should.exist;
        });

        it('should be an instance of Object', () => {
          return root.content[2].attrs.should.be.an.instanceOf(Object);
        });
      });

      describe('root.content[2].attrs.version', () => {
        it('should exist', () => {
          return root.content[2].attrs.version.should.exist;
        });

        it('should be an instance of Object', () => {
          return root.content[2].attrs.version.should.be.an.instanceOf(Object);
        });

        it('should have property name: "version"', () => {
          return root.content[2].attrs.version.should.have.property(
            'name',
            'version',
          );
        });

        it('should have property value: "1.1"', () => {
          return root.content[2].attrs.version.should.have.property(
            'value',
            '1.1',
          );
        });

        it('should have property prefix: ""', () => {
          return root.content[2].attrs.version.should.have.property(
            'prefix',
            '',
          );
        });

        it('should have property local: "version"', () => {
          return root.content[2].attrs.version.should.have.property(
            'local',
            'version',
          );
        });
      });
    });

    describe('content', () => {
      it('should exist', () => {
        return root.content[2].content.should.exist;
      });

      it('should be an instance of Array', () => {
        return root.content[2].content.should.be.an.instanceOf(Array);
      });

      it('should eventually have length 3', () => {
        return root.content[2].content.should.have.lengthOf(3);
      });
    });

    describe('API', () => {
      describe('isElem()', () => {
        it('svg should have property "isElem"', () => {
          return root.content[2].should.have.property('isElem');
        });

        it('svg.isElem() should be true', () => {
          return root.content[2].isElem().should.be.true;
        });

        it('svg.isElem("svg") should be true', () => {
          return root.content[2].isElem('svg').should.be.true;
        });

        it('svg.isElem("trololo") should be false', () => {
          return root.content[2].isElem('trololo').should.be.false;
        });

        it('svg.isElem(["svg", "trololo"]) should be true', () => {
          return root.content[2].isElem(['svg', 'trololo']).should.be.true;
        });
      });

      describe('isEmpty()', () => {
        it('svg should have property "isEmpty"', () => {
          return root.content[2].should.have.property('isEmpty');
        });

        it('svg.isEmpty() should be false', () => {
          return root.content[2].isEmpty().should.be.false;
        });

        it('svg.content[2].content[0].isEmpty() should be true', () => {
          return root.content[2].content[0].isEmpty().should.be.true;
        });
      });

      describe('hasAttr()', () => {
        it('svg should have property "hasAttr"', () => {
          return root.content[2].should.have.property('hasAttr');
        });

        it('svg.hasAttr() should be true', () => {
          return root.content[2].hasAttr().should.be.true;
        });

        it('svg.hasAttr("xmlns") should be true', () => {
          return root.content[2].hasAttr('xmlns').should.be.true;
        });

        it('svg.hasAttr("xmlns", "http://www.w3.org/2000/svg") should be true', () => {
          return root.content[2].hasAttr('xmlns', 'http://www.w3.org/2000/svg')
            .should.be.true;
        });

        it('svg.hasAttr("xmlns", "trololo") should be false', () => {
          return root.content[2].hasAttr('xmlns', 'trololo').should.be.false;
        });

        it('svg.hasAttr("trololo") should be false', () => {
          return root.content[2].hasAttr('trololo').should.be.false;
        });

        it('svg.content[1].hasAttr() should be false', () => {
          return root.content[2].content[1].hasAttr().should.be.false;
        });
      });

      describe('attr()', () => {
        it('svg should have property "attr"', () => {
          return root.content[2].should.have.property('attr');
        });

        it('svg.attr("xmlns") should be an instance of Object', () => {
          return root.content[2].attr('xmlns').should.be.an.instanceOf(Object);
        });

        it('svg.attr("xmlns", "http://www.w3.org/2000/svg") should be an instance of Object', () => {
          return root.content[2]
            .attr('xmlns', 'http://www.w3.org/2000/svg')
            .should.be.an.instanceOf(Object);
        });

        it('svg.attr("xmlns", "trololo") should be an undefined', () => {
          return SHOULD.not.exist(root.content[2].attr('xmlns', 'trololo'));
        });

        it('svg.attr("trololo") should be an undefined', () => {
          return SHOULD.not.exist(root.content[2].attr('trololo'));
        });

        it('svg.attr() should be undefined', () => {
          return SHOULD.not.exist(root.content[2].attr(undefined));
        });
      });

      describe('removeAttr()', () => {
        it('svg should have property "removeAttr"', () => {
          return root.content[2].should.have.property('removeAttr');
        });

        it('svg.removeAttr("width") should be true', () => {
          return (
            root.content[2].removeAttr('width').should.be.true &&
            root.content[2].hasAttr('width').should.be.false
          );
        });

        it('svg.removeAttr("height", "120px") should be true', () => {
          return (
            root.content[2].removeAttr(['height', '120px']).should.be.true &&
            root.content[2].hasAttr('height').should.be.false
          );
        });

        it('svg.removeAttr("x", "1px") should be false', () => {
          return (
            root.content[2].removeAttr(['x', '1px']).should.be.false &&
            root.content[2].hasAttr('x').should.be.true
          );
        });

        it('svg.removeAttr("z") should be false', () => {
          return root.content[2].removeAttr('z').should.be.false;
        });

        it('svg.removeAttr() should be false', () => {
          return root.content[2].removeAttr([]).should.be.false;
        });
      });

      describe('addAttr()', () => {
        const attr: Attr = {
          name: 'test',
          value: '3',
          prefix: '',
          local: 'test',
        };

        it('svg should have property "addAttr"', () => {
          return root.content[2].should.have.property('addAttr');
        });

        it('svg.addAttr(attr) should be an instance of Object', () => {
          return root.content[2].addAttr(attr).should.be.an.instanceOf(Object);
        });

        it('svg.content[1].content[0].addAttr(attr) should be an instance of Object', () => {
          return root.content[2].content[1].content[0]
            .addAttr(attr)
            .should.be.an.instanceOf(Object);
        });

        it('svg.addAttr({ name: "trololo" }) should be false', () => {
          return root.content[2].addAttr({ name: 'trololo' } as Attr).should.be
            .false;
        });

        it('svg.addAttr({ name: "trololo", value: 3 }) should be false', () => {
          return root.content[2].addAttr({
            name: 'trololo',
            value: '3',
            prefix: '',
            local: '',
          }).should.be.false;
        });

        it('svg.addAttr({ name: "trololo", value: 3, prefix: "" }) should be false', () => {
          return root.content[2].addAttr({
            name: 'trololo',
            value: '3',
            prefix: '',
            local: '',
          }).should.be.false;
        });

        it('svg.addAttr({ name: "trololo", value: 3, local: "trololo" }) should be false', () => {
          return root.content[2].addAttr({
            name: 'trololo',
            value: '3',
            prefix: '',
            local: 'trololo',
          }).should.be.false;
        });

        it('svg.addAttr() should be false', () => {
          return root.content[2].addAttr({} as Attr).should.be.false;
        });
      });

      describe('eachAttr()', () => {
        it('svg should have property "eachAttr"', () => {
          return root.content[2].should.have.property('eachAttr');
        });

        it('svg.content[0].eachAttr(() => {}) should be true', () => {
          return (
            root.content[2].content[2].eachAttr(attr => (attr['test'] = 1))
              .should.be.true &&
            root.content[2].content[2].attr('style')['test'].should.equal(1)
          );
        });

        it('svg.content[1].eachAttr(() => {}) should be false', () => {
          return root.content[2].content[1].eachAttr(undefined).should.be.false;
        });
      });
    });
  });

  describe('malformed svg', () => {
    const filepath = PATH.resolve(__dirname, './test.bad.xml');
    let root: JsApi;
    let error;
    let caughtError;

    before(done => {
      FS.readFile(filepath, 'utf8', function(err, data) {
        if (err) {
          throw err;
        }
        try {
          xml2js(
            data,
            result => {
              root = result;
            },
            e => {
              caughtError = e;
            },
          );
        } catch (e) {
          error = e;
        }
        done();
      });
    });

    describe('caughtError', () => {
      it('should be an instance of String', () => {
        return caughtError.should.an.instanceOf(String);
      });

      it('should be "Error in parsing SVG: Unexpected close tag"', () => {
        return caughtError.should.equal(
          'Error in parsing XML: Unexpected close tag\nLine: 10\nColumn: 15\nChar: >',
        );
      });
    });

    describe('error', () => {
      it('should not be thrown', () => {
        return SHOULD.not.exist(error);
      });
    });
  });
});
