import { Attr, JsApi } from './jsapi';

import { EOL } from 'os';

const entities: { [key: string]: string } = {
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
  indentSize: 4,
  regEntities: /[&'"<>]/g,
  regValEntities: /[&"<>]/g,
  encodeEntity: (char: string) => entities[char],
  pretty: false,
  useShortTags: true,
};

// TODO: make the indentation size configurable?
export interface Options {
  pretty?: boolean;
}

/**
 * Convert XML-as-JS object to XML string.
 * @param {Object} data input data
 * @param {Object} options options
 * @return {Object} output data
 */
export function js2xml(data: JsApi, options?: Options) {
  return new Js2Xml(options).convert(data);
}

class Js2Xml {
  private readonly options: Options & typeof defaults;
  private indentLevel = 0;

  constructor(options?: Options) {
    if (options) {
      this.options = { ...defaults, ...options };
    } else {
      this.options = defaults;
    }
    if (this.options.pretty) {
      this.options.doctypeEnd += EOL;
      this.options.procInstEnd += EOL;
      this.options.commentEnd += EOL;
      this.options.cdataEnd += EOL;
      this.options.tagShortEnd += EOL;
      this.options.tagOpenEnd += EOL;
      this.options.tagCloseEnd += EOL;
      this.options.textEnd += EOL;
    }
  }

  /**
   * Start conversion.
   * @param {Object} data input data
   * @return {String}
   */
  convert(data: JsApi) {
    let xml = '';
    if (data.content) {
      this.indentLevel++;
      data.content.forEach(function(this: Js2Xml, item) {
        if (item.elem) {
          xml += this.createElem(item);
        } else if (item.processingInstruction) {
          xml += this.createProcInst(item.processingInstruction);
        } else if (item.comment) {
          xml += this.createComment(item.comment.text);
        }
      }, this);
    }
    this.indentLevel--;
    return xml;
  }

  /**
   * Create indent string in accordance with the current node level.
   *
   * @return {String}
   */
  private createIndent() {
    let indent = '';
    if (this.options.pretty) {
      // TODO: make the indentation size configurable?
      indent = '    '.repeat(this.indentLevel - 1);
    }
    return indent;
  }

  /**
   * Create comment tag.
   * @param {String} comment comment body
   * @return {String}
   */
  private createComment(comment: string) {
    return this.options.commentStart + comment + this.options.commentEnd;
  }

  /**
   * Create XML Processing Instruction tag.
   * @param {Object} instruction instruction object
   * @return {String}
   */
  private createProcInst(instruction: { name: string; body: string }) {
    return (
      this.options.procInstStart +
      instruction.name +
      ' ' +
      instruction.body +
      this.options.procInstEnd
    );
  }

  /**
   * Create element tag.
   * @param {Object} data element object
   * @return {String}
   */
  private createElem(data: JsApi) {
    // Empty element and short tag.
    if (data.isEmpty()) {
      if (this.options.useShortTags) {
        return (
          this.createIndent() +
          this.options.tagShortStart +
          data.elem +
          this.createAttrs(data) +
          this.options.tagShortEnd
        );
      } else {
        return (
          this.createIndent() +
          this.options.tagShortStart +
          data.elem +
          this.createAttrs(data) +
          this.options.tagOpenEnd +
          this.options.tagCloseStart +
          data.elem +
          this.options.tagCloseEnd
        );
      }
    } else {
      // Non-empty element.
      const tagOpenStart = this.options.tagOpenStart;
      const tagOpenEnd = this.options.tagOpenEnd;
      const tagCloseStart = this.options.tagCloseStart;
      const tagCloseEnd = this.options.tagCloseEnd;
      const openIndent = this.createIndent();
      const dataEnd = '';
      const processedData = '' + this.convert(data);
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
   * @param {Object} elem attributes object
   * @return {String}
   */
  private createAttrs(elem: JsApi) {
    let attrs = '';
    elem.eachAttr(function(this: Js2Xml, attr: Attr) {
      if (attr.value !== undefined) {
        attrs +=
          ' ' +
          attr.name +
          this.options.attrStart +
          String(attr.value).replace(
            this.options.regValEntities,
            this.options.encodeEntity,
          ) +
          this.options.attrEnd;
      } else {
        attrs += ' ' + attr.name;
      }
    }, this);
    return attrs;
  }
}
