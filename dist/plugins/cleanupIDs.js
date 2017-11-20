"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _collections = require("./_collections");
exports.type = 'full';
exports.active = true;
exports.description = 'removes unused IDs and minifies used';
exports.params = {
    remove: true,
    minify: true,
    prefix: '',
    preserve: [],
    force: false,
};
var referencesProps = new Set(_collections.referencesProps);
var regReferencesUrl = /\burl\(("|')?#(.+?)\1\)/;
var regReferencesHref = /^#(.+?)$/;
var regReferencesBegin = /(\w+)\./;
var styleOrScript = ['style', 'script'];
// prettier-ignore
var generateIDchars = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
];
var maxIDindex = generateIDchars.length - 1;
/**
 * Remove unused and minify used IDs
 * (only if there are no any <style> or <script>).
 *
 * @param {Object} item current iteration item
 * @param {Object} params plugin params
 *
 * @author Kir Belevich
 */
function fn(data, params) {
    var currentID, currentIDstring, IDs = new Map(), referencesIDs = new Map(), hasStyleOrScript = false, preserveIDs = new Set(Array.isArray(params.preserve)
        ? params.preserve
        : params.preserve ? [params.preserve] : []), idValuePrefix = '#', idValuePostfix = '.';
    /**
     * Bananas!
     *
     * @param {Array} items input items
     * @return {Array} output items
     */
    function monkeys(items) {
        for (var i = 0; i < items.content.length && !hasStyleOrScript; i++) {
            var item = items.content[i];
            // quit if <style> of <script> presents ('force' param prevents quitting)
            if (!params.force) {
                if (item.isElem(styleOrScript)) {
                    hasStyleOrScript = true;
                    continue;
                }
                // Don't remove IDs if the whole SVG consists only of defs.
                if (item.isElem('defs') && item.parentNode.isElem('svg')) {
                    var hasDefsOnly = true;
                    for (var j = i + 1; j < items.content.length; j++) {
                        if (items.content[j].isElem()) {
                            hasDefsOnly = false;
                            break;
                        }
                    }
                    if (hasDefsOnly) {
                        break;
                    }
                }
            }
            // …and don't remove any ID if yes
            if (item.isElem()) {
                item.eachAttr(function (attr) {
                    var key, match;
                    // save IDs
                    if (attr.name === 'id') {
                        key = attr.value;
                        if (IDs.has(key)) {
                            item.removeAttr('id'); // remove repeated id
                        }
                        else {
                            IDs.set(key, item);
                        }
                        return;
                    }
                    // save references
                    if (referencesProps.has(attr.name) &&
                        (match = attr.value.match(regReferencesUrl))) {
                        key = match[2]; // url() reference
                    }
                    else if ((attr.local === 'href' &&
                        (match = attr.value.match(regReferencesHref))) ||
                        (attr.name === 'begin' &&
                            (match = attr.value.match(regReferencesBegin)))) {
                        key = match[1]; // href reference
                    }
                    if (key) {
                        var ref = referencesIDs.get(key) || [];
                        ref.push(attr);
                        referencesIDs.set(key, ref);
                    }
                });
            }
            // go deeper
            if (item.content) {
                monkeys(item);
            }
        }
        return items;
    }
    data = monkeys(data);
    if (hasStyleOrScript) {
        return data;
    }
    for (var _i = 0, _a = Object.entries(referencesIDs); _i < _a.length; _i++) {
        var ref = _a[_i];
        var key = ref[0];
        if (IDs.has(key)) {
            // replace referenced IDs with the minified ones
            if (params.minify && !preserveIDs.has(key)) {
                currentIDstring = getIDstring((currentID = generateID(currentID)), params);
                IDs.get(key).attr('id').value = currentIDstring;
                for (var _b = 0, _c = ref[1]; _b < _c.length; _b++) {
                    var attr = _c[_b];
                    attr.value = attr.value.includes(idValuePrefix)
                        ? attr.value.replace(idValuePrefix + key, idValuePrefix + currentIDstring)
                        : attr.value.replace(key + idValuePostfix, currentIDstring + idValuePostfix);
                }
            }
            // don't remove referenced IDs
            IDs.delete(key);
        }
    }
    // remove non-referenced IDs attributes from elements
    if (params.remove) {
        for (var _d = 0, _e = Object.entries(IDs); _d < _e.length; _d++) {
            var keyElem = _e[_d];
            if (!preserveIDs.has(keyElem[0])) {
                keyElem[1].removeAttr('id');
            }
        }
    }
    return data;
}
exports.fn = fn;
/**
 * Generate unique minimal ID.
 *
 * @param {Array} [currentID] current ID
 * @return {Array} generated ID array
 */
function generateID(currentID) {
    if (!currentID)
        return [0];
    currentID[currentID.length - 1]++;
    for (var i = currentID.length - 1; i > 0; i--) {
        if (currentID[i] > maxIDindex) {
            currentID[i] = 0;
            if (currentID[i - 1] !== undefined) {
                currentID[i - 1]++;
            }
        }
    }
    if (currentID[0] > maxIDindex) {
        currentID[0] = 0;
        currentID.unshift(0);
    }
    return currentID;
}
/**
 * Get string from generated ID array.
 *
 * @param {Array} arr input ID array
 * @return {String} output ID string
 */
function getIDstring(arr, params) {
    var str = params.prefix;
    return str + arr.map(function (i) { return generateIDchars[i]; }).join('');
}
