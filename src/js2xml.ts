import { EOL } from 'os';
import { JsApi } from './jsapi';

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
export function js2xml(data: JsApi, config?: any) {
  return new Js2Xml(config).convert(data);
}

class Js2Xml {
  private readonly config: any;
  private indentLevel = 0;

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
      data.content.forEach(function(item) {
        if (item.elem) {
          xml += this.createElem(item);
        } else if (item.comment) {
          xml += this.createComment(item.comment);
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
    if (this.config.pretty) {
      indent = this.config.indent.repeat(this.indentLevel - 1);
    }
    return indent;
  }

  /**
   * Create comment tag.
   *
   * @param {String} comment comment body
   *
   * @return {String}
   */
  private createComment(comment: string) {
    return this.config.commentStart + comment + this.config.commentEnd;
  }

  /**
   * Create element tag.
   * @param {Object} data element object
   * @return {String}
   */
  private createElem(data: JsApi) {
    // Empty element and short tag.
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
    } else {
      // Non-empty element.
      const tagOpenStart = this.config.tagOpenStart;
      const tagOpenEnd = this.config.tagOpenEnd;
      const tagCloseStart = this.config.tagCloseStart;
      const tagCloseEnd = this.config.tagCloseEnd;
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
