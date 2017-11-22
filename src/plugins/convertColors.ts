// import * as _collections from './_collections';

// export const type = 'perItem';

// export const active = true;

// export const description =
//   'converts colors: rgb() to #rrggbb and #rrggbb to #rgb';

// export const params = {
//   currentColor: false,
//   names2hex: true,
//   rgb2hex: true,
//   shorthex: true,
//   shortname: true,
// };

// const rNumber = '([+-]?(?:\\d*\\.\\d+|\\d+\\.?)%?)';
// const rComma = '\\s*,\\s*';
// const regRGB = new RegExp(
//   '^rgb\\(\\s*' + rNumber + rComma + rNumber + rComma + rNumber + '\\s*\\)$',
// );
// const regHEX = /^\#(([a-fA-F0-9])\2){3}$/;
// const none = /\bnone\b/i;

// /**
//  * Convert different colors formats in element attributes to hex.
//  *
//  * @see http://www.w3.org/TR/SVG/types.html#DataTypeColor
//  * @see http://www.w3.org/TR/SVG/single-page.html#types-ColorKeywords
//  *
//  * @example
//  * Convert color name keyword to long hex:
//  * fuchsia ➡ #ff00ff
//  *
//  * Convert rgb() to long hex:
//  * rgb(255, 0, 255) ➡ #ff00ff
//  * rgb(50%, 100, 100%) ➡ #7f64ff
//  *
//  * Convert long hex to short hex:
//  * #aabbcc ➡ #abc
//  *
//  * Convert hex to short name
//  * #000080 ➡ navy
//  *
//  * @param {Object} item current iteration item
//  * @param {Object} params plugin params
//  * @return {Boolean} if false, item will be filtered out
//  *
//  * @author Kir Belevich
//  */
// export function fn(item, params) {
//   if (item.elem) {
//     item.eachAttr(function(attr) {
//       if (_collections.colorsProps.indexOf(attr.name) > -1) {
//         var val = attr.value,
//           match;

//         // Convert colors to currentColor
//         if (params.currentColor) {
//           if (typeof params.currentColor === 'string') {
//             match = val === params.currentColor;
//           } else if (params.currentColor.exec) {
//             match = params.currentColor.exec(val);
//           } else {
//             match = !val.match(none);
//           }
//           if (match) {
//             val = 'currentColor';
//           }
//         }

//         // Convert color name keyword to long hex
//         if (params.names2hex && val.toLowerCase() in _collections.colorsNames) {
//           val = _collections.colorsNames[val.toLowerCase()];
//         }

//         // Convert rgb() to long hex
//         if (params.rgb2hex && (match = val.match(regRGB))) {
//           match = match.slice(1, 4).map(function(m) {
//             if (m.indexOf('%') > -1) m = Math.round(parseFloat(m) * 2.55);

//             return Math.max(0, Math.min(m, 255));
//           });

//           val = rgb2hex(match);
//         }

//         // Convert long hex to short hex
//         if (params.shorthex && (match = val.match(regHEX))) {
//           val = '#' + match[0][1] + match[0][3] + match[0][5];
//         }

//         // Convert hex to short name
//         if (params.shortname) {
//           var lowerVal = val.toLowerCase();
//           if (lowerVal in _collections.colorsShortNames) {
//             val = _collections.colorsShortNames[lowerVal];
//           }
//         }

//         attr.value = val;
//       }
//     });
//   }
// }

// /**
//  * Convert [r, g, b] to #rrggbb.
//  *
//  * @see https://gist.github.com/983535
//  *
//  * @example
//  * rgb2hex([255, 255, 255]) // '#ffffff'
//  *
//  * @param {Array} rgb [r, g, b]
//  * @return {String} #rrggbb
//  *
//  * @author Jed Schmidt
//  */
// function rgb2hex(rgb) {
//   return (
//     '#' +
//     ('00000' + ((rgb[0] << 16) | (rgb[1] << 8) | rgb[2]).toString(16))
//       .slice(-6)
//       .toUpperCase()
//   );
// }
