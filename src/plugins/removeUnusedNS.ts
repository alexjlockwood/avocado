import { JsApi } from '../lib/jsapi';
import { Plugin } from './_types';

/**
 * Remove unused namespaces declarations.
 * TODO: remove namespace declarations that occur on non-root nodes?
 */
function fn(data: JsApi) {
  let svgElem: JsApi;
  const xmlnsCollection: string[] = [];

  function removeNSfromCollection(nsName: string) {
    const pos = xmlnsCollection.indexOf(nsName);
    // If found, remove the ns from the namespaces collection.
    if (pos > -1) {
      xmlnsCollection.splice(pos, 1);
    }
  }

  data = (function recurseFn(items: JsApi) {
    let i = 0;
    const length = items.content.length;

    while (i < length) {
      const item = items.content[i];

      if (item.isElem('vector') || item.isElem('animated-vector')) {
        item.eachAttr(attr => {
          // Collect namespaces.
          if (attr.prefix === 'xmlns' && attr.local) {
            xmlnsCollection.push(attr.local);
          }
        });

        // If the root element has ns-attr.
        if (xmlnsCollection.length) {
          // Save root element.
          svgElem = item;
        }
      } else if (xmlnsCollection.length) {
        // Check item for the ns-attrs.
        if (item.prefix) {
          removeNSfromCollection(item.prefix);
        }
        // Check each attr for the ns-attrs.
        item.eachAttr(attr => removeNSfromCollection(attr.prefix));
      }

      // If nothing is found, go deeper.
      if (xmlnsCollection.length && item.content) {
        recurseFn(item);
      }
      i++;
    }
    return items;
  })(data);

  // Remove svg element ns-attributes if they are never used.
  if (xmlnsCollection.length) {
    xmlnsCollection.forEach(name => svgElem.removeAttr('xmlns:' + name));
  }

  return data;
}

export const removeUnusedNS: Plugin<undefined> = {
  type: 'full',
  active: true,
  description: 'removes unused namespaces declarations',
  params: undefined,
  fn,
};
