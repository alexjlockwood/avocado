import * as SAX from 'sax';

import { JsApi, Options } from './jsapi';

const saxOptions: SAX.SAXOptions = {
  trim: false,
  normalize: true,
  lowercase: true,
  xmlns: true,
  position: true,
};

/**
 * @param {String} data input data
 * @param {Function} callback
 */
export function xml2js(
  data: string,
  onSuccess: (jsApi: JsApi) => void,
  onFail: (error: string) => void,
) {
  const sax = SAX.parser(true, saxOptions);
  const root = new JsApi({ elem: '#document', content: [] });
  let current: JsApi = root;
  const stack = [root];
  let parsingError = false;

  function pushToContent(options: Options) {
    const newContent = new JsApi({ parentNode: current, ...options });
    (current.content = current.content || []).push(newContent);
    return newContent;
  }

  sax.onopentag = function(node) {
    const qualifiedTag = node as SAX.QualifiedTag;
    const elem = {
      elem: qualifiedTag.name,
      prefix: qualifiedTag.prefix,
      local: qualifiedTag.local,
      attrs: {} as any,
    };
    for (const name of Object.keys(qualifiedTag.attributes)) {
      const { value, prefix, local } = qualifiedTag.attributes[name];
      elem.attrs[name] = { name, value, prefix, local };
    }
    const jsApiElem = pushToContent(elem);
    current = jsApiElem;
    stack.push(jsApiElem);
  };

  sax.onclosetag = function() {
    stack.pop();
    current = stack[stack.length - 1];
  };

  sax.oncomment = function(comment) {
    pushToContent({ comment: { text: comment.trim() } });
  };

  sax.onprocessinginstruction = function(processingInstruction) {
    pushToContent({ processingInstruction });
  };

  sax.onerror = function(error) {
    error.message = 'Error in parsing SVG: ' + error.message;
    if (error.message.indexOf('Unexpected end') < 0) {
      throw error;
    }
  };

  sax.onend = function() {
    if (this.error) {
      onFail(this.error.message);
    } else {
      onSuccess(root);
    }
  };

  try {
    sax.write(data);
  } catch (e) {
    onFail(e.message);
    parsingError = true;
  }
  if (!parsingError) {
    sax.close();
  }
}
