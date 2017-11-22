export declare const elemsGroups: {
    animation: string[];
    descriptive: string[];
    shape: string[];
    structural: string[];
    paintServer: string[];
    nonRendering: string[];
    container: string[];
    textContent: string[];
    textContentChild: string[];
    lightSource: string[];
    filterPrimitive: string[];
};
export declare const pathElems: string[];
export declare const attrsGroups: {
    animationAddition: string[];
    animationAttributeTarget: string[];
    animationEvent: string[];
    animationTiming: string[];
    animationValue: string[];
    conditionalProcessing: string[];
    core: string[];
    graphicalEvent: string[];
    presentation: string[];
    xlink: string[];
    documentEvent: string[];
    filterPrimitive: string[];
    transferFunction: string[];
};
export declare const attrsGroupsDefaults: {
    core: {
        'xml:space': string;
    };
    filterPrimitive: {
        x: string;
        y: string;
        width: string;
        height: string;
    };
    presentation: {
        clip: string;
        'clip-path': string;
        'clip-rule': string;
        mask: string;
        opacity: string;
        'solid-color': string;
        'solid-opacity': string;
        'stop-color': string;
        'stop-opacity': string;
        'fill-opacity': string;
        'fill-rule': string;
        fill: string;
        stroke: string;
        'stroke-width': string;
        'stroke-linecap': string;
        'stroke-linejoin': string;
        'stroke-miterlimit': string;
        'stroke-dasharray': string;
        'stroke-dashoffset': string;
        'stroke-opacity': string;
        'paint-order': string;
        'vector-effect': string;
        'viewport-fill': string;
        'viewport-fill-opacity': string;
        display: string;
        visibility: string;
        'marker-start': string;
        'marker-mid': string;
        'marker-end': string;
        'color-interpolation': string;
        'color-interpolation-filters': string;
        'color-rendering': string;
        'shape-rendering': string;
        'text-rendering': string;
        'image-rendering': string;
        'buffered-rendering': string;
        'font-style': string;
        'font-variant': string;
        'font-weight': string;
        'font-stretch': string;
        'font-size': string;
        'font-size-adjust': string;
        kerning: string;
        'letter-spacing': string;
        'word-spacing': string;
        'text-decoration': string;
        'text-anchor': string;
        'text-overflow': string;
        'writing-mode': string;
        'glyph-orientation-vertical': string;
        'glyph-orientation-horizontal': string;
        direction: string;
        'unicode-bidi': string;
        'dominant-baseline': string;
        'alignment-baseline': string;
        'baseline-shift': string;
    };
    transferFunction: {
        slope: string;
        intercept: string;
        amplitude: string;
        exponent: string;
        offset: string;
    };
};
export declare const elems: {
    a: {
        attrsGroups: string[];
        attrs: string[];
        defaults: {
            target: string;
        };
        contentGroups: string[];
        content: string[];
    };
    altGlyph: {
        attrsGroups: string[];
        attrs: string[];
    };
    altGlyphDef: {
        attrsGroups: string[];
        content: string[];
    };
    altGlyphItem: {
        attrsGroups: string[];
        content: string[];
    };
    animate: {
        attrsGroups: string[];
        attrs: string[];
        contentGroups: string[];
    };
    animateColor: {
        attrsGroups: string[];
        attrs: string[];
        contentGroups: string[];
    };
    animateMotion: {
        attrsGroups: string[];
        attrs: string[];
        defaults: {
            rotate: string;
        };
        contentGroups: string[];
        content: string[];
    };
    animateTransform: {
        attrsGroups: string[];
        attrs: string[];
        contentGroups: string[];
    };
    circle: {
        attrsGroups: string[];
        attrs: string[];
        defaults: {
            cx: string;
            cy: string;
        };
        contentGroups: string[];
    };
    clipPath: {
        attrsGroups: string[];
        attrs: string[];
        defaults: {
            clipPathUnits: string;
        };
        contentGroups: string[];
        content: string[];
    };
    'color-profile': {
        attrsGroups: string[];
        attrs: string[];
        defaults: {
            name: string;
            'rendering-intent': string;
        };
        contentGroups: string[];
    };
    cursor: {
        attrsGroups: string[];
        attrs: string[];
        defaults: {
            x: string;
            y: string;
        };
        contentGroups: string[];
    };
    defs: {
        attrsGroups: string[];
        attrs: string[];
        contentGroups: string[];
        content: string[];
    };
    desc: {
        attrsGroups: string[];
        attrs: string[];
    };
    ellipse: {
        attrsGroups: string[];
        attrs: string[];
        defaults: {
            cx: string;
            cy: string;
        };
        contentGroups: string[];
    };
    feBlend: {
        attrsGroups: string[];
        attrs: string[];
        defaults: {
            mode: string;
        };
        content: string[];
    };
    feColorMatrix: {
        attrsGroups: string[];
        attrs: string[];
        defaults: {
            type: string;
        };
        content: string[];
    };
    feComponentTransfer: {
        attrsGroups: string[];
        attrs: string[];
        content: string[];
    };
    feComposite: {
        attrsGroups: string[];
        attrs: string[];
        defaults: {
            operator: string;
            k1: string;
            k2: string;
            k3: string;
            k4: string;
        };
        content: string[];
    };
    feConvolveMatrix: {
        attrsGroups: string[];
        attrs: string[];
        defaults: {
            order: string;
            bias: string;
            edgeMode: string;
            preserveAlpha: string;
        };
        content: string[];
    };
    feDiffuseLighting: {
        attrsGroups: string[];
        attrs: string[];
        defaults: {
            surfaceScale: string;
            diffuseConstant: string;
        };
        contentGroups: string[];
        content: string[];
    };
    feDisplacementMap: {
        attrsGroups: string[];
        attrs: string[];
        defaults: {
            scale: string;
            xChannelSelector: string;
            yChannelSelector: string;
        };
        content: string[];
    };
    feDistantLight: {
        attrsGroups: string[];
        attrs: string[];
        defaults: {
            azimuth: string;
            elevation: string;
        };
        content: string[];
    };
    feFlood: {
        attrsGroups: string[];
        attrs: string[];
        content: string[];
    };
    feFuncA: {
        attrsGroups: string[];
        content: string[];
    };
    feFuncB: {
        attrsGroups: string[];
        content: string[];
    };
    feFuncG: {
        attrsGroups: string[];
        content: string[];
    };
    feFuncR: {
        attrsGroups: string[];
        content: string[];
    };
    feGaussianBlur: {
        attrsGroups: string[];
        attrs: string[];
        defaults: {
            stdDeviation: string;
        };
        content: string[];
    };
    feImage: {
        attrsGroups: string[];
        attrs: string[];
        defaults: {
            preserveAspectRatio: string;
        };
        content: string[];
    };
    feMerge: {
        attrsGroups: string[];
        attrs: string[];
        content: string[];
    };
    feMergeNode: {
        attrsGroups: string[];
        attrs: string[];
        content: string[];
    };
    feMorphology: {
        attrsGroups: string[];
        attrs: string[];
        defaults: {
            operator: string;
            radius: string;
        };
        content: string[];
    };
    feOffset: {
        attrsGroups: string[];
        attrs: string[];
        defaults: {
            dx: string;
            dy: string;
        };
        content: string[];
    };
    fePointLight: {
        attrsGroups: string[];
        attrs: string[];
        defaults: {
            x: string;
            y: string;
            z: string;
        };
        content: string[];
    };
    feSpecularLighting: {
        attrsGroups: string[];
        attrs: string[];
        defaults: {
            surfaceScale: string;
            specularConstant: string;
            specularExponent: string;
        };
        contentGroups: string[];
    };
    feSpotLight: {
        attrsGroups: string[];
        attrs: string[];
        defaults: {
            x: string;
            y: string;
            z: string;
            pointsAtX: string;
            pointsAtY: string;
            pointsAtZ: string;
            specularExponent: string;
        };
        content: string[];
    };
    feTile: {
        attrsGroups: string[];
        attrs: string[];
        content: string[];
    };
    feTurbulence: {
        attrsGroups: string[];
        attrs: string[];
        defaults: {
            baseFrequency: string;
            numOctaves: string;
            seed: string;
            stitchTiles: string;
            type: string;
        };
        content: string[];
    };
    filter: {
        attrsGroups: string[];
        attrs: string[];
        defaults: {
            primitiveUnits: string;
            x: string;
            y: string;
            width: string;
            height: string;
        };
        contentGroups: string[];
        content: string[];
    };
    font: {
        attrsGroups: string[];
        attrs: string[];
        defaults: {
            'horiz-origin-x': string;
            'horiz-origin-y': string;
        };
        contentGroups: string[];
        content: string[];
    };
    'font-face': {
        attrsGroups: string[];
        attrs: string[];
        defaults: {
            'font-style': string;
            'font-variant': string;
            'font-weight': string;
            'font-stretch': string;
            'unicode-range': string;
            'units-per-em': string;
            'panose-1': string;
            slope: string;
        };
        contentGroups: string[];
        content: string[];
    };
    'font-face-format': {
        attrsGroups: string[];
        attrs: string[];
    };
    'font-face-name': {
        attrsGroups: string[];
        attrs: string[];
    };
    'font-face-src': {
        attrsGroups: string[];
        content: string[];
    };
    'font-face-uri': {
        attrsGroups: string[];
        attrs: string[];
        content: string[];
    };
    foreignObject: {
        attrsGroups: string[];
        attrs: string[];
        defaults: {
            x: number;
            y: number;
        };
    };
    g: {
        attrsGroups: string[];
        attrs: string[];
        contentGroups: string[];
        content: string[];
    };
    glyph: {
        attrsGroups: string[];
        attrs: string[];
        defaults: {
            'arabic-form': string;
        };
        contentGroups: string[];
        content: string[];
    };
    glyphRef: {
        attrsGroups: string[];
        attrs: string[];
        contentGroups: string[];
        content: string[];
    };
    hatch: {
        attrsGroups: string[];
        attrs: string[];
        defaults: {
            hatchUnits: string;
            hatchContentUnits: string;
            x: string;
            y: string;
            pitch: string;
            rotate: string;
        };
        contentGroups: string[];
        content: string[];
    };
    hatchPath: {
        attrsGroups: string[];
        attrs: string[];
        defaults: {
            offset: string;
        };
        contentGroups: string[];
    };
    hkern: {
        attrsGroups: string[];
        attrs: string[];
    };
    image: {
        attrsGroups: string[];
        attrs: string[];
        defaults: {
            x: string;
            y: string;
            preserveAspectRatio: string;
        };
        contentGroups: string[];
    };
    line: {
        attrsGroups: string[];
        attrs: string[];
        defaults: {
            x1: string;
            y1: string;
            x2: string;
            y2: string;
        };
        contentGroups: string[];
    };
    linearGradient: {
        attrsGroups: string[];
        attrs: string[];
        defaults: {
            x1: string;
            y1: string;
            x2: string;
            y2: string;
            spreadMethod: string;
        };
        contentGroups: string[];
        content: string[];
    };
    marker: {
        attrsGroups: string[];
        attrs: string[];
        defaults: {
            markerUnits: string;
            refX: string;
            refY: string;
            markerWidth: string;
            markerHeight: string;
        };
        contentGroups: string[];
        content: string[];
    };
    mask: {
        attrsGroups: string[];
        attrs: string[];
        defaults: {
            maskUnits: string;
            maskContentUnits: string;
            x: string;
            y: string;
            width: string;
            height: string;
        };
        contentGroups: string[];
        content: string[];
    };
    metadata: {
        attrsGroups: string[];
    };
    'missing-glyph': {
        attrsGroups: string[];
        attrs: string[];
        contentGroups: string[];
        content: string[];
    };
    mpath: {
        attrsGroups: string[];
        attrs: string[];
        contentGroups: string[];
    };
    path: {
        attrsGroups: string[];
        attrs: string[];
        contentGroups: string[];
    };
    pattern: {
        attrsGroups: string[];
        attrs: string[];
        defaults: {
            patternUnits: string;
            patternContentUnits: string;
            x: string;
            y: string;
            width: string;
            height: string;
            preserveAspectRatio: string;
        };
        contentGroups: string[];
        content: string[];
    };
    polygon: {
        attrsGroups: string[];
        attrs: string[];
        contentGroups: string[];
    };
    polyline: {
        attrsGroups: string[];
        attrs: string[];
        contentGroups: string[];
    };
    radialGradient: {
        attrsGroups: string[];
        attrs: string[];
        defaults: {
            gradientUnits: string;
            cx: string;
            cy: string;
            r: string;
        };
        contentGroups: string[];
        content: string[];
    };
    meshGradient: {
        attrsGroups: string[];
        attrs: string[];
        contentGroups: string[];
        content: string[];
    };
    meshRow: {
        attrsGroups: string[];
        attrs: string[];
        contentGroups: string[];
        content: string[];
    };
    meshPatch: {
        attrsGroups: string[];
        attrs: string[];
        contentGroups: string[];
        content: string[];
    };
    rect: {
        attrsGroups: string[];
        attrs: string[];
        defaults: {
            x: string;
            y: string;
        };
        contentGroups: string[];
    };
    script: {
        attrsGroups: string[];
        attrs: string[];
    };
    set: {
        attrsGroups: string[];
        attrs: string[];
        contentGroups: string[];
    };
    solidColor: {
        attrsGroups: string[];
        attrs: string[];
        contentGroups: string[];
    };
    stop: {
        attrsGroups: string[];
        attrs: string[];
        content: string[];
    };
    style: {
        attrsGroups: string[];
        attrs: string[];
        defaults: {
            type: string;
        };
    };
    svg: {
        attrsGroups: string[];
        attrs: string[];
        defaults: {
            x: string;
            y: string;
            width: string;
            height: string;
            preserveAspectRatio: string;
            zoomAndPan: string;
            version: string;
            baseProfile: string;
            contentScriptType: string;
            contentStyleType: string;
        };
        contentGroups: string[];
        content: string[];
    };
    switch: {
        attrsGroups: string[];
        attrs: string[];
        contentGroups: string[];
        content: string[];
    };
    symbol: {
        attrsGroups: string[];
        attrs: string[];
        defaults: {
            refX: number;
            refY: number;
        };
        contentGroups: string[];
        content: string[];
    };
    text: {
        attrsGroups: string[];
        attrs: string[];
        defaults: {
            x: string;
            y: string;
            lengthAdjust: string;
        };
        contentGroups: string[];
        content: string[];
    };
    textPath: {
        attrsGroups: string[];
        attrs: string[];
        defaults: {
            startOffset: string;
            method: string;
            spacing: string;
        };
        contentGroups: string[];
        content: string[];
    };
    title: {
        attrsGroups: string[];
        attrs: string[];
    };
    tref: {
        attrsGroups: string[];
        attrs: string[];
        contentGroups: string[];
        content: string[];
    };
    tspan: {
        attrsGroups: string[];
        attrs: string[];
        contentGroups: string[];
        content: string[];
    };
    use: {
        attrsGroups: string[];
        attrs: string[];
        defaults: {
            x: string;
            y: string;
        };
        contentGroups: string[];
    };
    view: {
        attrsGroups: string[];
        attrs: string[];
        contentGroups: string[];
    };
    vkern: {
        attrsGroups: string[];
        attrs: string[];
    };
};
export declare const editorNamespaces: string[];
export declare const referencesProps: string[];
export declare const inheritableAttrs: string[];
export declare const colorsNames: {
    aliceblue: string;
    antiquewhite: string;
    aqua: string;
    aquamarine: string;
    azure: string;
    beige: string;
    bisque: string;
    black: string;
    blanchedalmond: string;
    blue: string;
    blueviolet: string;
    brown: string;
    burlywood: string;
    cadetblue: string;
    chartreuse: string;
    chocolate: string;
    coral: string;
    cornflowerblue: string;
    cornsilk: string;
    crimson: string;
    cyan: string;
    darkblue: string;
    darkcyan: string;
    darkgoldenrod: string;
    darkgray: string;
    darkgreen: string;
    darkgrey: string;
    darkkhaki: string;
    darkmagenta: string;
    darkolivegreen: string;
    darkorange: string;
    darkorchid: string;
    darkred: string;
    darksalmon: string;
    darkseagreen: string;
    darkslateblue: string;
    darkslategray: string;
    darkslategrey: string;
    darkturquoise: string;
    darkviolet: string;
    deeppink: string;
    deepskyblue: string;
    dimgray: string;
    dimgrey: string;
    dodgerblue: string;
    firebrick: string;
    floralwhite: string;
    forestgreen: string;
    fuchsia: string;
    gainsboro: string;
    ghostwhite: string;
    gold: string;
    goldenrod: string;
    gray: string;
    green: string;
    greenyellow: string;
    grey: string;
    honeydew: string;
    hotpink: string;
    indianred: string;
    indigo: string;
    ivory: string;
    khaki: string;
    lavender: string;
    lavenderblush: string;
    lawngreen: string;
    lemonchiffon: string;
    lightblue: string;
    lightcoral: string;
    lightcyan: string;
    lightgoldenrodyellow: string;
    lightgray: string;
    lightgreen: string;
    lightgrey: string;
    lightpink: string;
    lightsalmon: string;
    lightseagreen: string;
    lightskyblue: string;
    lightslategray: string;
    lightslategrey: string;
    lightsteelblue: string;
    lightyellow: string;
    lime: string;
    limegreen: string;
    linen: string;
    magenta: string;
    maroon: string;
    mediumaquamarine: string;
    mediumblue: string;
    mediumorchid: string;
    mediumpurple: string;
    mediumseagreen: string;
    mediumslateblue: string;
    mediumspringgreen: string;
    mediumturquoise: string;
    mediumvioletred: string;
    midnightblue: string;
    mintcream: string;
    mistyrose: string;
    moccasin: string;
    navajowhite: string;
    navy: string;
    oldlace: string;
    olive: string;
    olivedrab: string;
    orange: string;
    orangered: string;
    orchid: string;
    palegoldenrod: string;
    palegreen: string;
    paleturquoise: string;
    palevioletred: string;
    papayawhip: string;
    peachpuff: string;
    peru: string;
    pink: string;
    plum: string;
    powderblue: string;
    purple: string;
    rebeccapurple: string;
    red: string;
    rosybrown: string;
    royalblue: string;
    saddlebrown: string;
    salmon: string;
    sandybrown: string;
    seagreen: string;
    seashell: string;
    sienna: string;
    silver: string;
    skyblue: string;
    slateblue: string;
    slategray: string;
    slategrey: string;
    snow: string;
    springgreen: string;
    steelblue: string;
    tan: string;
    teal: string;
    thistle: string;
    tomato: string;
    turquoise: string;
    violet: string;
    wheat: string;
    white: string;
    whitesmoke: string;
    yellow: string;
    yellowgreen: string;
};
export declare const colorsShortNames: {
    '#f0ffff': string;
    '#f5f5dc': string;
    '#ffe4c4': string;
    '#a52a2a': string;
    '#ff7f50': string;
    '#ffd700': string;
    '#808080': string;
    '#008000': string;
    '#4b0082': string;
    '#fffff0': string;
    '#f0e68c': string;
    '#faf0e6': string;
    '#800000': string;
    '#000080': string;
    '#808000': string;
    '#ffa500': string;
    '#da70d6': string;
    '#cd853f': string;
    '#ffc0cb': string;
    '#dda0dd': string;
    '#800080': string;
    '#f00': string;
    '#ff0000': string;
    '#fa8072': string;
    '#a0522d': string;
    '#c0c0c0': string;
    '#fffafa': string;
    '#d2b48c': string;
    '#008080': string;
    '#ff6347': string;
    '#ee82ee': string;
    '#f5deb3': string;
};
export declare const colorsProps: string[];
