import OS = require('os');

const EOL = OS.EOL;

const entities = {
  '&': '&amp;',
  "'": '&apos;',
  '"': '&quot;',
  '>': '&gt;',
  '<': '&lt;',
};

const defaults = {
  doctypeStart: '<!DOCTYPE',
  doctypeEnd: '>',
  procInstStart: '<?',
  procInstEnd: '?>',
  tagOpenStart: '<',
  tagOpenEnd: '>',
  tagCloseStart: '</',
  tagCloseEnd: '>',
  tagShortStart: '<',
  tagShortEnd: '/>',
  attrStart: '="',
  attrEnd: '"',
  commentStart: '<!--',
  commentEnd: '-->',
  cdataStart: '<![CDATA[',
  cdataEnd: ']]>',
  textStart: '',
  textEnd: '',
  indent: 4,
  regEntities: /[&'"<>]/g,
  regValEntities: /[&"<>]/g,
  encodeEntity: (char: string) => entities[char],
  pretty: false,
  useShortTags: true,
};

/**
 * Convert XML-as-JS object to XML string.
 * @param {Object} data input data
 * @param {Object} config config
 * @return {Object} output data
 */
export function js2xml(data, config) {
  return new Js2Xml(config).convert(data);
}

class Js2Xml {
  config: any;
  indentLevel: number;
  width?: any;
  height?: any;

  constructor(config) {
    if (config) {
      this.config = { ...defaults, ...config };
    } else {
      this.config = defaults;
    }
    const indent = this.config.indent;
    if (typeof indent !== 'number' && !isNaN(indent)) {
      this.config.indent = indent < 0 ? '\t' : ' '.repeat(indent);
    } else if (typeof indent !== 'string') {
      this.config.indent = '    ';
    }
    if (this.config.pretty) {
      this.config.doctypeEnd += EOL;
      this.config.procInstEnd += EOL;
      this.config.commentEnd += EOL;
      this.config.cdataEnd += EOL;
      this.config.tagShortEnd += EOL;
      this.config.tagOpenEnd += EOL;
      this.config.tagCloseEnd += EOL;
      this.config.textEnd += EOL;
    }
    this.indentLevel = 0;
  }

  /**
   * Start conversion.
   *
   * @param {Object} data input data
   *
   * @return {String}
   */
  convert(data) {
    let svg = '';
    if (data.content) {
      this.indentLevel++;
      data.content.forEach(item => {
        if (item.elem) {
          svg += this.createElem(item);
        } else if (item.doctype) {
          svg += this.createDoctype(item.doctype);
        } else if (item.processinginstruction) {
          svg += this.createProcInst(item.processinginstruction);
        } else if (item.comment) {
          svg += this.createComment(item.comment);
        } else if (item.cdata) {
          svg += this.createCDATA(item.cdata);
        }
      }, this);
    }
    this.indentLevel--;
    return {
      data: svg,
      info: {
        width: this.width,
        height: this.height,
      },
    };
  }

  /**
   * Create indent string in accordance with the current node level.
   *
   * @return {String}
   */
  createIndent() {
    let indent = '';
    if (this.config.pretty) {
      indent = this.config.indent.repeat(this.indentLevel - 1);
    }
    return indent;
  }

  /**
   * Create doctype tag.
   *
   * @param {String} doctype doctype body string
   *
   * @return {String}
   */
  createDoctype(doctype) {
    return this.config.doctypeStart + doctype + this.config.doctypeEnd;
  }

  /**
   * Create XML Processing Instruction tag.
   *
   * @param {Object} instruction instruction object
   *
   * @return {String}
   */
  createProcInst(instruction) {
    return (
      this.config.procInstStart +
      instruction.name +
      ' ' +
      instruction.body +
      this.config.procInstEnd
    );
  }

  /**
   * Create comment tag.
   *
   * @param {String} comment comment body
   *
   * @return {String}
   */
  createComment(comment) {
    return this.config.commentStart + comment + this.config.commentEnd;
  }

  /**
   * Create CDATA section.
   *
   * @param {String} cdata CDATA body
   *
   * @return {String}
   */
  createCDATA(cdata) {
    return (
      this.createIndent() +
      this.config.cdataStart +
      cdata +
      this.config.cdataEnd
    );
  }

  /**
   * Create element tag.
   *
   * @param {Object} data element object
   *
   * @return {String}
   */
  createElem(data) {
    // beautiful injection for obtaining SVG information :)
    if (data.isElem('svg') && data.hasAttr('width') && data.hasAttr('height')) {
      this.width = data.attr('width').value;
      this.height = data.attr('height').value;
    }

    // empty element and short tag
    if (data.isEmpty()) {
      if (this.config.useShortTags) {
        return (
          this.createIndent() +
          this.config.tagShortStart +
          data.elem +
          this.createAttrs(data) +
          this.config.tagShortEnd
        );
      } else {
        return (
          this.createIndent() +
          this.config.tagShortStart +
          data.elem +
          this.createAttrs(data) +
          this.config.tagOpenEnd +
          this.config.tagCloseStart +
          data.elem +
          this.config.tagCloseEnd
        );
      }
      // non-empty element
    } else {
      const tagOpenStart = this.config.tagOpenStart;
      const tagOpenEnd = this.config.tagOpenEnd;
      const tagCloseStart = this.config.tagCloseStart;
      const tagCloseEnd = this.config.tagCloseEnd;
      const openIndent = this.createIndent();
      const dataEnd = '';
      const processedData = '' + this.convert(data).data;

      return (
        openIndent +
        tagOpenStart +
        data.elem +
        this.createAttrs(data) +
        tagOpenEnd +
        processedData +
        dataEnd +
        this.createIndent() +
        tagCloseStart +
        data.elem +
        tagCloseEnd
      );
    }
  }

  /**
   * Create element attributes.
   *
   * @param {Object} elem attributes object
   *
   * @return {String}
   */
  createAttrs(elem) {
    let attrs = '';
    elem.eachAttr(function(attr) {
      if (attr.value !== undefined) {
        attrs +=
          ' ' +
          attr.name +
          this.config.attrStart +
          String(attr.value).replace(
            this.config.regValEntities,
            this.config.encodeEntity,
          ) +
          this.config.attrEnd;
      } else {
        attrs += ' ' + attr.name;
      }
    }, this);
    return attrs;
  }
}
