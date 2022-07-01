var Processing = {};

Processing.btoa = function (str) {
    let i;

    str = str.toString();

    let out = "";
    for (i = 0; i < str.length; i += 3) {
        const groupsOfSix = [undefined, undefined, undefined, undefined];
        groupsOfSix[0] = str.charCodeAt(i) >> 2;
        groupsOfSix[1] = (str.charCodeAt(i) & 0x03) << 4;
        if (str.length > i + 1) {
            groupsOfSix[1] |= str.charCodeAt(i + 1) >> 4;
            groupsOfSix[2] = (str.charCodeAt(i + 1) & 0x0f) << 2;
        }
        if (str.length > i + 2) {
            groupsOfSix[2] |= str.charCodeAt(i + 2) >> 6;
            groupsOfSix[3] = str.charCodeAt(i + 2) & 0x3f;
        }
        for (let j = 0; j < groupsOfSix.length; j++) {
            if (typeof groupsOfSix[j] === "undefined") {
                out += "=";
            } else {
                var index = groupsOfSix[j];
                if (index >= 0 && index < 64) {
                    out += Processing.utils.Base64._keyStr[index];
                } else {
                    out += undefined;
                }
            }
        }
    }
    return out;
};

Processing.atob = function (str) {
    var digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        a, b, c, x, y,
        result = [];

    for (var i = 0; i < str.length; result.push(a, b, c)) {
        x = digits.indexOf(str[i++]);
        y = digits.indexOf(str[i++]);
        a = x << 2 | y >> 4;
        x = digits.indexOf(str[i++]);
        b = (y & 0x0f) << 4 | x >> 2;
        y = digits.indexOf(str[i++]);
        c = (x & 3) << 6 | y;
    }

    var out = "";
    for (var i = 0; i < result.length; i++) {
        var v = result[i];
        if (v >= 0) {
            out += String.fromCharCode(v);
        }
    }

    return out;
};

Processing.PConstants = {
    NX: 9,
    NY: 10,
    NZ: 11,

    EDGE: 12,

    // Stroke
    SR: 13,
    SG: 14,
    SB: 15,
    SA: 16,

    SW: 17,

    // Transformations (2D and 3D)
    TX: 18,
    TY: 19,
    TZ: 20,

    VX: 21,
    VY: 22,
    VZ: 23,
    VW: 24,

    // Material properties
    AR: 25,
    AG: 26,
    AB: 27,

    DR: 3,
    DG: 4,
    DB: 5,
    DA: 6,

    SPR: 28,
    SPG: 29,
    SPB: 30,

    SHINE: 31,

    ER: 32,
    EG: 33,
    EB: 34,

    BEEN_LIT: 35,

    VERTEX_FIELD_COUNT: 36,

    // Renderers
    P2D:    1,
    JAVA2D: 1,
    WEBGL:  2,
    P3D:    2,
    OPENGL: 2,
    PDF:    0,
    DXF:    0,

    // Platform IDs
    OTHER:   0,
    WINDOWS: 1,
    MAXOSX:  2,
    LINUX:   3,

    EPSILON: 0.0001,

    MAX_FLOAT:  3.4028235e+38,
    MIN_FLOAT: -3.4028235e+38,
    MAX_INT:    2147483647,
    MIN_INT:   -2147483648,

    PI:         Math.PI,
    TWO_PI:     2 * Math.PI,
    HALF_PI:    Math.PI / 2,
    THIRD_PI:   Math.PI / 3,
    QUARTER_PI: Math.PI / 4,
    TAU:        2 * Math.PI,

    DEG_TO_RAD: Math.PI / 180,
    RAD_TO_DEG: 180 / Math.PI,

    WHITESPACE: " \t\n\r\f\u00A0",

    // Color modes
    RGB:   1,
    ARGB:  2,
    HSB:   3,
    ALPHA: 4,
    CMYK:  5,

    // Image file types
    TIFF:  0,
    TARGA: 1,
    JPEG:  2,
    GIF:   3,

    // Filter/convert types
    BLUR:      11,
    GRAY:      12,
    INVERT:    13,
    OPAQUE:    14,
    POSTERIZE: 15,
    THRESHOLD: 16,
    ERODE:     17,
    DILATE:    18,

    // Blend modes
    REPLACE:    0,
    BLEND:      1 << 0,
    ADD:        1 << 1,
    SUBTRACT:   1 << 2,
    LIGHTEST:   1 << 3,
    DARKEST:    1 << 4,
    DIFFERENCE: 1 << 5,
    EXCLUSION:  1 << 6,
    MULTIPLY:   1 << 7,
    SCREEN:     1 << 8,
    OVERLAY:    1 << 9,
    HARD_LIGHT: 1 << 10,
    SOFT_LIGHT: 1 << 11,
    DODGE:      1 << 12,
    BURN:       1 << 13,

    // Color component bit masks
    ALPHA_MASK: 0xff000000,
    RED_MASK:   0x00ff0000,
    GREEN_MASK: 0x0000ff00,
    BLUE_MASK:  0x000000ff,

    // Projection matrices
    CUSTOM:       0,
    ORTHOGRAPHIC: 2,
    PERSPECTIVE:  3,

    // Shapes
    POINT:          2,
    POINTS:         2,
    LINE:           4,
    LINES:          4,
    TRIANGLE:       8,
    TRIANGLES:      9,
    TRIANGLE_STRIP: 10,
    TRIANGLE_FAN:   11,
    QUAD:           16,
    QUADS:          16,
    QUAD_STRIP:     17,
    POLYGON:        20,
    PATH:           21,
    RECT:           30,
    ELLIPSE:        31,
    ARC:            32,
    SPHERE:         40,
    BOX:            41,

    GROUP:          0,
    PRIMITIVE:      1,
    //PATH:         21, // shared with Shape PATH
    GEOMETRY:       3,

    // Shape Vertex
    VERTEX:        0,
    BEZIER_VERTEX: 1,
    CURVE_VERTEX:  2,
    BREAK:         3,
    CLOSESHAPE:    4,

    // Shape closing modes
    OPEN:  1,
    CLOSE: 2,

    // Shape drawing modes
    CORNER:          0, // Draw mode convention to use (x, y) to (width, height)
    CORNERS:         1, // Draw mode convention to use (x1, y1) to (x2, y2) coordinates
    RADIUS:          2, // Draw mode from the center, and using the radius
    CENTER_RADIUS:   2, // Deprecated! Use RADIUS instead
    CENTER:          3, // Draw from the center, using second pair of values as the diameter
    DIAMETER:        3, // Synonym for the CENTER constant. Draw from the center
    CENTER_DIAMETER: 3, // Deprecated! Use DIAMETER instead

    // Text vertical alignment modes
    BASELINE: 0,   // Default vertical alignment for text placement
    TOP:      101, // Align text to the top
    BOTTOM:   102, // Align text from the bottom, using the baseline

    // UV Texture coordinate modes
    NORMAL:     1,
    NORMALIZED: 1,
    IMAGE:      2,

    // Text placement modes
    MODEL: 4,
    SHAPE: 5,

    // Stroke modes
    SQUARE:  'butt',
    ROUND:   'round',
    PROJECT: 'square',
    MITER:   'miter',
    BEVEL:   'bevel',

    // Lighting modes
    AMBIENT:     0,
    DIRECTIONAL: 1,
    //POINT:     2, Shared with Shape constant
    SPOT:        3,

    // Key constants

    // Both key and keyCode will be equal to these values
    BACKSPACE: 8,
    TAB:       9,
    ENTER:     10,
    RETURN:    13,
    ESC:       27,
    DELETE:    127,
    CODED:     0xffff,

    // p.key will be CODED and p.keyCode will be this value
    SHIFT:     16,
    CONTROL:   17,
    ALT:       18,
    CAPSLK:    20,
    PGUP:      33,
    PGDN:      34,
    END:       35,
    HOME:      36,
    LEFT:      37,
    UP:        38,
    RIGHT:     39,
    DOWN:      40,
    F1:        112,
    F2:        113,
    F3:        114,
    F4:        115,
    F5:        116,
    F6:        117,
    F7:        118,
    F8:        119,
    F9:        120,
    F10:       121,
    F11:       122,
    F12:       123,
    NUMLK:     144,
    META:      157,
    INSERT:    155,

    // Cursor types
    ARROW:    'default',
    CROSS:    'crosshair',
    HAND:     'pointer',
    MOVE:     'move',
    TEXT:     'text',
    WAIT:     'wait',
    NOCURSOR: "url('data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='), auto",

    // Hints
    DISABLE_OPENGL_2X_SMOOTH:     1,
    ENABLE_OPENGL_2X_SMOOTH:     -1,
    ENABLE_OPENGL_4X_SMOOTH:      2,
    ENABLE_NATIVE_FONTS:          3,
    DISABLE_DEPTH_TEST:           4,
    ENABLE_DEPTH_TEST:           -4,
    ENABLE_DEPTH_SORT:            5,
    DISABLE_DEPTH_SORT:          -5,
    DISABLE_OPENGL_ERROR_REPORT:  6,
    ENABLE_OPENGL_ERROR_REPORT:  -6,
    ENABLE_ACCURATE_TEXTURES:     7,
    DISABLE_ACCURATE_TEXTURES:   -7,
    HINT_COUNT:                  10,

    // PJS defined constants
    SINCOS_LENGTH:      720, // every half degree
    PRECISIONB:         15, // fixed point precision is limited to 15 bits!!
    PRECISIONF:         1 << 15,
    PREC_MAXVAL:        (1 << 15) - 1,
    PREC_ALPHA_SHIFT:   24 - 15,
    PREC_RED_SHIFT:     16 - 15,
    NORMAL_MODE_AUTO:   0,
    NORMAL_MODE_SHAPE:  1,
    NORMAL_MODE_VERTEX: 2,
    MAX_LIGHTS:         8
};

Processing.utils = {
    Base64: {
        _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;
            input = Base64._utf8_encode(input.toString());
            while (i < input.length) {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
                output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
            }
            return output;
        },
        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
            while (i < input.length) {
                enc1 = this._keyStr.indexOf(input.charAt(i++));
                enc2 = this._keyStr.indexOf(input.charAt(i++));
                enc3 = this._keyStr.indexOf(input.charAt(i++));
                enc4 = this._keyStr.indexOf(input.charAt(i++));
                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;
                output = output + String.fromCharCode(chr1);
                if (enc3 !== 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 !== 64) {
                    output = output + String.fromCharCode(chr3);
                }
            }
            output = Processing.utils.Base64._utf8_decode(output);
            return output;
        },
        _utf8_encode: function (string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";
            for (var n = 0; n < string.length; n++) {
                var c = string.charCodeAt(n);
                if (c < 128) {
                    utftext += String.fromCharCode(c);
                } else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
            }
            return utftext;
        },
        _utf8_decode: function (utftext) {
            var string = "";
            var i = 0;
            var c = 0,
                c1 = 0,
                c2 = 0,
                c3 = 0;
            while (i < utftext.length) {
                c = utftext.charCodeAt(i);
                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                } else if ((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i + 1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                } else {
                    c2 = utftext.charCodeAt(i + 1);
                    c3 = utftext.charCodeAt(i + 2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }
            }
            return string;
        }
    },

    JPEGEncoder: function (quality) {
        var self = this;
        var fround = Math.round;
        var ffloor = Math.floor;
        var YTable = new Array(64);
        var UVTable = new Array(64);
        var fdtbl_Y = new Array(64);
        var fdtbl_UV = new Array(64);
        var YDC_HT;
        var UVDC_HT;
        var YAC_HT;
        var UVAC_HT;

        var bitcode = new Array(65535);
        var category = new Array(65535);
        var outputfDCTQuant = new Array(64);
        var DU = new Array(64);
        var byteout = [];
        var bytenew = 0;
        var bytepos = 7;

        var YDU = new Array(64);
        var UDU = new Array(64);
        var VDU = new Array(64);
        var clt = new Array(256);
        var RGB_YUV_TABLE = new Array(2048);
        var currentQuality;

        var ZigZag = [
            0, 1, 5, 6, 14, 15, 27, 28,
            2, 4, 7, 13, 16, 26, 29, 42,
            3, 8, 12, 17, 25, 30, 41, 43,
            9, 11, 18, 24, 31, 40, 44, 53,
            10, 19, 23, 32, 39, 45, 52, 54,
            20, 22, 33, 38, 46, 51, 55, 60,
            21, 34, 37, 47, 50, 56, 59, 61,
            35, 36, 48, 49, 57, 58, 62, 63
        ];

        var std_dc_luminance_nrcodes = [0, 0, 1, 5, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0];
        var std_dc_luminance_values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        var std_ac_luminance_nrcodes = [0, 0, 2, 1, 3, 3, 2, 4, 3, 5, 5, 4, 4, 0, 0, 1, 0x7d];
        var std_ac_luminance_values = [
            0x01, 0x02, 0x03, 0x00, 0x04, 0x11, 0x05, 0x12,
            0x21, 0x31, 0x41, 0x06, 0x13, 0x51, 0x61, 0x07,
            0x22, 0x71, 0x14, 0x32, 0x81, 0x91, 0xa1, 0x08,
            0x23, 0x42, 0xb1, 0xc1, 0x15, 0x52, 0xd1, 0xf0,
            0x24, 0x33, 0x62, 0x72, 0x82, 0x09, 0x0a, 0x16,
            0x17, 0x18, 0x19, 0x1a, 0x25, 0x26, 0x27, 0x28,
            0x29, 0x2a, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39,
            0x3a, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49,
            0x4a, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59,
            0x5a, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69,
            0x6a, 0x73, 0x74, 0x75, 0x76, 0x77, 0x78, 0x79,
            0x7a, 0x83, 0x84, 0x85, 0x86, 0x87, 0x88, 0x89,
            0x8a, 0x92, 0x93, 0x94, 0x95, 0x96, 0x97, 0x98,
            0x99, 0x9a, 0xa2, 0xa3, 0xa4, 0xa5, 0xa6, 0xa7,
            0xa8, 0xa9, 0xaa, 0xb2, 0xb3, 0xb4, 0xb5, 0xb6,
            0xb7, 0xb8, 0xb9, 0xba, 0xc2, 0xc3, 0xc4, 0xc5,
            0xc6, 0xc7, 0xc8, 0xc9, 0xca, 0xd2, 0xd3, 0xd4,
            0xd5, 0xd6, 0xd7, 0xd8, 0xd9, 0xda, 0xe1, 0xe2,
            0xe3, 0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9, 0xea,
            0xf1, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7, 0xf8,
            0xf9, 0xfa
        ];

        var std_dc_chrominance_nrcodes = [0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0];
        var std_dc_chrominance_values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        var std_ac_chrominance_nrcodes = [0, 0, 2, 1, 2, 4, 4, 3, 4, 7, 5, 4, 4, 0, 1, 2, 0x77];
        var std_ac_chrominance_values = [
            0x00, 0x01, 0x02, 0x03, 0x11, 0x04, 0x05, 0x21,
            0x31, 0x06, 0x12, 0x41, 0x51, 0x07, 0x61, 0x71,
            0x13, 0x22, 0x32, 0x81, 0x08, 0x14, 0x42, 0x91,
            0xa1, 0xb1, 0xc1, 0x09, 0x23, 0x33, 0x52, 0xf0,
            0x15, 0x62, 0x72, 0xd1, 0x0a, 0x16, 0x24, 0x34,
            0xe1, 0x25, 0xf1, 0x17, 0x18, 0x19, 0x1a, 0x26,
            0x27, 0x28, 0x29, 0x2a, 0x35, 0x36, 0x37, 0x38,
            0x39, 0x3a, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48,
            0x49, 0x4a, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58,
            0x59, 0x5a, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68,
            0x69, 0x6a, 0x73, 0x74, 0x75, 0x76, 0x77, 0x78,
            0x79, 0x7a, 0x82, 0x83, 0x84, 0x85, 0x86, 0x87,
            0x88, 0x89, 0x8a, 0x92, 0x93, 0x94, 0x95, 0x96,
            0x97, 0x98, 0x99, 0x9a, 0xa2, 0xa3, 0xa4, 0xa5,
            0xa6, 0xa7, 0xa8, 0xa9, 0xaa, 0xb2, 0xb3, 0xb4,
            0xb5, 0xb6, 0xb7, 0xb8, 0xb9, 0xba, 0xc2, 0xc3,
            0xc4, 0xc5, 0xc6, 0xc7, 0xc8, 0xc9, 0xca, 0xd2,
            0xd3, 0xd4, 0xd5, 0xd6, 0xd7, 0xd8, 0xd9, 0xda,
            0xe2, 0xe3, 0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9,
            0xea, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7, 0xf8,
            0xf9, 0xfa
        ];

        function initQuantTables(sf) {
            var YQT = [
                16, 11, 10, 16, 24, 40, 51, 61,
                12, 12, 14, 19, 26, 58, 60, 55,
                14, 13, 16, 24, 40, 57, 69, 56,
                14, 17, 22, 29, 51, 87, 80, 62,
                18, 22, 37, 56, 68, 109, 103, 77,
                24, 35, 55, 64, 81, 104, 113, 92,
                49, 64, 78, 87, 103, 121, 120, 101,
                72, 92, 95, 98, 112, 100, 103, 99
            ];

            for (var i = 0; i < 64; i++) {
                var t = ffloor((YQT[i] * sf + 50) / 100);
                if (t < 1) {
                    t = 1;
                } else if (t > 255) {
                    t = 255;
                }
                YTable[ZigZag[i]] = t;
            }
            var UVQT = [
                17, 18, 24, 47, 99, 99, 99, 99,
                18, 21, 26, 66, 99, 99, 99, 99,
                24, 26, 56, 99, 99, 99, 99, 99,
                47, 66, 99, 99, 99, 99, 99, 99,
                99, 99, 99, 99, 99, 99, 99, 99,
                99, 99, 99, 99, 99, 99, 99, 99,
                99, 99, 99, 99, 99, 99, 99, 99,
                99, 99, 99, 99, 99, 99, 99, 99
            ];
            for (var j = 0; j < 64; j++) {
                var u = ffloor((UVQT[j] * sf + 50) / 100);
                if (u < 1) {
                    u = 1;
                } else if (u > 255) {
                    u = 255;
                }
                UVTable[ZigZag[j]] = u;
            }
            var aasf = [
                1.0, 1.387039845, 1.306562965, 1.175875602,
                1.0, 0.785694958, 0.541196100, 0.275899379
            ];
            var k = 0;
            for (var row = 0; row < 8; row++) {
                for (var col = 0; col < 8; col++) {
                    fdtbl_Y[k] = (1.0 / (YTable[ZigZag[k]] * aasf[row] * aasf[col] * 8.0));
                    fdtbl_UV[k] = (1.0 / (UVTable[ZigZag[k]] * aasf[row] * aasf[col] * 8.0));
                    k++;
                }
            }
        }

        function computeHuffmanTbl(nrcodes, std_table) {
            var codevalue = 0;
            var pos_in_table = 0;
            var HT = new Array();
            for (var k = 1; k <= 16; k++) {
                for (var j = 1; j <= nrcodes[k]; j++) {
                    HT[std_table[pos_in_table]] = [];
                    HT[std_table[pos_in_table]][0] = codevalue;
                    HT[std_table[pos_in_table]][1] = k;
                    pos_in_table++;
                    codevalue++;
                }
                codevalue *= 2;
            }
            return HT;
        }

        function initHuffmanTbl() {
            YDC_HT = computeHuffmanTbl(std_dc_luminance_nrcodes, std_dc_luminance_values);
            UVDC_HT = computeHuffmanTbl(std_dc_chrominance_nrcodes, std_dc_chrominance_values);
            YAC_HT = computeHuffmanTbl(std_ac_luminance_nrcodes, std_ac_luminance_values);
            UVAC_HT = computeHuffmanTbl(std_ac_chrominance_nrcodes, std_ac_chrominance_values);
        }

        function initCategoryNumber() {
            var nrlower = 1;
            var nrupper = 2;
            for (var cat = 1; cat <= 15; cat++) {
                //Positive numbers
                for (var nr = nrlower; nr < nrupper; nr++) {
                    category[32767 + nr] = cat;
                    bitcode[32767 + nr] = [];
                    bitcode[32767 + nr][1] = cat;
                    bitcode[32767 + nr][0] = nr;
                }
                //Negative numbers
                for (var nrneg = -(nrupper - 1); nrneg <= -nrlower; nrneg++) {
                    category[32767 + nrneg] = cat;
                    bitcode[32767 + nrneg] = [];
                    bitcode[32767 + nrneg][1] = cat;
                    bitcode[32767 + nrneg][0] = nrupper - 1 + nrneg;
                }
                nrlower <<= 1;
                nrupper <<= 1;
            }
        }

        function initRGBYUVTable() {
            for (var i = 0; i < 256; i++) {
                RGB_YUV_TABLE[i] = 19595 * i;
                RGB_YUV_TABLE[(i + 256) >> 0] = 38470 * i;
                RGB_YUV_TABLE[(i + 512) >> 0] = 7471 * i + 0x8000;
                RGB_YUV_TABLE[(i + 768) >> 0] = -11059 * i;
                RGB_YUV_TABLE[(i + 1024) >> 0] = -21709 * i;
                RGB_YUV_TABLE[(i + 1280) >> 0] = 32768 * i + 0x807FFF;
                RGB_YUV_TABLE[(i + 1536) >> 0] = -27439 * i;
                RGB_YUV_TABLE[(i + 1792) >> 0] = -5329 * i;
            }
        }

        // IO functions
        function writeBits(bs) {
            var value = bs[0];
            var posval = bs[1] - 1;
            while (posval >= 0) {
                if (value & (1 << posval)) {
                    bytenew |= (1 << bytepos);
                }
                posval--;
                bytepos--;
                if (bytepos < 0) {
                    if (bytenew == 0xFF) {
                        writeByte(0xFF);
                        writeByte(0);
                    } else {
                        writeByte(bytenew);
                    }
                    bytepos = 7;
                    bytenew = 0;
                }
            }
        }

        function writeByte(value) {
            //byteout.push(clt[value]); // write char directly instead of converting later
            byteout.push(value);
        }

        function writeWord(value) {
            writeByte((value >> 8) & 0xFF);
            writeByte((value) & 0xFF);
        }

        // DCT & quantization core
        function fDCTQuant(data, fdtbl) {
            var d0, d1, d2, d3, d4, d5, d6, d7;
            /* Pass 1: process rows. */
            var dataOff = 0;
            var i;
            var I8 = 8;
            var I64 = 64;
            for (i = 0; i < I8; ++i) {
                d0 = data[dataOff];
                d1 = data[dataOff + 1];
                d2 = data[dataOff + 2];
                d3 = data[dataOff + 3];
                d4 = data[dataOff + 4];
                d5 = data[dataOff + 5];
                d6 = data[dataOff + 6];
                d7 = data[dataOff + 7];

                var tmp0 = d0 + d7;
                var tmp7 = d0 - d7;
                var tmp1 = d1 + d6;
                var tmp6 = d1 - d6;
                var tmp2 = d2 + d5;
                var tmp5 = d2 - d5;
                var tmp3 = d3 + d4;
                var tmp4 = d3 - d4;

                /* Even part */
                var tmp10 = tmp0 + tmp3; /* phase 2 */
                var tmp13 = tmp0 - tmp3;
                var tmp11 = tmp1 + tmp2;
                var tmp12 = tmp1 - tmp2;

                data[dataOff] = tmp10 + tmp11; /* phase 3 */
                data[dataOff + 4] = tmp10 - tmp11;

                var z1 = (tmp12 + tmp13) * 0.707106781; /* c4 */
                data[dataOff + 2] = tmp13 + z1; /* phase 5 */
                data[dataOff + 6] = tmp13 - z1;

                /* Odd part */
                tmp10 = tmp4 + tmp5; /* phase 2 */
                tmp11 = tmp5 + tmp6;
                tmp12 = tmp6 + tmp7;

                /* The rotator is modified from fig 4-8 to avoid extra negations. */
                var z5 = (tmp10 - tmp12) * 0.382683433; /* c6 */
                var z2 = 0.541196100 * tmp10 + z5; /* c2-c6 */
                var z4 = 1.306562965 * tmp12 + z5; /* c2+c6 */
                var z3 = tmp11 * 0.707106781; /* c4 */

                var z11 = tmp7 + z3; /* phase 5 */
                var z13 = tmp7 - z3;

                data[dataOff + 5] = z13 + z2; /* phase 6 */
                data[dataOff + 3] = z13 - z2;
                data[dataOff + 1] = z11 + z4;
                data[dataOff + 7] = z11 - z4;

                dataOff += 8; /* advance pointer to next row */
            }

            /* Pass 2: process columns. */
            dataOff = 0;
            for (i = 0; i < I8; ++i) {
                d0 = data[dataOff];
                d1 = data[dataOff + 8];
                d2 = data[dataOff + 16];
                d3 = data[dataOff + 24];
                d4 = data[dataOff + 32];
                d5 = data[dataOff + 40];
                d6 = data[dataOff + 48];
                d7 = data[dataOff + 56];

                var tmp0p2 = d0 + d7;
                var tmp7p2 = d0 - d7;
                var tmp1p2 = d1 + d6;
                var tmp6p2 = d1 - d6;
                var tmp2p2 = d2 + d5;
                var tmp5p2 = d2 - d5;
                var tmp3p2 = d3 + d4;
                var tmp4p2 = d3 - d4;

                /* Even part */
                var tmp10p2 = tmp0p2 + tmp3p2; /* phase 2 */
                var tmp13p2 = tmp0p2 - tmp3p2;
                var tmp11p2 = tmp1p2 + tmp2p2;
                var tmp12p2 = tmp1p2 - tmp2p2;

                data[dataOff] = tmp10p2 + tmp11p2; /* phase 3 */
                data[dataOff + 32] = tmp10p2 - tmp11p2;

                var z1p2 = (tmp12p2 + tmp13p2) * 0.707106781; /* c4 */
                data[dataOff + 16] = tmp13p2 + z1p2; /* phase 5 */
                data[dataOff + 48] = tmp13p2 - z1p2;

                /* Odd part */
                tmp10p2 = tmp4p2 + tmp5p2; /* phase 2 */
                tmp11p2 = tmp5p2 + tmp6p2;
                tmp12p2 = tmp6p2 + tmp7p2;

                /* The rotator is modified from fig 4-8 to avoid extra negations. */
                var z5p2 = (tmp10p2 - tmp12p2) * 0.382683433; /* c6 */
                var z2p2 = 0.541196100 * tmp10p2 + z5p2; /* c2-c6 */
                var z4p2 = 1.306562965 * tmp12p2 + z5p2; /* c2+c6 */
                var z3p2 = tmp11p2 * 0.707106781; /* c4 */

                var z11p2 = tmp7p2 + z3p2; /* phase 5 */
                var z13p2 = tmp7p2 - z3p2;

                data[dataOff + 40] = z13p2 + z2p2; /* phase 6 */
                data[dataOff + 24] = z13p2 - z2p2;
                data[dataOff + 8] = z11p2 + z4p2;
                data[dataOff + 56] = z11p2 - z4p2;

                dataOff++; /* advance pointer to next column */
            }

            // Quantize/descale the coefficients
            var fDCTQuant;
            for (i = 0; i < I64; ++i) {
                // Apply the quantization and scaling factor & Round to nearest integer
                fDCTQuant = data[i] * fdtbl[i];
                outputfDCTQuant[i] = (fDCTQuant > 0.0) ? ((fDCTQuant + 0.5) | 0) : ((fDCTQuant - 0.5) | 0);
                //outputfDCTQuant[i] = fround(fDCTQuant);

            }
            return outputfDCTQuant;
        }

        function writeAPP0() {
            writeWord(0xFFE0); // marker
            writeWord(16); // length
            writeByte(0x4A); // J
            writeByte(0x46); // F
            writeByte(0x49); // I
            writeByte(0x46); // F
            writeByte(0); // = "JFIF",'\0'
            writeByte(1); // versionhi
            writeByte(1); // versionlo
            writeByte(0); // xyunits
            writeWord(1); // xdensity
            writeWord(1); // ydensity
            writeByte(0); // thumbnwidth
            writeByte(0); // thumbnheight
        }

        function writeAPP1(exifBuffer) {
            if (!exifBuffer) return;

            writeWord(0xFFE1); // APP1 marker

            if (exifBuffer[0] === 0x45 &&
                exifBuffer[1] === 0x78 &&
                exifBuffer[2] === 0x69 &&
                exifBuffer[3] === 0x66) {
                // Buffer already starts with EXIF, just use it directly
                writeWord(exifBuffer.length + 2); // length is buffer + length itself!
            } else {
                // Buffer doesn't start with EXIF, write it for them
                writeWord(exifBuffer.length + 5 + 2); // length is buffer + EXIF\0 + length itself!
                writeByte(0x45); // E
                writeByte(0x78); // X
                writeByte(0x69); // I
                writeByte(0x66); // F
                writeByte(0); // = "EXIF",'\0'
            }

            for (var i = 0; i < exifBuffer.length; i++) {
                writeByte(exifBuffer[i]);
            }
        }

        function writeSOF0(width, height) {
            writeWord(0xFFC0); // marker
            writeWord(17); // length, truecolor YUV JPG
            writeByte(8); // precision
            writeWord(height);
            writeWord(width);
            writeByte(3); // nrofcomponents
            writeByte(1); // IdY
            writeByte(0x11); // HVY
            writeByte(0); // QTY
            writeByte(2); // IdU
            writeByte(0x11); // HVU
            writeByte(1); // QTU
            writeByte(3); // IdV
            writeByte(0x11); // HVV
            writeByte(1); // QTV
        }

        function writeDQT() {
            writeWord(0xFFDB); // marker
            writeWord(132); // length
            writeByte(0);
            for (var i = 0; i < 64; i++) {
                writeByte(YTable[i]);
            }
            writeByte(1);
            for (var j = 0; j < 64; j++) {
                writeByte(UVTable[j]);
            }
        }

        function writeDHT() {
            writeWord(0xFFC4); // marker
            writeWord(0x01A2); // length

            writeByte(0); // HTYDCinfo
            for (var i = 0; i < 16; i++) {
                writeByte(std_dc_luminance_nrcodes[i + 1]);
            }
            for (var j = 0; j <= 11; j++) {
                writeByte(std_dc_luminance_values[j]);
            }

            writeByte(0x10); // HTYACinfo
            for (var k = 0; k < 16; k++) {
                writeByte(std_ac_luminance_nrcodes[k + 1]);
            }
            for (var l = 0; l <= 161; l++) {
                writeByte(std_ac_luminance_values[l]);
            }

            writeByte(1); // HTUDCinfo
            for (var m = 0; m < 16; m++) {
                writeByte(std_dc_chrominance_nrcodes[m + 1]);
            }
            for (var n = 0; n <= 11; n++) {
                writeByte(std_dc_chrominance_values[n]);
            }

            writeByte(0x11); // HTUACinfo
            for (var o = 0; o < 16; o++) {
                writeByte(std_ac_chrominance_nrcodes[o + 1]);
            }
            for (var p = 0; p <= 161; p++) {
                writeByte(std_ac_chrominance_values[p]);
            }
        }

        function writeCOM(comments) {
            if (typeof comments === "undefined" || comments.constructor !== Array) return;
            comments.forEach(e => {
                if (typeof e !== "string") return;
                writeWord(0xFFFE); // marker
                var l = e.length;
                writeWord(l + 2); // length itself as well
                var i;
                for (i = 0; i < l; i++)
                    writeByte(e.charCodeAt(i));
            });
        }

        function writeSOS() {
            writeWord(0xFFDA); // marker
            writeWord(12); // length
            writeByte(3); // nrofcomponents
            writeByte(1); // IdY
            writeByte(0); // HTY
            writeByte(2); // IdU
            writeByte(0x11); // HTU
            writeByte(3); // IdV
            writeByte(0x11); // HTV
            writeByte(0); // Ss
            writeByte(0x3f); // Se
            writeByte(0); // Bf
        }

        function processDU(CDU, fdtbl, DC, HTDC, HTAC) {
            var EOB = HTAC[0x00];
            var M16zeroes = HTAC[0xF0];
            var pos;
            var I16 = 16;
            var I63 = 63;
            var I64 = 64;
            var DU_DCT = fDCTQuant(CDU, fdtbl);
            //ZigZag reorder
            for (var j = 0; j < I64; ++j) {
                DU[ZigZag[j]] = DU_DCT[j];
            }
            var Diff = DU[0] - DC;
            DC = DU[0];
            //Encode DC
            if (Diff == 0) {
                writeBits(HTDC[0]); // Diff might be 0
            } else {
                pos = 32767 + Diff;
                writeBits(HTDC[category[pos]]);
                writeBits(bitcode[pos]);
            }
            //Encode ACs
            var end0pos = 63; // was const... which is crazy
            for (;
                (end0pos > 0) && (DU[end0pos] == 0); end0pos--) {};
            //end0pos = first element in reverse order !=0
            if (end0pos == 0) {
                writeBits(EOB);
                return DC;
            }
            var i = 1;
            var lng;
            while (i <= end0pos) {
                var startpos = i;
                for (;
                    (DU[i] == 0) && (i <= end0pos); ++i) {}
                var nrzeroes = i - startpos;
                if (nrzeroes >= I16) {
                    lng = nrzeroes >> 4;
                    for (var nrmarker = 1; nrmarker <= lng; ++nrmarker)
                        writeBits(M16zeroes);
                    nrzeroes = nrzeroes & 0xF;
                }
                pos = 32767 + DU[i];
                writeBits(HTAC[(nrzeroes << 4) + category[pos]]);
                writeBits(bitcode[pos]);
                i++;
            }
            if (end0pos != I63) {
                writeBits(EOB);
            }
            return DC;
        }

        function initCharLookupTable() {
            var sfcc = String.fromCharCode;
            for (var i = 0; i < 256; i++) { ///// ACHTUNG // 255
                clt[i] = sfcc(i);
            }
        }

        this.encode = function (image, quality) // image data object
        {
            var time_start = new Date().getTime();

            if (quality) setQuality(quality);

            // Initialize bit writer
            byteout = new Array();
            bytenew = 0;
            bytepos = 7;

            // Add JPEG headers
            writeWord(0xFFD8); // SOI
            writeAPP0();
            writeCOM(image.comments);
            writeAPP1(image.exifBuffer);
            writeDQT();
            writeSOF0(image.width, image.height);
            writeDHT();
            writeSOS();


            // Encode 8x8 macroblocks
            var DCY = 0;
            var DCU = 0;
            var DCV = 0;

            bytenew = 0;
            bytepos = 7;


            this.encode.displayName = "_encode_";

            var imageData = image.data;
            var width = image.width;
            var height = image.height;

            var quadWidth = width * 4;
            var tripleWidth = width * 3;

            var x, y = 0;
            var r, g, b;
            var start, p, col, row, pos;
            while (y < height) {
                x = 0;
                while (x < quadWidth) {
                    start = quadWidth * y + x;
                    p = start;
                    col = -1;
                    row = 0;

                    for (pos = 0; pos < 64; pos++) {
                        row = pos >> 3; // /8
                        col = (pos & 7) * 4; // %8
                        p = start + (row * quadWidth) + col;

                        if (y + row >= height) { // padding bottom
                            p -= (quadWidth * (y + 1 + row - height));
                        }

                        if (x + col >= quadWidth) { // padding right	
                            p -= ((x + col) - quadWidth + 4)
                        }

                        r = imageData[p++];
                        g = imageData[p++];
                        b = imageData[p++];


                        /* // calculate YUV values dynamically
                        YDU[pos]=((( 0.29900)*r+( 0.58700)*g+( 0.11400)*b))-128; //-0x80
                        UDU[pos]=(((-0.16874)*r+(-0.33126)*g+( 0.50000)*b));
                        VDU[pos]=((( 0.50000)*r+(-0.41869)*g+(-0.08131)*b));
                        */

                        // use lookup table (slightly faster)
                        YDU[pos] = ((RGB_YUV_TABLE[r] + RGB_YUV_TABLE[(g + 256) >> 0] + RGB_YUV_TABLE[(b + 512) >> 0]) >> 16) - 128;
                        UDU[pos] = ((RGB_YUV_TABLE[(r + 768) >> 0] + RGB_YUV_TABLE[(g + 1024) >> 0] + RGB_YUV_TABLE[(b + 1280) >> 0]) >> 16) - 128;
                        VDU[pos] = ((RGB_YUV_TABLE[(r + 1280) >> 0] + RGB_YUV_TABLE[(g + 1536) >> 0] + RGB_YUV_TABLE[(b + 1792) >> 0]) >> 16) - 128;

                    }

                    DCY = processDU(YDU, fdtbl_Y, DCY, YDC_HT, YAC_HT);
                    DCU = processDU(UDU, fdtbl_UV, DCU, UVDC_HT, UVAC_HT);
                    DCV = processDU(VDU, fdtbl_UV, DCV, UVDC_HT, UVAC_HT);
                    x += 32;
                }
                y += 8;
            }


            ////////////////////////////////////////////////////////////////

            // Do the bit alignment of the EOI marker
            if (bytepos >= 0) {
                var fillbits = [];
                fillbits[1] = bytepos + 1;
                fillbits[0] = (1 << (bytepos + 1)) - 1;
                writeBits(fillbits);
            }

            writeWord(0xFFD9); //EOI

            if (typeof module === 'undefined') return new Uint8Array(byteout);
            return Buffer.from(byteout);

            var jpegDataUri = 'data:image/jpeg;base64,' + btoa(byteout.join(''));

            byteout = [];

            return jpegDataUri;
        }

        function setQuality(quality) {
            if (quality <= 0) {
                quality = 1;
            }
            if (quality > 100) {
                quality = 100;
            }

            if (currentQuality == quality) return // don't recalc if unchanged

            var sf = 0;
            if (quality < 50) {
                sf = Math.floor(5000 / quality);
            } else {
                sf = Math.floor(200 - quality * 2);
            }

            initQuantTables(sf);
            currentQuality = quality;
        }

        function init() {
            var time_start = new Date().getTime();
            if (!quality) quality = 50;
            // Create tables
            initCharLookupTable()
            initHuffmanTbl();
            initCategoryNumber();
            initRGBYUVTable();

            setQuality(quality);
        }

        init();

    },

    JpegImage: (function () {
        var dctZigZag = new Int32Array([
            0,
            1, 8,
            16, 9, 2,
            3, 10, 17, 24,
            32, 25, 18, 11, 4,
            5, 12, 19, 26, 33, 40,
            48, 41, 34, 27, 20, 13, 6,
            7, 14, 21, 28, 35, 42, 49, 56,
            57, 50, 43, 36, 29, 22, 15,
            23, 30, 37, 44, 51, 58,
            59, 52, 45, 38, 31,
            39, 46, 53, 60,
            61, 54, 47,
            55, 62,
            63
        ]);

        var dctCos1 = 4017 // cos(pi/16)
        var dctSin1 = 799 // sin(pi/16)
        var dctCos3 = 3406 // cos(3*pi/16)
        var dctSin3 = 2276 // sin(3*pi/16)
        var dctCos6 = 1567 // cos(6*pi/16)
        var dctSin6 = 3784 // sin(6*pi/16)
        var dctSqrt2 = 5793 // sqrt(2)
        var dctSqrt1d2 = 2896 // sqrt(2) / 2

        function constructor() {}

        function buildHuffmanTable(codeLengths, values) {
            var k = 0,
                code = [],
                i, j, length = 16;
            while (length > 0 && !codeLengths[length - 1])
                length--;
            code.push({
                children: [],
                index: 0
            });
            var p = code[0],
                q;
            for (i = 0; i < length; i++) {
                for (j = 0; j < codeLengths[i]; j++) {
                    p = code.pop();
                    p.children[p.index] = values[k];
                    while (p.index > 0) {
                        if (code.length === 0)
                            throw new Error('Could not recreate Huffman Table');
                        p = code.pop();
                    }
                    p.index++;
                    code.push(p);
                    while (code.length <= i) {
                        code.push(q = {
                            children: [],
                            index: 0
                        });
                        p.children[p.index] = q.children;
                        p = q;
                    }
                    k++;
                }
                if (i + 1 < length) {
                    // p here points to last code
                    code.push(q = {
                        children: [],
                        index: 0
                    });
                    p.children[p.index] = q.children;
                    p = q;
                }
            }
            return code[0].children;
        }

        function decodeScan(data, offset,
            frame, components, resetInterval,
            spectralStart, spectralEnd,
            successivePrev, successive, opts) {
            var precision = frame.precision;
            var samplesPerLine = frame.samplesPerLine;
            var scanLines = frame.scanLines;
            var mcusPerLine = frame.mcusPerLine;
            var progressive = frame.progressive;
            var maxH = frame.maxH,
                maxV = frame.maxV;

            var startOffset = offset,
                bitsData = 0,
                bitsCount = 0;

            function readBit() {
                if (bitsCount > 0) {
                    bitsCount--;
                    return (bitsData >> bitsCount) & 1;
                }
                bitsData = data[offset++];
                if (bitsData == 0xFF) {
                    var nextByte = data[offset++];
                    if (nextByte) {
                        throw new Error("unexpected marker: " + ((bitsData << 8) | nextByte).toString(16));
                    }
                    // unstuff 0
                }
                bitsCount = 7;
                return bitsData >>> 7;
            }

            function decodeHuffman(tree) {
                var node = tree,
                    bit;
                while ((bit = readBit()) !== null) {
                    node = node[bit];
                    if (typeof node === 'number')
                        return node;
                    if (typeof node !== 'object')
                        throw new Error("invalid huffman sequence");
                }
                return null;
            }

            function receive(length) {
                var n = 0;
                while (length > 0) {
                    var bit = readBit();
                    if (bit === null) return;
                    n = (n << 1) | bit;
                    length--;
                }
                return n;
            }

            function receiveAndExtend(length) {
                var n = receive(length);
                if (n >= 1 << (length - 1))
                    return n;
                return n + (-1 << length) + 1;
            }

            function decodeBaseline(component, zz) {
                var t = decodeHuffman(component.huffmanTableDC);
                var diff = t === 0 ? 0 : receiveAndExtend(t);
                zz[0] = (component.pred += diff);
                var k = 1;
                while (k < 64) {
                    var rs = decodeHuffman(component.huffmanTableAC);
                    var s = rs & 15,
                        r = rs >> 4;
                    if (s === 0) {
                        if (r < 15)
                            break;
                        k += 16;
                        continue;
                    }
                    k += r;
                    var z = dctZigZag[k];
                    zz[z] = receiveAndExtend(s);
                    k++;
                }
            }

            function decodeDCFirst(component, zz) {
                var t = decodeHuffman(component.huffmanTableDC);
                var diff = t === 0 ? 0 : (receiveAndExtend(t) << successive);
                zz[0] = (component.pred += diff);
            }

            function decodeDCSuccessive(component, zz) {
                zz[0] |= readBit() << successive;
            }
            var eobrun = 0;

            function decodeACFirst(component, zz) {
                if (eobrun > 0) {
                    eobrun--;
                    return;
                }
                var k = spectralStart,
                    e = spectralEnd;
                while (k <= e) {
                    var rs = decodeHuffman(component.huffmanTableAC);
                    var s = rs & 15,
                        r = rs >> 4;
                    if (s === 0) {
                        if (r < 15) {
                            eobrun = receive(r) + (1 << r) - 1;
                            break;
                        }
                        k += 16;
                        continue;
                    }
                    k += r;
                    var z = dctZigZag[k];
                    zz[z] = receiveAndExtend(s) * (1 << successive);
                    k++;
                }
            }
            var successiveACState = 0,
                successiveACNextValue;

            function decodeACSuccessive(component, zz) {
                var k = spectralStart,
                    e = spectralEnd,
                    r = 0;
                while (k <= e) {
                    var z = dctZigZag[k];
                    var direction = zz[z] < 0 ? -1 : 1;
                    switch (successiveACState) {
                        case 0: // initial state
                            var rs = decodeHuffman(component.huffmanTableAC);
                            var s = rs & 15,
                                r = rs >> 4;
                            if (s === 0) {
                                if (r < 15) {
                                    eobrun = receive(r) + (1 << r);
                                    successiveACState = 4;
                                } else {
                                    r = 16;
                                    successiveACState = 1;
                                }
                            } else {
                                if (s !== 1)
                                    throw new Error("invalid ACn encoding");
                                successiveACNextValue = receiveAndExtend(s);
                                successiveACState = r ? 2 : 3;
                            }
                            continue;
                        case 1: // skipping r zero items
                        case 2:
                            if (zz[z])
                                zz[z] += (readBit() << successive) * direction;
                            else {
                                r--;
                                if (r === 0)
                                    successiveACState = successiveACState == 2 ? 3 : 0;
                            }
                            break;
                        case 3: // set value for a zero item
                            if (zz[z])
                                zz[z] += (readBit() << successive) * direction;
                            else {
                                zz[z] = successiveACNextValue << successive;
                                successiveACState = 0;
                            }
                            break;
                        case 4: // eob
                            if (zz[z])
                                zz[z] += (readBit() << successive) * direction;
                            break;
                    }
                    k++;
                }
                if (successiveACState === 4) {
                    eobrun--;
                    if (eobrun === 0)
                        successiveACState = 0;
                }
            }

            function decodeMcu(component, decode, mcu, row, col) {
                var mcuRow = (mcu / mcusPerLine) | 0;
                var mcuCol = mcu % mcusPerLine;
                var blockRow = mcuRow * component.v + row;
                var blockCol = mcuCol * component.h + col;
                // If the block is missing and we're in tolerant mode, just skip it.
                if (component.blocks[blockRow] === undefined && opts.tolerantDecoding)
                    return;
                decode(component, component.blocks[blockRow][blockCol]);
            }

            function decodeBlock(component, decode, mcu) {
                var blockRow = (mcu / component.blocksPerLine) | 0;
                var blockCol = mcu % component.blocksPerLine;
                // If the block is missing and we're in tolerant mode, just skip it.
                if (component.blocks[blockRow] === undefined && opts.tolerantDecoding)
                    return;
                decode(component, component.blocks[blockRow][blockCol]);
            }

            var componentsLength = components.length;
            var component, i, j, k, n;
            var decodeFn;
            if (progressive) {
                if (spectralStart === 0)
                    decodeFn = successivePrev === 0 ? decodeDCFirst : decodeDCSuccessive;
                else
                    decodeFn = successivePrev === 0 ? decodeACFirst : decodeACSuccessive;
            } else {
                decodeFn = decodeBaseline;
            }

            var mcu = 0,
                marker;
            var mcuExpected;
            if (componentsLength == 1) {
                mcuExpected = components[0].blocksPerLine * components[0].blocksPerColumn;
            } else {
                mcuExpected = mcusPerLine * frame.mcusPerColumn;
            }
            if (!resetInterval) resetInterval = mcuExpected;

            var h, v;
            while (mcu < mcuExpected) {
                // reset interval stuff
                for (i = 0; i < componentsLength; i++)
                    components[i].pred = 0;
                eobrun = 0;

                if (componentsLength == 1) {
                    component = components[0];
                    for (n = 0; n < resetInterval; n++) {
                        decodeBlock(component, decodeFn, mcu);
                        mcu++;
                    }
                } else {
                    for (n = 0; n < resetInterval; n++) {
                        for (i = 0; i < componentsLength; i++) {
                            component = components[i];
                            h = component.h;
                            v = component.v;
                            for (j = 0; j < v; j++) {
                                for (k = 0; k < h; k++) {
                                    decodeMcu(component, decodeFn, mcu, j, k);
                                }
                            }
                        }
                        mcu++;

                        // If we've reached our expected MCU's, stop decoding
                        if (mcu === mcuExpected) break;
                    }
                }

                if (mcu === mcuExpected) {
                    // Skip trailing bytes at the end of the scan - until we reach the next marker
                    do {
                        if (data[offset] === 0xFF) {
                            if (data[offset + 1] !== 0x00) {
                                break;
                            }
                        }
                        offset += 1;
                    } while (offset < data.length - 2);
                }

                // find marker
                bitsCount = 0;
                marker = (data[offset] << 8) | data[offset + 1];
                if (marker < 0xFF00) {
                    throw new Error("marker was not found");
                }

                if (marker >= 0xFFD0 && marker <= 0xFFD7) { // RSTx
                    offset += 2;
                } else
                    break;
            }

            return offset - startOffset;
        }

        function buildComponentData(frame, component) {
            var lines = [];
            var blocksPerLine = component.blocksPerLine;
            var blocksPerColumn = component.blocksPerColumn;
            var samplesPerLine = blocksPerLine << 3;
            // Only 1 used per invocation of this function and garbage collected after invocation, so no need to account for its memory footprint.
            var R = new Int32Array(64),
                r = new Uint8Array(64);

            // A port of poppler's IDCT method which in turn is taken from:
            //   Christoph Loeffler, Adriaan Ligtenberg, George S. Moschytz,
            //   "Practical Fast 1-D DCT Algorithms with 11 Multiplications",
            //   IEEE Intl. Conf. on Acoustics, Speech & Signal Processing, 1989,
            //   988-991.
            function quantizeAndInverse(zz, dataOut, dataIn) {
                var qt = component.quantizationTable;
                var v0, v1, v2, v3, v4, v5, v6, v7, t;
                var p = dataIn;
                var i;

                // dequant
                for (i = 0; i < 64; i++)
                    p[i] = zz[i] * qt[i];

                // inverse DCT on rows
                for (i = 0; i < 8; ++i) {
                    var row = 8 * i;

                    // check for all-zero AC coefficients
                    if (p[1 + row] == 0 && p[2 + row] == 0 && p[3 + row] == 0 &&
                        p[4 + row] == 0 && p[5 + row] == 0 && p[6 + row] == 0 &&
                        p[7 + row] == 0) {
                        t = (dctSqrt2 * p[0 + row] + 512) >> 10;
                        p[0 + row] = t;
                        p[1 + row] = t;
                        p[2 + row] = t;
                        p[3 + row] = t;
                        p[4 + row] = t;
                        p[5 + row] = t;
                        p[6 + row] = t;
                        p[7 + row] = t;
                        continue;
                    }

                    // stage 4
                    v0 = (dctSqrt2 * p[0 + row] + 128) >> 8;
                    v1 = (dctSqrt2 * p[4 + row] + 128) >> 8;
                    v2 = p[2 + row];
                    v3 = p[6 + row];
                    v4 = (dctSqrt1d2 * (p[1 + row] - p[7 + row]) + 128) >> 8;
                    v7 = (dctSqrt1d2 * (p[1 + row] + p[7 + row]) + 128) >> 8;
                    v5 = p[3 + row] << 4;
                    v6 = p[5 + row] << 4;

                    // stage 3
                    t = (v0 - v1 + 1) >> 1;
                    v0 = (v0 + v1 + 1) >> 1;
                    v1 = t;
                    t = (v2 * dctSin6 + v3 * dctCos6 + 128) >> 8;
                    v2 = (v2 * dctCos6 - v3 * dctSin6 + 128) >> 8;
                    v3 = t;
                    t = (v4 - v6 + 1) >> 1;
                    v4 = (v4 + v6 + 1) >> 1;
                    v6 = t;
                    t = (v7 + v5 + 1) >> 1;
                    v5 = (v7 - v5 + 1) >> 1;
                    v7 = t;

                    // stage 2
                    t = (v0 - v3 + 1) >> 1;
                    v0 = (v0 + v3 + 1) >> 1;
                    v3 = t;
                    t = (v1 - v2 + 1) >> 1;
                    v1 = (v1 + v2 + 1) >> 1;
                    v2 = t;
                    t = (v4 * dctSin3 + v7 * dctCos3 + 2048) >> 12;
                    v4 = (v4 * dctCos3 - v7 * dctSin3 + 2048) >> 12;
                    v7 = t;
                    t = (v5 * dctSin1 + v6 * dctCos1 + 2048) >> 12;
                    v5 = (v5 * dctCos1 - v6 * dctSin1 + 2048) >> 12;
                    v6 = t;

                    // stage 1
                    p[0 + row] = v0 + v7;
                    p[7 + row] = v0 - v7;
                    p[1 + row] = v1 + v6;
                    p[6 + row] = v1 - v6;
                    p[2 + row] = v2 + v5;
                    p[5 + row] = v2 - v5;
                    p[3 + row] = v3 + v4;
                    p[4 + row] = v3 - v4;
                }

                // inverse DCT on columns
                for (i = 0; i < 8; ++i) {
                    var col = i;

                    // check for all-zero AC coefficients
                    if (p[1 * 8 + col] == 0 && p[2 * 8 + col] == 0 && p[3 * 8 + col] == 0 &&
                        p[4 * 8 + col] == 0 && p[5 * 8 + col] == 0 && p[6 * 8 + col] == 0 &&
                        p[7 * 8 + col] == 0) {
                        t = (dctSqrt2 * dataIn[i + 0] + 8192) >> 14;
                        p[0 * 8 + col] = t;
                        p[1 * 8 + col] = t;
                        p[2 * 8 + col] = t;
                        p[3 * 8 + col] = t;
                        p[4 * 8 + col] = t;
                        p[5 * 8 + col] = t;
                        p[6 * 8 + col] = t;
                        p[7 * 8 + col] = t;
                        continue;
                    }

                    // stage 4
                    v0 = (dctSqrt2 * p[0 * 8 + col] + 2048) >> 12;
                    v1 = (dctSqrt2 * p[4 * 8 + col] + 2048) >> 12;
                    v2 = p[2 * 8 + col];
                    v3 = p[6 * 8 + col];
                    v4 = (dctSqrt1d2 * (p[1 * 8 + col] - p[7 * 8 + col]) + 2048) >> 12;
                    v7 = (dctSqrt1d2 * (p[1 * 8 + col] + p[7 * 8 + col]) + 2048) >> 12;
                    v5 = p[3 * 8 + col];
                    v6 = p[5 * 8 + col];

                    // stage 3
                    t = (v0 - v1 + 1) >> 1;
                    v0 = (v0 + v1 + 1) >> 1;
                    v1 = t;
                    t = (v2 * dctSin6 + v3 * dctCos6 + 2048) >> 12;
                    v2 = (v2 * dctCos6 - v3 * dctSin6 + 2048) >> 12;
                    v3 = t;
                    t = (v4 - v6 + 1) >> 1;
                    v4 = (v4 + v6 + 1) >> 1;
                    v6 = t;
                    t = (v7 + v5 + 1) >> 1;
                    v5 = (v7 - v5 + 1) >> 1;
                    v7 = t;

                    // stage 2
                    t = (v0 - v3 + 1) >> 1;
                    v0 = (v0 + v3 + 1) >> 1;
                    v3 = t;
                    t = (v1 - v2 + 1) >> 1;
                    v1 = (v1 + v2 + 1) >> 1;
                    v2 = t;
                    t = (v4 * dctSin3 + v7 * dctCos3 + 2048) >> 12;
                    v4 = (v4 * dctCos3 - v7 * dctSin3 + 2048) >> 12;
                    v7 = t;
                    t = (v5 * dctSin1 + v6 * dctCos1 + 2048) >> 12;
                    v5 = (v5 * dctCos1 - v6 * dctSin1 + 2048) >> 12;
                    v6 = t;

                    // stage 1
                    p[0 * 8 + col] = v0 + v7;
                    p[7 * 8 + col] = v0 - v7;
                    p[1 * 8 + col] = v1 + v6;
                    p[6 * 8 + col] = v1 - v6;
                    p[2 * 8 + col] = v2 + v5;
                    p[5 * 8 + col] = v2 - v5;
                    p[3 * 8 + col] = v3 + v4;
                    p[4 * 8 + col] = v3 - v4;
                }

                // convert to 8-bit integers
                for (i = 0; i < 64; ++i) {
                    var sample = 128 + ((p[i] + 8) >> 4);
                    dataOut[i] = sample < 0 ? 0 : sample > 0xFF ? 0xFF : sample;
                }
            }

            requestMemoryAllocation(samplesPerLine * blocksPerColumn * 8);

            var i, j;
            for (var blockRow = 0; blockRow < blocksPerColumn; blockRow++) {
                var scanLine = blockRow << 3;
                for (i = 0; i < 8; i++)
                    lines.push(new Uint8Array(samplesPerLine));
                for (var blockCol = 0; blockCol < blocksPerLine; blockCol++) {
                    quantizeAndInverse(component.blocks[blockRow][blockCol], r, R);

                    var offset = 0,
                        sample = blockCol << 3;
                    for (j = 0; j < 8; j++) {
                        var line = lines[scanLine + j];
                        for (i = 0; i < 8; i++)
                            line[sample + i] = r[offset++];
                    }
                }
            }
            return lines;
        }

        function clampTo8bit(a) {
            return a < 0 ? 0 : a > 255 ? 255 : a;
        }

        constructor.prototype = {
            load: function load(path) {
                var xhr = new XMLHttpRequest();
                xhr.open("GET", path, true);
                xhr.responseType = "arraybuffer";
                xhr.onload = (function () {
                    // TODO catch parse error
                    var data = new Uint8Array(xhr.response || xhr.mozResponseArrayBuffer);
                    this.parse(data);
                    if (this.onload)
                        this.onload();
                }).bind(this);
                xhr.send(null);
            },
            parse: function parse(data) {
                var maxResolutionInPixels = this.opts.maxResolutionInMP * 1000 * 1000;
                var offset = 0,
                    length = data.length;

                function readUint16() {
                    var value = (data[offset] << 8) | data[offset + 1];
                    offset += 2;
                    return value;
                }

                function readDataBlock() {
                    var length = readUint16();
                    var array = data.subarray(offset, offset + length - 2);
                    offset += array.length;
                    return array;
                }

                function prepareComponents(frame) {
                    var maxH = 0,
                        maxV = 0;
                    var component, componentId;
                    for (componentId in frame.components) {
                        if (frame.components.hasOwnProperty(componentId)) {
                            component = frame.components[componentId];
                            if (maxH < component.h) maxH = component.h;
                            if (maxV < component.v) maxV = component.v;
                        }
                    }
                    var mcusPerLine = Math.ceil(frame.samplesPerLine / 8 / maxH);
                    var mcusPerColumn = Math.ceil(frame.scanLines / 8 / maxV);
                    for (componentId in frame.components) {
                        if (frame.components.hasOwnProperty(componentId)) {
                            component = frame.components[componentId];
                            var blocksPerLine = Math.ceil(Math.ceil(frame.samplesPerLine / 8) * component.h / maxH);
                            var blocksPerColumn = Math.ceil(Math.ceil(frame.scanLines / 8) * component.v / maxV);
                            var blocksPerLineForMcu = mcusPerLine * component.h;
                            var blocksPerColumnForMcu = mcusPerColumn * component.v;
                            var blocksToAllocate = blocksPerColumnForMcu * blocksPerLineForMcu;
                            var blocks = [];

                            // Each block is a Int32Array of length 64 (4 x 64 = 256 bytes)
                            requestMemoryAllocation(blocksToAllocate * 256);

                            for (var i = 0; i < blocksPerColumnForMcu; i++) {
                                var row = [];
                                for (var j = 0; j < blocksPerLineForMcu; j++)
                                    row.push(new Int32Array(64));
                                blocks.push(row);
                            }
                            component.blocksPerLine = blocksPerLine;
                            component.blocksPerColumn = blocksPerColumn;
                            component.blocks = blocks;
                        }
                    }
                    frame.maxH = maxH;
                    frame.maxV = maxV;
                    frame.mcusPerLine = mcusPerLine;
                    frame.mcusPerColumn = mcusPerColumn;
                }
                var jfif = null;
                var adobe = null;
                var pixels = null;
                var frame, resetInterval;
                var quantizationTables = [],
                    frames = [];
                var huffmanTablesAC = [],
                    huffmanTablesDC = [];
                var fileMarker = readUint16();
                var malformedDataOffset = -1;
                this.comments = [];
                if (fileMarker != 0xFFD8) { // SOI (Start of Image)
                    throw new Error("SOI not found");
                }

                fileMarker = readUint16();
                while (fileMarker != 0xFFD9) { // EOI (End of image)
                    var i, j, l;
                    switch (fileMarker) {
                        case 0xFF00:
                            break;
                        case 0xFFE0: // APP0 (Application Specific)
                        case 0xFFE1: // APP1
                        case 0xFFE2: // APP2
                        case 0xFFE3: // APP3
                        case 0xFFE4: // APP4
                        case 0xFFE5: // APP5
                        case 0xFFE6: // APP6
                        case 0xFFE7: // APP7
                        case 0xFFE8: // APP8
                        case 0xFFE9: // APP9
                        case 0xFFEA: // APP10
                        case 0xFFEB: // APP11
                        case 0xFFEC: // APP12
                        case 0xFFED: // APP13
                        case 0xFFEE: // APP14
                        case 0xFFEF: // APP15
                        case 0xFFFE: // COM (Comment)
                            var appData = readDataBlock();

                            if (fileMarker === 0xFFFE) {
                                var comment = String.fromCharCode.apply(null, appData);
                                this.comments.push(comment);
                            }

                            if (fileMarker === 0xFFE0) {
                                if (appData[0] === 0x4A && appData[1] === 0x46 && appData[2] === 0x49 &&
                                    appData[3] === 0x46 && appData[4] === 0) { // 'JFIF\x00'
                                    jfif = {
                                        version: {
                                            major: appData[5],
                                            minor: appData[6]
                                        },
                                        densityUnits: appData[7],
                                        xDensity: (appData[8] << 8) | appData[9],
                                        yDensity: (appData[10] << 8) | appData[11],
                                        thumbWidth: appData[12],
                                        thumbHeight: appData[13],
                                        thumbData: appData.subarray(14, 14 + 3 * appData[12] * appData[13])
                                    };
                                }
                            }
                            // TODO APP1 - Exif
                            if (fileMarker === 0xFFE1) {
                                if (appData[0] === 0x45 &&
                                    appData[1] === 0x78 &&
                                    appData[2] === 0x69 &&
                                    appData[3] === 0x66 &&
                                    appData[4] === 0) { // 'EXIF\x00'
                                    this.exifBuffer = appData.subarray(5, appData.length);
                                }
                            }

                            if (fileMarker === 0xFFEE) {
                                if (appData[0] === 0x41 && appData[1] === 0x64 && appData[2] === 0x6F &&
                                    appData[3] === 0x62 && appData[4] === 0x65 && appData[5] === 0) { // 'Adobe\x00'
                                    adobe = {
                                        version: appData[6],
                                        flags0: (appData[7] << 8) | appData[8],
                                        flags1: (appData[9] << 8) | appData[10],
                                        transformCode: appData[11]
                                    };
                                }
                            }
                            break;

                        case 0xFFDB: // DQT (Define Quantization Tables)
                            var quantizationTablesLength = readUint16();
                            var quantizationTablesEnd = quantizationTablesLength + offset - 2;
                            while (offset < quantizationTablesEnd) {
                                var quantizationTableSpec = data[offset++];
                                requestMemoryAllocation(64 * 4);
                                var tableData = new Int32Array(64);
                                if ((quantizationTableSpec >> 4) === 0) { // 8 bit values
                                    for (j = 0; j < 64; j++) {
                                        var z = dctZigZag[j];
                                        tableData[z] = data[offset++];
                                    }
                                } else if ((quantizationTableSpec >> 4) === 1) { //16 bit
                                    for (j = 0; j < 64; j++) {
                                        var z = dctZigZag[j];
                                        tableData[z] = readUint16();
                                    }
                                } else
                                    throw new Error("DQT: invalid table spec");
                                quantizationTables[quantizationTableSpec & 15] = tableData;
                            }
                            break;

                        case 0xFFC0: // SOF0 (Start of Frame, Baseline DCT)
                        case 0xFFC1: // SOF1 (Start of Frame, Extended DCT)
                        case 0xFFC2: // SOF2 (Start of Frame, Progressive DCT)
                            readUint16(); // skip data length
                            frame = {};
                            frame.extended = (fileMarker === 0xFFC1);
                            frame.progressive = (fileMarker === 0xFFC2);
                            frame.precision = data[offset++];
                            frame.scanLines = readUint16();
                            frame.samplesPerLine = readUint16();
                            frame.components = {};
                            frame.componentsOrder = [];

                            var pixelsInFrame = frame.scanLines * frame.samplesPerLine;
                            if (pixelsInFrame > maxResolutionInPixels) {
                                var exceededAmount = Math.ceil((pixelsInFrame - maxResolutionInPixels) / 1e6);
                                throw new Error(`maxResolutionInMP limit exceeded by ${exceededAmount}MP`);
                            }

                            var componentsCount = data[offset++],
                                componentId;
                            var maxH = 0,
                                maxV = 0;
                            for (i = 0; i < componentsCount; i++) {
                                componentId = data[offset];
                                var h = data[offset + 1] >> 4;
                                var v = data[offset + 1] & 15;
                                var qId = data[offset + 2];
                                frame.componentsOrder.push(componentId);
                                frame.components[componentId] = {
                                    h: h,
                                    v: v,
                                    quantizationIdx: qId
                                };
                                offset += 3;
                            }
                            prepareComponents(frame);
                            frames.push(frame);
                            break;

                        case 0xFFC4: // DHT (Define Huffman Tables)
                            var huffmanLength = readUint16();
                            for (i = 2; i < huffmanLength;) {
                                var huffmanTableSpec = data[offset++];
                                var codeLengths = new Uint8Array(16);
                                var codeLengthSum = 0;
                                for (j = 0; j < 16; j++, offset++) {
                                    codeLengthSum += (codeLengths[j] = data[offset]);
                                }
                                requestMemoryAllocation(16 + codeLengthSum);
                                var huffmanValues = new Uint8Array(codeLengthSum);
                                for (j = 0; j < codeLengthSum; j++, offset++)
                                    huffmanValues[j] = data[offset];
                                i += 17 + codeLengthSum;

                                ((huffmanTableSpec >> 4) === 0 ?
                                    huffmanTablesDC : huffmanTablesAC)[huffmanTableSpec & 15] =
                                buildHuffmanTable(codeLengths, huffmanValues);
                            }
                            break;

                        case 0xFFDD: // DRI (Define Restart Interval)
                            readUint16(); // skip data length
                            resetInterval = readUint16();
                            break;

                        case 0xFFDC: // Number of Lines marker
                            readUint16() // skip data length
                            readUint16() // Ignore this data since it represents the image height
                            break;

                        case 0xFFDA: // SOS (Start of Scan)
                            var scanLength = readUint16();
                            var selectorsCount = data[offset++];
                            var components = [],
                                component;
                            for (i = 0; i < selectorsCount; i++) {
                                component = frame.components[data[offset++]];
                                var tableSpec = data[offset++];
                                component.huffmanTableDC = huffmanTablesDC[tableSpec >> 4];
                                component.huffmanTableAC = huffmanTablesAC[tableSpec & 15];
                                components.push(component);
                            }
                            var spectralStart = data[offset++];
                            var spectralEnd = data[offset++];
                            var successiveApproximation = data[offset++];
                            var processed = decodeScan(data, offset,
                                frame, components, resetInterval,
                                spectralStart, spectralEnd,
                                successiveApproximation >> 4, successiveApproximation & 15, this.opts);
                            offset += processed;
                            break;

                        case 0xFFFF: // Fill bytes
                            if (data[offset] !== 0xFF) { // Avoid skipping a valid marker.
                                offset--;
                            }
                            break;
                        default:
                            if (data[offset - 3] == 0xFF &&
                                data[offset - 2] >= 0xC0 && data[offset - 2] <= 0xFE) {
                                // could be incorrect encoding -- last 0xFF byte of the previous
                                // block was eaten by the encoder
                                offset -= 3;
                                break;
                            } else if (fileMarker === 0xE0 || fileMarker == 0xE1) {
                                // Recover from malformed APP1 markers popular in some phone models.
                                // See https://github.com/eugeneware/jpeg-js/issues/82
                                if (malformedDataOffset !== -1) {
                                    throw new Error(`first unknown JPEG marker at offset ${malformedDataOffset.toString(16)}, second unknown JPEG marker ${fileMarker.toString(16)} at offset ${(offset - 1).toString(16)}`);
                                }
                                malformedDataOffset = offset - 1;
                                const nextOffset = readUint16();
                                if (data[offset + nextOffset - 2] === 0xFF) {
                                    offset += nextOffset - 2;
                                    break;
                                }
                            }
                            throw new Error("unknown JPEG marker " + fileMarker.toString(16));
                    }
                    fileMarker = readUint16();
                }
                if (frames.length != 1)
                    throw new Error("only single frame JPEGs supported");

                // set each frame's components quantization table
                for (var i = 0; i < frames.length; i++) {
                    var cp = frames[i].components;
                    for (var j in cp) {
                        cp[j].quantizationTable = quantizationTables[cp[j].quantizationIdx];
                        delete cp[j].quantizationIdx;
                    }
                }

                this.width = frame.samplesPerLine;
                this.height = frame.scanLines;
                this.jfif = jfif;
                this.adobe = adobe;
                this.components = [];
                for (var i = 0; i < frame.componentsOrder.length; i++) {
                    var component = frame.components[frame.componentsOrder[i]];
                    this.components.push({
                        lines: buildComponentData(frame, component),
                        scaleX: component.h / frame.maxH,
                        scaleY: component.v / frame.maxV
                    });
                }
            },
            getData: function getData(width, height) {
                var scaleX = this.width / width,
                    scaleY = this.height / height;

                var component1, component2, component3, component4;
                var component1Line, component2Line, component3Line, component4Line;
                var x, y;
                var offset = 0;
                var Y, Cb, Cr, K, C, M, Ye, R, G, B;
                var colorTransform;
                var dataLength = width * height * this.components.length;
                requestMemoryAllocation(dataLength);
                var data = new Uint8Array(dataLength);
                switch (this.components.length) {
                    case 1:
                        component1 = this.components[0];
                        for (y = 0; y < height; y++) {
                            component1Line = component1.lines[0 | (y * component1.scaleY * scaleY)];
                            for (x = 0; x < width; x++) {
                                Y = component1Line[0 | (x * component1.scaleX * scaleX)];

                                data[offset++] = Y;
                            }
                        }
                        break;
                    case 2:
                        // PDF might compress two component data in custom colorspace
                        component1 = this.components[0];
                        component2 = this.components[1];
                        for (y = 0; y < height; y++) {
                            component1Line = component1.lines[0 | (y * component1.scaleY * scaleY)];
                            component2Line = component2.lines[0 | (y * component2.scaleY * scaleY)];
                            for (x = 0; x < width; x++) {
                                Y = component1Line[0 | (x * component1.scaleX * scaleX)];
                                data[offset++] = Y;
                                Y = component2Line[0 | (x * component2.scaleX * scaleX)];
                                data[offset++] = Y;
                            }
                        }
                        break;
                    case 3:
                        // The default transform for three components is true
                        colorTransform = true;
                        // The adobe transform marker overrides any previous setting
                        if (this.adobe && this.adobe.transformCode)
                            colorTransform = true;
                        else if (typeof this.opts.colorTransform !== 'undefined')
                            colorTransform = !!this.opts.colorTransform;

                        component1 = this.components[0];
                        component2 = this.components[1];
                        component3 = this.components[2];
                        for (y = 0; y < height; y++) {
                            component1Line = component1.lines[0 | (y * component1.scaleY * scaleY)];
                            component2Line = component2.lines[0 | (y * component2.scaleY * scaleY)];
                            component3Line = component3.lines[0 | (y * component3.scaleY * scaleY)];
                            for (x = 0; x < width; x++) {
                                if (!colorTransform) {
                                    R = component1Line[0 | (x * component1.scaleX * scaleX)];
                                    G = component2Line[0 | (x * component2.scaleX * scaleX)];
                                    B = component3Line[0 | (x * component3.scaleX * scaleX)];
                                } else {
                                    Y = component1Line[0 | (x * component1.scaleX * scaleX)];
                                    Cb = component2Line[0 | (x * component2.scaleX * scaleX)];
                                    Cr = component3Line[0 | (x * component3.scaleX * scaleX)];

                                    R = clampTo8bit(Y + 1.402 * (Cr - 128));
                                    G = clampTo8bit(Y - 0.3441363 * (Cb - 128) - 0.71413636 * (Cr - 128));
                                    B = clampTo8bit(Y + 1.772 * (Cb - 128));
                                }

                                data[offset++] = R;
                                data[offset++] = G;
                                data[offset++] = B;
                            }
                        }
                        break;
                    case 4:
                        if (!this.adobe)
                            throw new Error('Unsupported color mode (4 components)');
                        // The default transform for four components is false
                        colorTransform = false;
                        // The adobe transform marker overrides any previous setting
                        if (this.adobe && this.adobe.transformCode)
                            colorTransform = true;
                        else if (typeof this.opts.colorTransform !== 'undefined')
                            colorTransform = !!this.opts.colorTransform;

                        component1 = this.components[0];
                        component2 = this.components[1];
                        component3 = this.components[2];
                        component4 = this.components[3];
                        for (y = 0; y < height; y++) {
                            component1Line = component1.lines[0 | (y * component1.scaleY * scaleY)];
                            component2Line = component2.lines[0 | (y * component2.scaleY * scaleY)];
                            component3Line = component3.lines[0 | (y * component3.scaleY * scaleY)];
                            component4Line = component4.lines[0 | (y * component4.scaleY * scaleY)];
                            for (x = 0; x < width; x++) {
                                if (!colorTransform) {
                                    C = component1Line[0 | (x * component1.scaleX * scaleX)];
                                    M = component2Line[0 | (x * component2.scaleX * scaleX)];
                                    Ye = component3Line[0 | (x * component3.scaleX * scaleX)];
                                    K = component4Line[0 | (x * component4.scaleX * scaleX)];
                                } else {
                                    Y = component1Line[0 | (x * component1.scaleX * scaleX)];
                                    Cb = component2Line[0 | (x * component2.scaleX * scaleX)];
                                    Cr = component3Line[0 | (x * component3.scaleX * scaleX)];
                                    K = component4Line[0 | (x * component4.scaleX * scaleX)];

                                    C = 255 - clampTo8bit(Y + 1.402 * (Cr - 128));
                                    M = 255 - clampTo8bit(Y - 0.3441363 * (Cb - 128) - 0.71413636 * (Cr - 128));
                                    Ye = 255 - clampTo8bit(Y + 1.772 * (Cb - 128));
                                }
                                data[offset++] = 255 - C;
                                data[offset++] = 255 - M;
                                data[offset++] = 255 - Ye;
                                data[offset++] = 255 - K;
                            }
                        }
                        break;
                    default:
                        throw new Error('Unsupported color mode');
                }
                return data;
            },
            copyToImageData: function copyToImageData(imageData, formatAsRGBA) {
                var width = imageData.width,
                    height = imageData.height;
                var imageDataArray = imageData.data;
                var data = this.getData(width, height);
                var i = 0,
                    j = 0,
                    x, y;
                var Y, K, C, M, R, G, B;
                switch (this.components.length) {
                    case 1:
                        for (y = 0; y < height; y++) {
                            for (x = 0; x < width; x++) {
                                Y = data[i++];

                                imageDataArray[j++] = Y;
                                imageDataArray[j++] = Y;
                                imageDataArray[j++] = Y;
                                if (formatAsRGBA) {
                                    imageDataArray[j++] = 255;
                                }
                            }
                        }
                        break;
                    case 3:
                        for (y = 0; y < height; y++) {
                            for (x = 0; x < width; x++) {
                                R = data[i++];
                                G = data[i++];
                                B = data[i++];

                                imageDataArray[j++] = R;
                                imageDataArray[j++] = G;
                                imageDataArray[j++] = B;
                                if (formatAsRGBA) {
                                    imageDataArray[j++] = 255;
                                }
                            }
                        }
                        break;
                    case 4:
                        for (y = 0; y < height; y++) {
                            for (x = 0; x < width; x++) {
                                C = data[i++];
                                M = data[i++];
                                Y = data[i++];
                                K = data[i++];

                                R = 255 - clampTo8bit(C * (1 - K / 255) + K);
                                G = 255 - clampTo8bit(M * (1 - K / 255) + K);
                                B = 255 - clampTo8bit(Y * (1 - K / 255) + K);

                                imageDataArray[j++] = R;
                                imageDataArray[j++] = G;
                                imageDataArray[j++] = B;
                                if (formatAsRGBA) {
                                    imageDataArray[j++] = 255;
                                }
                            }
                        }
                        break;
                    default:
                        throw new Error('Unsupported color mode');
                }
            }
        };


        // We cap the amount of memory used by jpeg-js to avoid unexpected OOMs from untrusted content.
        var totalBytesAllocated = 0;
        var maxMemoryUsageBytes = 0;

        function requestMemoryAllocation(increaseAmount = 0) {
            var totalMemoryImpactBytes = totalBytesAllocated + increaseAmount;
            if (totalMemoryImpactBytes > maxMemoryUsageBytes) {
                var exceededAmount = Math.ceil((totalMemoryImpactBytes - maxMemoryUsageBytes) / 1024 / 1024);
                throw new Error(`maxMemoryUsageInMB limit exceeded by at least ${exceededAmount}MB`);
            }

            totalBytesAllocated = totalMemoryImpactBytes;
        }

        constructor.resetMaxMemoryUsage = function (maxMemoryUsageBytes_) {
            totalBytesAllocated = 0;
            maxMemoryUsageBytes = maxMemoryUsageBytes_;
        };

        constructor.getBytesAllocated = function () {
            return totalBytesAllocated;
        };

        constructor.requestMemoryAllocation = requestMemoryAllocation;

        return constructor;
    })(),

    encodeJPEG: function (imgData, qu) {
        if (typeof qu === 'undefined') qu = 50;
        var encoder = new Processing.utils.JPEGEncoder(qu);
        var data = encoder.encode(imgData, qu);
        return {
            data: data,
            width: imgData.width,
            height: imgData.height,
        };
    },

    decodeJPEG: function (jpegData, userOpts) {
        userOpts = userOpts || {}

        var defaultOpts = {
            // "undefined" means "Choose whether to transform colors based on the image’s color model."
            colorTransform: undefined,
            useTArray: false,
            formatAsRGBA: true,
            tolerantDecoding: true,
            maxResolutionInMP: 100, // Don't decode more than 100 megapixels
            maxMemoryUsageInMB: 512, // Don't decode if memory footprint is more than 512MB
        };

        var opts = {
            ...defaultOpts,
            ...userOpts
        };
        var arr = new Uint8Array(jpegData);
        var decoder = new JpegImage();
        decoder.opts = opts;
        // If this constructor ever supports async decoding this will need to be done differently.
        // Until then, treating as singleton limit is fine.
        JpegImage.resetMaxMemoryUsage(opts.maxMemoryUsageInMB * 1024 * 1024);
        decoder.parse(arr);

        var channels = (opts.formatAsRGBA) ? 4 : 3;
        var bytesNeeded = decoder.width * decoder.height * channels;
        try {
            JpegImage.requestMemoryAllocation(bytesNeeded);
            var image = {
                width: decoder.width,
                height: decoder.height,
                exifBuffer: decoder.exifBuffer,
                data: opts.useTArray ?
                    new Uint8Array(bytesNeeded) : Buffer.alloc(bytesNeeded)
            };
            if (decoder.comments.length > 0) {
                image["comments"] = decoder.comments;
            }
        } catch (err) {
            if (err instanceof RangeError) {
                throw new Error("Could not allocate enough memory for the image. " +
                    "Required: " + bytesNeeded);
            }

            if (err instanceof ReferenceError) {
                if (err.message === "Buffer is not defined") {
                    throw new Error("Buffer is not globally defined in this environment. " +
                        "Consider setting useTArray to true");
                }
            }
            throw err;
        }

        decoder.copyToImageData(image, opts.formatAsRGBA);

        return image;
    },

    decodeColor: function (colorInt) {
        return [
            (colorInt & Processing.PConstants.RED_MASK) >>> 16,
            (colorInt & Processing.PConstants.GREEN_MASK) >>> 8,
            (colorInt & Processing.PConstants.BLUE_MASK),
            (colorInt & Processing.PConstants.ALPHA_MASK) >>> 24
        ];
    },

    line_lineColl: function (ax1, ay1, ax2, ay2, bx1, by1, bx2, by2) {
        var det = (ax2 - ax1) * (by2 - by1) - (bx2 - bx1) * (ay2 - ay1);
        if (det === 0) {
            return false;
        } else {
            var lambda = ((by2 - by1) * (bx2 - ax1) + (bx1 - bx2) * (by2 - ay1)) / det;
            var gamma = ((ay1 - ay2) * (bx2 - ax1) + (ax2 - ax1) * (by2 - ay1)) / det;
            return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
        }
    },
    
    getLineLineIntersect: function (x1, y1, x2, y2, x3, y3, x4, y4) {
        // Check if none of the lines are of length 0
        if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
            return false;
        }
        
        var a = y4 - y3;
        var b = x2 - x1;
        var c = x4 - x3;
        var d = y2 - y1;
        var e = y1 - y3;
        var f = x1 - x3;
        
        var denominator = (a * b - c * d);
        
        // Lines are parallel
        if (denominator === 0) {
            return false;
        }
        
        var ua = (c * e - a * f) / denominator;
        var ub = (b * e - d * f) / denominator;
        
        // is the intersection along the segments
        if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
            return false;
        }
        
        // Return a object with the x and y coordinates of the intersection
        return [
            x1 + ua * b,
            y1 + ua * d
        ];
    },
    
    point_triangleColl: function (px, py, tx1, ty1, tx2, ty2, tx3, ty3) {
        // Credit: Larry Serflaton
        var tx1_3 = tx1 - tx3;
        var tx3_2 = tx3 - tx2;
        var ty2_3 = ty2 - ty3;
        var ty3_1 = ty3 - ty1;
        var px_x3 = px - tx3;
        var py_y3 = py - ty3;
        var denom = ty2_3 * tx1_3 + tx3_2 * (ty1 - ty3);
        var a = (ty2_3 * px_x3 + tx3_2 * py_y3) / denom;
        var b = (ty3_1 * px_x3 + tx1_3 * py_y3) / denom;
        var c = 1 - a - b;
        return a > 0 && b > 0 && c > 0 && c < 1 && b < 1 && a < 1;
    },
    
    rgbComponentToHex: function (c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    },
    
    ascendingSortFxn: function (a, b) {
        return a - b;
    },
    
    renderPolygon: function (imgData, verts, clr) {
        for (var i = 0; i < verts.length - 1; i += 2) {
            verts[i] = Math.round(verts[i]);
            verts[i + 1] = Math.round(verts[i + 1]);
        }
        
        var yMin = verts[1];
        var yMax = verts[1];
        for (var i = 3; i < verts.length; i += 2) {
            if (verts[i] < yMin) {
                yMin = verts[i];
            } else if (verts[i] > yMax) {
                yMax = verts[i];
            }
        }
        
        yMin = Math.max(0, yMin);
        yMax = Math.min(imgData.height, yMax);
        
        var redC = clr[0];
        var greenC = clr[1];
        var blueC = clr[2];
        var alphaC = clr[3];
        
        var WIDTH = imgData.width;
        
        var p = imgData.data;
        
        for (var i = yMin; i < yMax; i++) {
            var intersects = {};
            
            for (var j = 0; j < verts.length; j += 2) {
                var intersectPt = Processing.utils.getLineLineIntersect(-Number.MAX_SAFE_INTEGER, i, Number.MAX_SAFE_INTEGER, i,
                    verts[j], verts[j + 1], verts[(j + 2) % verts.length], verts[(j + 3) % verts.length]
                );
                
                if (intersectPt) {
                    intersects[Math.round(intersectPt[0])] = true;
                }
            }
            
            intersects = Object.keys(intersects);
            intersects.sort(Processing.utils.ascendingSortFxn);
            
            var k = 0;
            while (intersects[k + 1]) {
                for (var j = Math.max(intersects[k], 0); j < Math.min(intersects[k + 1], WIDTH); j++) {
                    var idx = (j + i * WIDTH) << 2;
                    p[idx] = redC;
                    p[idx + 1] = greenC;
                    p[idx + 2] = blueC;
                    p[idx + 3] = alphaC;
                }
                
                k += 2;
            }
        }
    },
    
    convolveRGBA: function (src, out, line, coeff, width, height) {
        // for guassian blur
        // takes src image and writes the blurred and transposed result into out
        var rgba;
        var prev_src_r, prev_src_g, prev_src_b, prev_src_a;
        var curr_src_r, curr_src_g, curr_src_b, curr_src_a;
        var curr_out_r, curr_out_g, curr_out_b, curr_out_a;
        var prev_out_r, prev_out_g, prev_out_b, prev_out_a;
        var prev_prev_out_r, prev_prev_out_g, prev_prev_out_b, prev_prev_out_a;
    
        var src_index, out_index, line_index;
        var i, j;
        var coeff_a0, coeff_a1, coeff_b1, coeff_b2;
    
        for (i = 0; i < height; i++) {
            src_index = i * width;
            out_index = i;
            line_index = 0;
    
            // left to right
            rgba = src[src_index];
    
            prev_src_r = rgba & 0xff;
            prev_src_g = (rgba >> 8) & 0xff;
            prev_src_b = (rgba >> 16) & 0xff;
            prev_src_a = (rgba >> 24) & 0xff;
    
            prev_prev_out_r = prev_src_r * coeff[6];
            prev_prev_out_g = prev_src_g * coeff[6];
            prev_prev_out_b = prev_src_b * coeff[6];
            prev_prev_out_a = prev_src_a * coeff[6];
    
            prev_out_r = prev_prev_out_r;
            prev_out_g = prev_prev_out_g;
            prev_out_b = prev_prev_out_b;
            prev_out_a = prev_prev_out_a;
    
            coeff_a0 = coeff[0];
            coeff_a1 = coeff[1];
            coeff_b1 = coeff[4];
            coeff_b2 = coeff[5];
    
            for (j = 0; j < width; j++) {
                rgba = src[src_index];
                curr_src_r = rgba & 0xff;
                curr_src_g = (rgba >> 8) & 0xff;
                curr_src_b = (rgba >> 16) & 0xff;
                curr_src_a = (rgba >> 24) & 0xff;
    
                curr_out_r = curr_src_r * coeff_a0 + prev_src_r * coeff_a1 + prev_out_r * coeff_b1 + prev_prev_out_r * coeff_b2;
                curr_out_g = curr_src_g * coeff_a0 + prev_src_g * coeff_a1 + prev_out_g * coeff_b1 + prev_prev_out_g * coeff_b2;
                curr_out_b = curr_src_b * coeff_a0 + prev_src_b * coeff_a1 + prev_out_b * coeff_b1 + prev_prev_out_b * coeff_b2;
                curr_out_a = curr_src_a * coeff_a0 + prev_src_a * coeff_a1 + prev_out_a * coeff_b1 + prev_prev_out_a * coeff_b2;
    
                prev_prev_out_r = prev_out_r;
                prev_prev_out_g = prev_out_g;
                prev_prev_out_b = prev_out_b;
                prev_prev_out_a = prev_out_a;
    
                prev_out_r = curr_out_r;
                prev_out_g = curr_out_g;
                prev_out_b = curr_out_b;
                prev_out_a = curr_out_a;
    
                prev_src_r = curr_src_r;
                prev_src_g = curr_src_g;
                prev_src_b = curr_src_b;
                prev_src_a = curr_src_a;
    
                line[line_index] = prev_out_r;
                line[line_index + 1] = prev_out_g;
                line[line_index + 2] = prev_out_b;
                line[line_index + 3] = prev_out_a;
                line_index += 4;
                src_index++;
            }
    
            src_index--;
            line_index -= 4;
            out_index += height * (width - 1);
    
            // right to left
            rgba = src[src_index];
    
            prev_src_r = rgba & 0xff;
            prev_src_g = (rgba >> 8) & 0xff;
            prev_src_b = (rgba >> 16) & 0xff;
            prev_src_a = (rgba >> 24) & 0xff;
    
            prev_prev_out_r = prev_src_r * coeff[7];
            prev_prev_out_g = prev_src_g * coeff[7];
            prev_prev_out_b = prev_src_b * coeff[7];
            prev_prev_out_a = prev_src_a * coeff[7];
    
            prev_out_r = prev_prev_out_r;
            prev_out_g = prev_prev_out_g;
            prev_out_b = prev_prev_out_b;
            prev_out_a = prev_prev_out_a;
    
            curr_src_r = prev_src_r;
            curr_src_g = prev_src_g;
            curr_src_b = prev_src_b;
            curr_src_a = prev_src_a;
    
            coeff_a0 = coeff[2];
            coeff_a1 = coeff[3];
    
            for (j = width - 1; j >= 0; j--) {
                curr_out_r = curr_src_r * coeff_a0 + prev_src_r * coeff_a1 + prev_out_r * coeff_b1 + prev_prev_out_r * coeff_b2;
                curr_out_g = curr_src_g * coeff_a0 + prev_src_g * coeff_a1 + prev_out_g * coeff_b1 + prev_prev_out_g * coeff_b2;
                curr_out_b = curr_src_b * coeff_a0 + prev_src_b * coeff_a1 + prev_out_b * coeff_b1 + prev_prev_out_b * coeff_b2;
                curr_out_a = curr_src_a * coeff_a0 + prev_src_a * coeff_a1 + prev_out_a * coeff_b1 + prev_prev_out_a * coeff_b2;
    
                prev_prev_out_r = prev_out_r;
                prev_prev_out_g = prev_out_g;
                prev_prev_out_b = prev_out_b;
                prev_prev_out_a = prev_out_a;
    
                prev_out_r = curr_out_r;
                prev_out_g = curr_out_g;
                prev_out_b = curr_out_b;
                prev_out_a = curr_out_a;
    
                prev_src_r = curr_src_r;
                prev_src_g = curr_src_g;
                prev_src_b = curr_src_b;
                prev_src_a = curr_src_a;
    
                rgba = src[src_index];
                curr_src_r = rgba & 0xff;
                curr_src_g = (rgba >> 8) & 0xff;
                curr_src_b = (rgba >> 16) & 0xff;
                curr_src_a = (rgba >> 24) & 0xff;
    
                rgba = ((line[line_index] + prev_out_r) << 0) +
                    ((line[line_index + 1] + prev_out_g) << 8) +
                    ((line[line_index + 2] + prev_out_b) << 16) +
                    ((line[line_index + 3] + prev_out_a) << 24);
    
                out[out_index] = rgba;
    
                src_index--;
                line_index -= 4;
                out_index -= height;
            }
        }
    }
};

// Processing ImageData
Processing.ImageData = function (a, b, c) {
    this.colorSpace = "srgb";

    if (c === undefined) {
        this.width = a;
        this.height = b;
        this.data = new Uint8ClampedArray(a * b * 4);
    } else {
        this.width = b;
        this.height = c;
        this.data = new Uint8ClampedArray(b * c * 4);

        for (var i = 0; i < a.length; i++) {
            this.data[i] = a[i];
        }
    }
};

// Processing Canvas
Processing.Canvas = function (width, height) {
    this.width = width;
    this.height = height;
    this.context = undefined;
};

// Processing Canvas Context
Processing.Canvas.context = function (canvas) {
    this.canvas = canvas;
    this.imageData = new Processing.ImageData(canvas.width, canvas.height);
    this.fillStyle = "#000000";
    this.strokeStyle = "#000000";
};

Processing.instance = function (canvas) {
    // "non" user usable properties
    this.externals = {};
    
    this.externals.context = canvas.getContext("2d");
    this.externals.imageData = this.externals.context.imageData;
    
    this.externals.currentFillColor = [255, 255, 255, 255];
    this.externals.currentStrokeColor = [0, 0, 0, 255];
    this.externals.strokeWeight = 1;

    this.externals.colorModeA = 255;
    this.externals.colorModeX = 255;
    this.externals.colorModeY = 255;
    this.externals.colorModeZ = 255;
    this.externals.curColorMode = Processing.PConstants.RGB;

    this.externals.startMS = Date.now();
    
    this.externals.targetFrameRate = 60;
    
    this.externals.frameRateTimer = this.startMS;
    this.externals.frameRateCounter = 0;
    
    this.externals.vertArray = [];
    this.externals.curShape = undefined;
    
    // user usable properties
    for (var prop in Processing.PConstants) {
        this[prop] = Processing.PConstants[prop];
    }
    
    this.width = canvas.width;
    this.height = canvas.height;

    this.frameCount = 0;
    this.angleMode = "degrees";

    this.__frameRate = 60;

    this.draw = function () {};

    // run draw function
    var that = this;
    this.runInterval = setInterval(function () {
        that.draw();

        that.frameCount++;

        that.frameRateCounter++;

        if (Date.now() > that.frameRateTimer + 500) {
            that.__frameRate = that.frameRateCounter * 2;
            that.frameRateCounter = 0;
            that.frameRateTimer = Date.now();
        }
    }, 1000 / this.targetFrameRate);
};

// Instance Draw Commands
Processing.instance.prototype.color = function (r, g, b, a) {
    if (g === undefined) {
        g = r;
        b = r;
    }

    r = Math.round(r);
    g = Math.round(g);
    b = Math.round(b);
    a = a === undefined ? 255 : Math.round(a);

    r = (r < 0) ? 0 : r;
    g = (g < 0) ? 0 : g;
    b = (b < 0) ? 0 : b;
    a = (a < 0) ? 0 : a;
    r = (r > 255) ? 255 : r;
    g = (g > 255) ? 255 : g;
    b = (b > 255) ? 255 : b;
    a = (a > 255) ? 255 : a;

    return (a << 24) & Processing.PConstants.ALPHA_MASK | (r << 16) & Processing.PConstants.RED_MASK | (g << 8) & Processing.PConstants.GREEN_MASK | b & Processing.PConstants.BLUE_MASK;
};

Processing.instance.prototype.background = function (r, g, b) {
    var p = this.externals.imageData.data;

    for (var i = 0; i < p.length; i += 4) {
        p[i] = r;
        p[i + 1] = g;
        p[i + 2] = b;
        p[i + 3] = 255;
    }
};

Processing.instance.prototype.noFill = function () {
    this.externals.currentFillColor[3] = 0;
};

Processing.instance.prototype.noStroke = function () {
    this.externals.currentStrokeColor[3] = 0;
};

Processing.instance.prototype.fill = function (r, g, b, a) {
    if (g === undefined) {
        if (r >= 0 && r <= 255) {
            this.externals.currentFillColor = [r, r, r, 255];
        } else {
            this.externals.currentFillColor = Processing.utils.decodeColor(r);
        }
    } else {
        this.externals.currentFillColor = [r, g, b, a || 255];
    }
};

Processing.instance.prototype.stroke = function (r, g, b, a) {
    if (g === undefined) {
        if (r >= 0 && r <= 255) {
            this.externals.currentStrokeColor = [r, r, r, 255];
        } else {
            this.externals.currentStrokeColor = Processing.utils.decodeColor(r);
        }
    } else {
        this.externals.currentStrokeColor = [r, g, b, a || 255];
    }
};

Processing.instance.prototype.strokeWeight = function (w) {
    this.externals.strokeWeight = w;
    if (this.externals.strokeWeight < 1) {
        this.externals.strokeWeight = 1;
    }
};

Processing.instance.prototype.point = function (x, y) {
    if (y === undefined) { return }
    
    x = Math.round(x);
    y = Math.round(y);

    var p = this.externals.imageData.data;
    var WIDTH = this.externals.imageData.width;
    var strokeWeight = this.externals.strokeWeight;
    
    if (x >= 0 && x < WIDTH && strokeWeight === 1) {
        var idx = (x + y * WIDTH) << 2;
    
        p[idx] = this.externals.currentStrokeColor[0];
        p[idx + 1] = this.externals.currentStrokeColor[1];
        p[idx + 2] = this.externals.currentStrokeColor[2];
        p[idx + 2] = this.externals.currentStrokeColor[3];
    } else {
        var a = this.externals.currentStrokeColor[3];
        var fc = this.externals.currentFillColor;
        
        this.externals.currentStrokeColor[3] = 0;
        this.externals.currentFillColor = this.externals.currentStrokeColor;
        
        this.ellipse(x, y, strokeWeight, strokeWeight);
        
        this.externals.currentStrokeColor[3] = a;
        this.externals.currentFillColor = fc;
    }
};

Processing.instance.prototype.line = function (x0, y0, x1, y1) {
    if (y1 === undefined) { return }
    
    x0 = Math.round(x0);
    y0 = Math.round(y0);
    x1 = Math.round(x1);
    y1 = Math.round(y1);

    var strokeWeight = this.externals.strokeWeight;
    
    if (strokeWeight === 1) {
        var redC = this.externals.currentStrokeColor[0];
        var greenC = this.externals.currentStrokeColor[1];
        var blueC = this.externals.currentStrokeColor[2];
        var alphaC = this.externals.currentStrokeColor[3];
    
        var p = this.externals.imageData.data;
        var WIDTH = this.externals.imageData.width;
        
        var dx = Math.abs(x1 - x0);
        var dy = Math.abs(y1 - y0);
        var sx = (x0 < x1) ? 1 : -1;
        var sy = (y0 < y1) ? 1 : -1;
        var err = dx - dy;
        
        while (true) {
            if (x0 >= 0 && x0 < WIDTH) {
                var idx = (~~x0 + ~~y0 * WIDTH) << 2;
                p[idx] = redC;
                p[idx + 1] = greenC;
                p[idx + 2] = blueC;
                p[idx + 3] = alphaC;
            }
        
            if (x0 === x1 && y0 === y1) {
                break;
            }
    
            var e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x0 += sx;
            }
            if (e2 < dx) {
                err += dx;
                y0 += sy;
            }
        }
    } else {
        var len = this.dist(x0, y0, x1, y1);
        
        this.externals.strokeWeight = 1;
        
        var a = this.externals.currentStrokeColor[3];
        var fc = this.externals.currentFillColor;
        
        this.externals.currentFillColor = this.externals.currentStrokeColor.slice(0, 4);
        this.externals.currentStrokeColor[3] = 0;
        
        var halfSW = strokeWeight / 2;
        
        var xo = (y0 - y1) / len * halfSW;
        var yo = (x0 - x1) / len * halfSW;
        
        this.quad(
            x0 + xo, y0 - yo,
            x1 + xo, y1 - yo,
            x1 - xo, y1 + yo,
            x0 - xo, y0 + yo
        );
        
        this.ellipse(x0, y0, strokeWeight, strokeWeight);
        this.ellipse(x1, y1, strokeWeight, strokeWeight);
        
        this.externals.currentStrokeColor[3] = a;
        this.externals.currentFillColor = fc;
        
        this.externals.strokeWeight = strokeWeight;
    }
};

Processing.instance.prototype.rect = function (x, y, w, h) {
    if (h === undefined) { return }
    
    x = Math.round(x);
    y = Math.round(y);
    w = Math.round(w);
    h = Math.round(h);

    var redC = this.externals.currentFillColor[0];
    var greenC = this.externals.currentFillColor[1];
    var blueC = this.externals.currentFillColor[2];
    var alphaC = this.externals.currentFillColor[3];

    var WIDTH = this.externals.imageData.width;
    var HEIGHT = this.externals.imageData.height;
    var p = this.externals.imageData.data;

    var yStart = Math.max(y, 0);
    var xStart = Math.max(x, 0);
    var yStop = Math.min(y + h, HEIGHT);
    var xStop = Math.min(x + w, WIDTH);

    for (var yy = yStart; yy < yStop; yy++) {
        var idx = (xStart + yy * WIDTH) << 2;

        for (var xx = xStart; xx < xStop; xx++) {
            p[idx] = redC;
            p[idx + 1] = greenC;
            p[idx + 2] = blueC;
            p[idx + 3] = alphaC;

            idx += 4;
        }
    }

    if (this.externals.currentStrokeColor[3] > 0) {
        this.line(x, y, x + w, y);
        this.line(x + w, y, x + w, y + h);
        this.line(x, y + h, x + w, y + h);
        this.line(x, y, x, y + h);
    }
};

Processing.instance.prototype.ellipse = function (x, y, w, h) {
    if (h === undefined) { return }
    
    x = Math.round(x);
    y = Math.round(y);
    w = w / 2;
    h = h / 2;

    var n = w;
    var w2 = w * w;
    var h2 = h * h;

    var redC = this.externals.currentFillColor[0];
    var greenC = this.externals.currentFillColor[1];
    var blueC = this.externals.currentFillColor[2];
    var alphaC = this.externals.currentFillColor[3];

    var p = this.externals.imageData.data;
    var WIDTH = this.externals.imageData.width;

    var xStop = Math.min(x + w, WIDTH);
    for (var i = Math.max(x - w, 0); i < xStop; i++) {
        if (i >= 0 && i < WIDTH) {
            var idx = (i + y * WIDTH) << 2;
            p[idx] = redC;
            p[idx + 1] = greenC;
            p[idx + 2] = blueC;
            p[idx + 3] = alphaC;
        }
    }

    for (var j = 1; j < h; j++) {
        var ra = y + j;
        var rb = y - j;

        while (w2 * (h2 - j * j) < h2 * n * n && n !== 0) {
            n--;
        }

        xStop = Math.min(x + n, WIDTH);
        for (var i = Math.max(x - n, 0); i < xStop; i++) {
            if (i >= 0 && i < WIDTH) {
                var idx = (i + ra * WIDTH) << 2;
                p[idx] = redC;
                p[idx + 1] = greenC;
                p[idx + 2] = blueC;
                p[idx + 3] = 255;
    
                idx = (i + rb * WIDTH) << 2;
                p[idx] = redC;
                p[idx + 1] = greenC;
                p[idx + 2] = blueC;
                p[idx + 3] = 255;
            }
        }
    }
    
    if (this.externals.currentStrokeColor[3] > 0) {
        redC = this.externals.currentStrokeColor[0];
        greenC = this.externals.currentStrokeColor[1];
        blueC = this.externals.currentStrokeColor[2];
    
        var a = w / 2;
        var b = h / 2;
        var perim = Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)));
        var incr = Math.PI * 2 / perim / 3;
    
        for (var i = 0; i < Math.PI * 2; i += incr) {
            var xPos = ~~(x + Math.cos(i) * w);
            
            if (xPos >= 0 && xPos < WIDTH) {
                var idx = (xPos + ~~(y + Math.sin(i) * h) * WIDTH) << 2;
        
                p[idx] = redC;
                p[idx + 1] = greenC;
                p[idx + 2] = blueC;
                p[idx + 3] = 255;
            }
        }
    }
};

Processing.instance.prototype.triangle = function (x1, y1, x2, y2, x3, y3) {
    if (y3 === undefined) { return }
    
    x1 = Math.round(x1);
    y1 = Math.round(y1);
    x2 = Math.round(x2);
    y2 = Math.round(y2);
    x3 = Math.round(x3);
    y3 = Math.round(y3);

    var p = this.externals.imageData.data;
    var WIDTH = this.externals.imageData.width;
    var HEIGHT = this.externals.imageData.height;

    var minx = Math.max(0, Math.min(x1, x2, x3));
    var maxx = Math.min(WIDTH, Math.max(x1, x2, x3));
    var miny = Math.max(0, Math.min(y1, y2, y3));
    var maxy = Math.min(HEIGHT, Math.max(y1, y2, y3));

    var redC = this.externals.currentFillColor[0];
    var greenC = this.externals.currentFillColor[1];
    var blueC = this.externals.currentFillColor[2];
    var alphaC = this.externals.currentFillColor[3];

    for (var x = minx; x < maxx; x++) {
        for (var y = miny; y < maxy; y++) {
            var w1 = (x1 * (y3 - y1) + (y - y1) * (x3 - x1) - x * (y3 - y1)) / ((y2 - y1) * (x3 - x1) - (x2 - x1) * (y3 - y1));
            var w2 = (x1 * (y2 - y1) + (y - y1) * (x2 - x1) - x * (y2 - y1)) / ((y3 - y1) * (x2 - x1) - (x3 - x1) * (y2 - y1));

            if (w1 >= 0 && w2 >= 0 && w1 + w2 <= 1) {
                var idx = (x + y * WIDTH) << 2;
                p[idx] = redC;
                p[idx + 1] = greenC;
                p[idx + 2] = blueC;
                p[idx + 3] = alphaC;
            }
        }
    }
    
    if (this.externals.currentStrokeColor[3] > 0) {
        this.line(x1, y1, x2, y2);
        this.line(x2, y2, x3, y3);
        this.line(x3, y3, x1, y1);
    }
};

Processing.instance.prototype.quad = function (x1, y1, x2, y2, x3, y3, x4, y4) {
    if (y4 === undefined) { return }
    
    x1 = Math.round(x1);
    y1 = Math.round(y1);
    x2 = Math.round(x2);
    y2 = Math.round(y2);
    x3 = Math.round(x3);
    y3 = Math.round(y3);
    x4 = Math.round(x4);
    y4 = Math.round(y4);

    var type, cavePt, tri1, tri2;

    if (Processing.utils.line_lineColl(x1, y1, x3, y3, x2, y2, x4, y4)) {
        type = 1;
    } else {
        type = 2;

        if (Processing.utils.point_triangleColl(x1, y1, x2, y2, x3, y3, x4, y4)) {
            cavePt = 0;
        } else if (Processing.utils.point_triangleColl(x2, y2, x3, y3, x4, y4, x1, y1)) {
            cavePt = 1;
        } else if (Processing.utils.point_triangleColl(x3, y3, x4, y4, x1, y1, x2, y2)) {
            cavePt = 2;
        } else if (Processing.utils.point_triangleColl(x4, y4, x1, y1, x2, y2, x3, y3)) {
            cavePt = 3;
        } else {
            type = 3;
        }
    }

    switch (type) {
        case 1:
            tri1 = [x1, y1, x2, y2, x3, y3];
            tri2 = [x1, y1, x3, y3, x4, y4];
            break;
        case 2:
            var oppositePt = cavePt + 2;
            if (oppositePt > 3) {
                oppositePt %= 4;
            }

            var pts = [0, 1, 2, 3];
            pts.splice(pts.indexOf(cavePt), 1);
            pts.splice(pts.indexOf(oppositePt), 1);

            var vals = [
                [x1, y1],
                [x2, y2],
                [x3, y3],
                [x4, y4]
            ];

            tri1 = [vals[pts[0]][0], vals[pts[0]][1], vals[cavePt][0], vals[cavePt][1], vals[oppositePt][0], vals[oppositePt][1]];
            tri2 = [vals[pts[1]][0], vals[pts[1]][1], vals[cavePt][0], vals[cavePt][1], vals[oppositePt][0], vals[oppositePt][1]];
            break;
        case 3:
            var intersect = Processing.utils.getLineLineIntersect(x1, y1, x2, y2, x3, y3, x4, y4);
            if (intersect) {
                tri1 = [intersect[0], intersect[1], x2, y2, x3, y3];
                tri2 = [intersect[0], intersect[1], x1, y1, x4, y4];
            } else {
                intersect = Processing.utils.getLineLineIntersect(x1, y1, x4, y4, x2, y2, x3, y3);
                tri1 = [intersect[0], intersect[1], x1, y1, x2, y2];
                tri2 = [intersect[0], intersect[1], x3, y3, x4, y4];
            }
            break;
    }

    var storeAlpha = this.externals.currentStrokeColor[3];
    this.externals.currentStrokeColor[3] = 0;
    
    this.triangle(tri1[0], tri1[1], tri1[2], tri1[3], tri1[4], tri1[5]);
    this.triangle(tri2[0], tri2[1], tri2[2], tri2[3], tri2[4], tri2[5]);
    
    this.externals.currentStrokeColor[3] = storeAlpha;
    
    if (storeAlpha > 0) {
        this.line(x1, y1, x2, y2);
        this.line(x2, y2, x3, y3);
        this.line(x3, y3, x4, y4);
        this.line(x4, y4, x1, y1);
    }
};

Processing.instance.prototype.beginShape = function (type) {
    this.externals.vertArray = [];
    this.externals.curShape = type;
};

Processing.instance.prototype.vertex = function (x, y) {
    if (y === undefined) { return }
    
    this.externals.vertArray.push([
        x, y, 
        this.externals.currentFillColor
    ]);
};


Processing.instance.prototype.endShape = function (mode) {
    var verts = this.externals.vertArray;
    var newVerts = [];
    
    for (var i = 0; i < verts.length; i++) {
        newVerts.push(verts[i][0]);
        newVerts.push(verts[i][1]);
    }
    
    var consts = Processing.PConstants;
    var type = this.externals.curShape;
    
    if (type === undefined && mode === undefined) {
        Processing.utils.renderPolygon(this.externals.imageData, newVerts, verts[0][2]);
        
        for (var i = 0; i < verts.length - 1; i++) {
            this.line(verts[i][0], verts[i][1], verts[i + 1][0], verts[i + 1][1]);
        }
        
    } else if (type === consts.POINTS) {
        for (var i = 0; i < verts.length; i++) {
            this.point(verts[i][0], verts[i][1]);
        }
        
    } else if (type === consts.LINES) {
        
        for (var i = 0; i < verts.length - 1; i += 2) {
            this.line(verts[i][0], verts[i][1], verts[i + 1][0], verts[i + 1][1]);
        }
        
    } else if (type === consts.TRIANGLES) {
        for (var i = 0; i < verts.length - 2; i += 3) {
            this.triangle(
                verts[i][0], verts[i][1],
                verts[i + 1][0], verts[i + 1][1],
                verts[i + 2][0], verts[i + 2][1]
            );
        }
        
    } else if (type === consts.TRIANGLE_STRIP) {
        for (var i = 0; i < verts.length - 2; i++) {
            this.triangle(
                verts[i][0], verts[i][1],
                verts[i + 1][0], verts[i + 1][1],
                verts[i + 2][0], verts[i + 2][1]
            );
        }
        
    } else if (type === consts.TRIANGLE_FAN) {
        for (var i = 1; i < verts.length - 1; i++) {
            this.triangle(
                verts[0][0], verts[0][1],
                verts[i][0], verts[i][1],
                verts[i + 1][0], verts[i + 1][1]
            );
        }
        
    } else if (type === consts.QUADS) {
        for (var i = 0; i < verts.length - 3; i += 4) {
            this.quad(
                verts[i][0], verts[i][1],
                verts[i + 1][0], verts[i + 1][1],
                verts[i + 2][0], verts[i + 2][1],
                verts[i + 3][0], verts[i + 3][1]
            );
        }
        
    } else if (type === consts.QUAD_STRIP) {
        for (var i = 0; i < verts.length - 3; i += 2) {
            this.quad(
                verts[i][0], verts[i][1],
                verts[i + 1][0], verts[i + 1][1],
                verts[i + 3][0], verts[i + 3][1],
                verts[i + 2][0], verts[i + 2][1]
            );
        }
        
    } else if (mode === consts.CLOSE) {
        Processing.utils.renderPolygon(this.externals.imageData, newVerts, verts[0][2]);
        
        for (var i = 0; i < verts.length; i++) {
            this.line(verts[i][0], verts[i][1], verts[(i + 1) % verts.length][0], verts[(i + 1) % verts.length][1]);
        }
    }
};

Processing.instance.prototype.filter = function (kind, param) {
    var consts = Processing.PConstants;
    
    var p = this.externals.imageData.data;
    var WIDTH = this.externals.imageData.width;
    var HEIGHT = this.externals.imageData.height;
    
    switch (kind) {
        case consts.BLUR:
            var radius = param || 1;
            
            var a0, a1, a2, a3, b1, b2, left_corner, right_corner;
        
            // Unify input data type, to keep convolver calls isomorphic
            var src32 = new Uint32Array(p.buffer);
        
            var out = new Uint32Array(src32.length);
            var tmp_line = new Float32Array(Math.max(WIDTH, HEIGHT) * 4);
        
            // gaussCoef
            var sigma = radius;
            if (sigma < 0.5) {
                sigma = 0.5;
            }
            
            var a = Math.exp(0.726 * 0.726) / sigma,
                g1 = Math.exp(-a),
                g2 = Math.exp(-2 * a),
                k = (1 - g1) * (1 - g1) / (1 + 2 * a * g1 - g2);
            
            a0 = k;
            a1 = k * (a - 1) * g1;
            a2 = k * (a + 1) * g1;
            a3 = -k * g2;
            b1 = 2 * g1;
            b2 = -g2;
            left_corner = (a0 + a1) / (1 - b1 - b2);
            right_corner = (a2 + a3) / (1 - b1 - b2);
          
            var coeff = new Float32Array([ a0, a1, a2, a3, b1, b2, left_corner, right_corner ]);
        
            Processing.utils.convolveRGBA(src32, out, tmp_line, coeff, WIDTH, HEIGHT, radius);
            Processing.utils.convolveRGBA(out, src32, tmp_line, coeff, HEIGHT, WIDTH, radius);

        break;
        case consts.GRAY:
            for (var i = 0; i < p.length; i += 4) {
                var avg = (p[i] + p[i + 1] + p[i + 2]) / 3;
                
                p[i] = avg;
                p[i + 1] = avg;
                p[i + 2] = avg;
            }
        break;
        case consts.INVERT:
            for (var i = 0; i < p.length; i += 4) {
                p[i] = 255 - p[i];
                p[i + 1] = 255 - p[i + 1];
                p[i + 2] = 255 - p[i + 2];
            }
        break;
        case consts.OPAQUE:
            for (var i = 0; i < p.length; i += 4) {
                p[i + 3] = 255;
            }
        break;
        case consts.POSTERIZE:
            var levels = ~~this.constrain(param, 2, 255);
            
            var t1 = new Array(levels); // array of byte
            for (var i = 0; i < levels; i++){
                t1[i] = Math.round(255 * i / (levels - 1));
            }
            var lookUpTable = new Array(256); // array of byte
            var j = 0; // byte
            var k = 0; // int16
            for (var i = 0; i <= 255; i++) {
                lookUpTable[i] = t1[j];
                k += levels;
                if (k > 255) {
                    k -= 255;
                    j++;
                }
            }
            
            for (var i = 0; i < p.length; i += 4) {
                p[i] = lookUpTable[p[i]];
                p[i + 1] = lookUpTable[p[i + 1]];
                p[i + 2] = lookUpTable[p[i + 2]];
            }
        break;
        case consts.THRESHOLD:
            if (param === undefined) {
                param = 0.5;
            } else {
                param = this.constrain(0, 1);
            }
            
            param *= 255;
            
            for (var i = 0; i < p.length; i += 4) {
                if (Math.max(p[i], p[i + 1], p[i + 2]) < param) {
                    p[i] = 0;
                    p[i + 1] = 0;
                    p[i + 2] = 0;
                } else {
                    p[i] = 255;
                    p[i + 1] = 255;
                    p[i + 2] = 255;
                }
                
            }
        break;
        case consts.ERODE:
            // ---
        break;
        case consts.DILATE:
            // ---
        break;
    }
    
};

// Instance Math Commands
Processing.instance.prototype.random = function (a, b) {
    if (a === undefined) {
        return Math.random();
    }
    if (b === undefined) {
        return Math.random() * a;
    }
    return Math.random() * (b - a) + a;
};

Processing.instance.prototype.dist = function (a, b, c, d, e, f) {
    var dx, dy, dz;
    if (e === undefined) {
        dx = a - c;
        dy = b - d;
        return Math.sqrt(dx * dx + dy * dy);
    } else {
        dx = a - d;
        dy = b - e;
        dz = c - f;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
};

Processing.instance.prototype.constrain = function (aNumber, aMin, aMax) {
    return aNumber > aMax ? aMax : aNumber < aMin ? aMin : aNumber;
};

Processing.instance.prototype.min = function () {
    var nums = arguments;
    var min = Infinity;

    for (var i = 0; i < nums.length; i++) {
        if (nums[i] < min) {
            min = nums[i];
        }
    }

    return min;
};

Processing.instance.prototype.max = function () {
    var nums = arguments;
    var max = -Infinity;

    for (var i = 0; i < nums.length; i++) {
        if (nums[i] > max) {
            max = nums[i];
        }
    }

    return max;
};

Processing.instance.prototype.abs = Math.abs;

Processing.instance.prototype.log = Math.log;

Processing.instance.prototype.pow = Math.pow;

Processing.instance.prototype.sq = function (n) {
    return n * n;
};

Processing.instance.prototype.sqrt = Math.sqrt;

Processing.instance.prototype.round = Math.round;

Processing.instance.prototype.floor = Math.floor;

Processing.instance.prototype.ceil = Math.ceil;

Processing.instance.prototype.mag = function (a, b, c) {
    if (c) {
        return Math.sqrt(a * a + b * b + c * c);
    } else {
        return Math.sqrt(a * a + b * b);
    }
};

Processing.instance.prototype.exp = Math.exp;

Processing.instance.prototype.map = function (value, istart, istop, ostart, ostop) {
    return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
};

Processing.instance.prototype.norm = function (aNumber, low, high) {
    return (aNumber - low) / (high - low);
};

Processing.instance.prototype.lerp = function (value1, value2, amt) {
    return ((value2 - value1) * amt) + value1;
};

Processing.instance.prototype.lerpColor = function (clr1, clr2, amt) {
    clr1 = Processing.utils.decodeColor(clr1);
    clr2 = Processing.utils.decodeColor(clr1);

    return [
        Math.round(this.lerp(clr1[0], clr2[0], amt)),
        Math.round(this.lerp(clr1[0], clr2[0], amt)),
        Math.round(this.lerp(clr1[0], clr2[0], amt)),
        Math.round(this.lerp(clr1[0], clr2[0], amt))
    ];
};

Processing.instance.prototype.sin = function (ang) {
    if (this.angleMode === "degrees") {
        return Math.sin(ang * Math.PI / 180);
    } else {
        return Math.sin(ang);
    }
};

Processing.instance.prototype.cos = function (ang) {
    if (this.angleMode === "degrees") {
        return Math.cos(ang * Math.PI / 180);
    } else {
        return Math.cos(ang);
    }
};

Processing.instance.prototype.tan = function (ang) {
    if (this.angleMode === "degrees") {
        return Math.tan(ang * Math.PI / 180);
    } else {
        return Math.tan(ang);
    }
};

Processing.instance.prototype.acos = function (ang) {
    if (this.angleMode === "degrees") {
        return Math.acos(ang) * 180 / Math.PI;
    } else {
        return Math.acos(ang);
    }
};

Processing.instance.prototype.asin = function (ang) {
    if (this.angleMode === "degrees") {
        return Math.asin(ang) * 180 / Math.PI;
    } else {
        return Math.asin(ang);
    }
};

Processing.instance.prototype.atan = function (ang) {
    if (this.angleMode === "degrees") {
        return Math.atan(ang) * 180 / Math.PI;
    } else {
        return Math.atan(ang);
    }
};

Processing.instance.prototype.atan2 = function (ang) {
    if (this.angleMode === "degrees") {
        return Math.atan2(ang) * 180 / Math.PI;
    } else {
        return Math.atan2(ang);
    }
};

Processing.instance.prototype.radians = function (aAngle) {
    return (aAngle / 180) * Math.PI;
};

Processing.instance.prototype.degrees = function (aAngle) {
    return (aAngle * 180) / Math.PI;
};

// Instance Date & Time Methods
Processing.instance.prototype.day = function () {
    return new Date().getDate();
};

Processing.instance.prototype.month = function () {
    return new Date().getMonth() + 1;
};

Processing.instance.prototype.year = function () {
    return new Date().getFullYear();
};

Processing.instance.prototype.hour = function () {
    return new Date().getHours();
};

Processing.instance.prototype.minute = function () {
    return new Date().getMinutes();
};

Processing.instance.prototype.second = function () {
    return new Date().getSeconds();
};

Processing.instance.prototype.millis = function (ang) {
    return Date.now() - this.startMS;
};


// Instance Env Commands
Processing.instance.prototype.println = console.log;

Processing.instance.prototype.print = console.log;

Processing.instance.prototype.debug = function () {
    console.log.apply(console, arguments);
};

Processing.instance.prototype.frameRate = function (fps) {
    this.targetFrameRate = fps;

    clearInterval(this.runInterval);

    var that = this;

    this.runInterval = setInterval(function () {
        that.draw();

        that.frameCount++;

        that.frameRateCounter++;

        if (Date.now() > that.frameRateTimer + 500) {
            that.__frameRate = that.frameRateCounter * 2;
            that.frameRateCounter = 0;
            that.frameRateTimer = Date.now();
        }
    }, 1000 / this.targetFrameRate);
};

Processing.instance.prototype.noLoop = function () {
    clearInterval(this.runInterval);
};

Processing.instance.prototype.loop = function () {
    var that = this;

    this.runInterval = setInterval(function () {
        that.draw();

        that.frameCount++;

        that.frameRateCounter++;

        if (Date.now() > that.frameRateTimer + 500) {
            that.__frameRate = that.frameRateCounter * 2;
            that.frameRateCounter = 0;
            that.frameRateTimer = Date.now();
        }
    }, 1000 / this.targetFrameRate);
};

// Canvas Get Context
Processing.Canvas.prototype.getContext = function (mode) {
    this.context = this.context || new Processing.Canvas.context(this);
    return this.context;
};

// Convert Canvas to base64
Processing.Canvas.prototype.toDataURL = function (type, quality) {
    var imgData = this.context.imageData;

    if (type === "jpeg") {
        var img = Processing.utils.encodeJPEG({
            data: imgData.data,
            width: imgData.width,
            height: imgData.height,
        }, quality);

        var bin = "";
        for (var i = 0; i < img.data.length; i++) {
            bin += String.fromCharCode(img.data[i]);
        }

        return "data:image/jpeg;base64," + Processing.btoa(bin);
    } else if (type === "png") {

    }

};

// Processing createCanvas
Processing.createCanvas = function (width, height) {
    return new Processing.Canvas(width, height);
};

exports = Object.assign(exports, Processing);
      
