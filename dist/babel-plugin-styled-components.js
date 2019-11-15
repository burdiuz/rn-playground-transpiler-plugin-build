'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var helperAnnotateAsPure = _interopDefault(require('@babel/helper-annotate-as-pure'));
var difference = _interopDefault(require('lodash/difference'));
var path$1 = _interopDefault(require('path'));
var fs = _interopDefault(require('fs'));
var helperModuleImports = _interopDefault(require('@babel/helper-module-imports'));

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var lib = createCommonjsModule(function (module, exports) {

exports.__esModule = true;

exports.default = function () {
  return {
    manipulateOptions: function manipulateOptions(opts, parserOpts) {
      parserOpts.plugins.push("jsx");
    }
  };
};

module.exports = exports["default"];
});

unwrapExports(lib);

var options = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useCssProp = exports.usePureAnnotation = exports.useTranspileTemplateLiterals = exports.useMinify = exports.useFileName = exports.useSSR = exports.useDisplayName = void 0;

function getOption(_ref, name) {
  var opts = _ref.opts;
  var defaultValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  return opts[name] === undefined || opts[name] === null ? defaultValue : opts[name];
}

var useDisplayName = function useDisplayName(state) {
  return getOption(state, 'displayName');
};

exports.useDisplayName = useDisplayName;

var useSSR = function useSSR(state) {
  return getOption(state, 'ssr', true);
};

exports.useSSR = useSSR;

var useFileName = function useFileName(state) {
  return getOption(state, 'fileName');
};

exports.useFileName = useFileName;

var useMinify = function useMinify(state) {
  return getOption(state, 'minify');
};

exports.useMinify = useMinify;

var useTranspileTemplateLiterals = function useTranspileTemplateLiterals(state) {
  return getOption(state, 'transpileTemplateLiterals');
};

exports.useTranspileTemplateLiterals = useTranspileTemplateLiterals;

var usePureAnnotation = function usePureAnnotation(state) {
  return getOption(state, 'pure', false);
};

exports.usePureAnnotation = usePureAnnotation;

var useCssProp = function useCssProp(state) {
  return getOption(state, 'cssProp', true);
};

exports.useCssProp = useCssProp;
});

unwrapExports(options);
var options_1 = options.useCssProp;
var options_2 = options.usePureAnnotation;
var options_3 = options.useTranspileTemplateLiterals;
var options_4 = options.useMinify;
var options_5 = options.useFileName;
var options_6 = options.useSSR;
var options_7 = options.useDisplayName;

var detectors = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isPureHelper = exports.isHelper = exports.isKeyframesHelper = exports.isInjectGlobalHelper = exports.isCreateGlobalStyleHelper = exports.isCSSHelper = exports.isStyled = exports.importLocalName = exports.isValidTopLevelImport = void 0;
var VALID_TOP_LEVEL_IMPORT_PATHS = ['styled-components', 'styled-components/no-tags', 'styled-components/native', 'styled-components/primitives'];

var isValidTopLevelImport = function isValidTopLevelImport(x) {
  return VALID_TOP_LEVEL_IMPORT_PATHS.includes(x);
};

exports.isValidTopLevelImport = isValidTopLevelImport;
var localNameCache = {};

var importLocalName = function importLocalName(name, state) {
  var bypassCache = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var cacheKey = name + state.file.opts.filename;

  if (!bypassCache && cacheKey in localNameCache) {
    return localNameCache[cacheKey];
  }

  var localName = state.styledRequired ? name === 'default' ? 'styled' : name : false;
  state.file.path.traverse({
    ImportDeclaration: {
      exit(path) {
        var node = path.node;

        if (isValidTopLevelImport(node.source.value)) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = path.get('specifiers')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var specifier = _step.value;

              if (specifier.isImportDefaultSpecifier()) {
                localName = specifier.node.local.name;
              }

              if (specifier.isImportSpecifier() && specifier.node.imported.name === name) {
                localName = specifier.node.local.name;
              }

              if (specifier.isImportNamespaceSpecifier()) {
                localName = specifier.node.local.name;
              }
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        }
      }

    }
  });
  localNameCache[cacheKey] = localName;
  return localName;
};

exports.importLocalName = importLocalName;

var isStyled = function isStyled(t) {
  return function (tag, state) {
    if (t.isCallExpression(tag) && t.isMemberExpression(tag.callee) && tag.callee.property.name !== 'default'
    /** ignore default for #93 below */
    ) {
        // styled.something()
        return isStyled(t)(tag.callee.object, state);
      } else {
      return t.isMemberExpression(tag) && tag.object.name === importLocalName('default', state) || t.isCallExpression(tag) && tag.callee.name === importLocalName('default', state) ||
      /**
       * #93 Support require()
       * styled-components might be imported using a require()
       * call and assigned to a variable of any name.
       * - styled.default.div``
       * - styled.default.something()
       */
      state.styledRequired && t.isMemberExpression(tag) && t.isMemberExpression(tag.object) && tag.object.property.name === 'default' && tag.object.object.name === state.styledRequired || state.styledRequired && t.isCallExpression(tag) && t.isMemberExpression(tag.callee) && tag.callee.property.name === 'default' && tag.callee.object.name === state.styledRequired;
    }
  };
};

exports.isStyled = isStyled;

var isCSSHelper = function isCSSHelper(t) {
  return function (tag, state) {
    return t.isIdentifier(tag) && tag.name === importLocalName('css', state);
  };
};

exports.isCSSHelper = isCSSHelper;

var isCreateGlobalStyleHelper = function isCreateGlobalStyleHelper(t) {
  return function (tag, state) {
    return t.isIdentifier(tag) && tag.name === importLocalName('createGlobalStyle', state);
  };
};

exports.isCreateGlobalStyleHelper = isCreateGlobalStyleHelper;

var isInjectGlobalHelper = function isInjectGlobalHelper(t) {
  return function (tag, state) {
    return t.isIdentifier(tag) && tag.name === importLocalName('injectGlobal', state);
  };
};

exports.isInjectGlobalHelper = isInjectGlobalHelper;

var isKeyframesHelper = function isKeyframesHelper(t) {
  return function (tag, state) {
    return t.isIdentifier(tag) && tag.name === importLocalName('keyframes', state);
  };
};

exports.isKeyframesHelper = isKeyframesHelper;

var isHelper = function isHelper(t) {
  return function (tag, state) {
    return isCSSHelper(t)(tag, state) || isKeyframesHelper(t)(tag, state);
  };
};

exports.isHelper = isHelper;

var isPureHelper = function isPureHelper(t) {
  return function (tag, state) {
    return isCSSHelper(t)(tag, state) || isKeyframesHelper(t)(tag, state) || isCreateGlobalStyleHelper(t)(tag, state);
  };
};

exports.isPureHelper = isPureHelper;
});

unwrapExports(detectors);
var detectors_1 = detectors.isPureHelper;
var detectors_2 = detectors.isHelper;
var detectors_3 = detectors.isKeyframesHelper;
var detectors_4 = detectors.isInjectGlobalHelper;
var detectors_5 = detectors.isCreateGlobalStyleHelper;
var detectors_6 = detectors.isCSSHelper;
var detectors_7 = detectors.isStyled;
var detectors_8 = detectors.importLocalName;
var detectors_9 = detectors.isValidTopLevelImport;

var pure = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _helperAnnotateAsPure = _interopRequireDefault(helperAnnotateAsPure);





function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function _default(t) {
  return function (path, state) {
    if ((0, options.usePureAnnotation)(state)) {
      if ((0, detectors.isStyled)(t)(path.node, state) || (0, detectors.isStyled)(t)(path.node.callee, state) || (0, detectors.isPureHelper)(t)(path.node.tag || path.node.callee, state)) {
        if (path.parent.type === 'VariableDeclarator' || path.parent.type === 'TaggedTemplateExpression') {
          (0, _helperAnnotateAsPure.default)(path);
        }
      }
    }
  };
};

exports.default = _default;
});

unwrapExports(pure);

var placeholderUtils = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.splitByPlaceholders = exports.makePlaceholder = exports.placeholderRegex = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// The capture group makes sure that the split contains the interpolation index
var placeholderRegex = /(?:__PLACEHOLDER_(\d+)__)/g; // Alternative regex that splits without a capture group

exports.placeholderRegex = placeholderRegex;
var placeholderNonCapturingRegex = /__PLACEHOLDER_(?:\d+)__/g; // Generates a placeholder from an index

var makePlaceholder = function makePlaceholder(index) {
  return `__PLACEHOLDER_${index}__`;
}; // Splits CSS by placeholders


exports.makePlaceholder = makePlaceholder;

var splitByPlaceholders = function splitByPlaceholders(_ref) {
  var _ref2 = _toArray(_ref),
      css = _ref2[0],
      rest = _ref2.slice(1);

  var capture = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  return [css.split(capture ? placeholderRegex : placeholderNonCapturingRegex)].concat(_toConsumableArray(rest));
};

exports.splitByPlaceholders = splitByPlaceholders;
});

unwrapExports(placeholderUtils);
var placeholderUtils_1 = placeholderUtils.splitByPlaceholders;
var placeholderUtils_2 = placeholderUtils.makePlaceholder;
var placeholderUtils_3 = placeholderUtils.placeholderRegex;

var minify_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.minifyCookedValues = exports.minifyRawValues = exports.minifyCooked = exports.minifyRaw = exports.compressSymbols = exports.stripLineComment = void 0;

var _difference = _interopRequireDefault(difference);



function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var injectUniquePlaceholders = function injectUniquePlaceholders(strArr) {
  var i = 0;
  return strArr.reduce(function (str, val, index, arr) {
    return str + val + (index < arr.length - 1 ? (0, placeholderUtils.makePlaceholder)(i++) : '');
  }, '');
};

var makeMultilineCommentRegex = function makeMultilineCommentRegex(newlinePattern) {
  return new RegExp('\\/\\*[^!](.|' + newlinePattern + ')*?\\*\\/', 'g');
};

var lineCommentStart = /\/\//g;
var symbolRegex = /(\s*[;:{},]\s*)/g; // Counts occurences of substr inside str

var countOccurences = function countOccurences(str, substr) {
  return str.split(substr).length - 1;
}; // Joins substrings until predicate returns true


var reduceSubstr = function reduceSubstr(substrs, join, predicate) {
  var length = substrs.length;
  var res = substrs[0];

  if (length === 1) {
    return res;
  }

  for (var i = 1; i < length; i++) {
    if (predicate(res)) {
      break;
    }

    res += join + substrs[i];
  }

  return res;
}; // Joins at comment starts when it's inside a string or parantheses
// effectively removing line comments


var stripLineComment = function stripLineComment(line) {
  return reduceSubstr(line.split(lineCommentStart), '//', function (str) {
    return !str.endsWith(':') && // NOTE: This is another guard against urls, if they're not inside strings or parantheses.
    countOccurences(str, "'") % 2 === 0 && countOccurences(str, '"') % 2 === 0 && countOccurences(str, '(') === countOccurences(str, ')');
  });
};

exports.stripLineComment = stripLineComment;

var compressSymbols = function compressSymbols(code) {
  return code.split(symbolRegex).reduce(function (str, fragment, index) {
    // Even-indices are non-symbol fragments
    if (index % 2 === 0) {
      return str + fragment;
    } // Only manipulate symbols outside of strings


    if (countOccurences(str, "'") % 2 === 0 && countOccurences(str, '"') % 2 === 0) {
      return str + fragment.trim();
    }

    return str + fragment;
  }, '');
}; // Detects lines that are exclusively line comments


exports.compressSymbols = compressSymbols;

var isLineComment = function isLineComment(line) {
  return line.trim().startsWith('//');
}; // Creates a minifier with a certain linebreak pattern


var minify = function minify(linebreakPattern) {
  var linebreakRegex = new RegExp(linebreakPattern + '\\s*', 'g');
  var multilineCommentRegex = makeMultilineCommentRegex(linebreakPattern);
  return function (code) {
    var newCode = code.replace(multilineCommentRegex, '\n') // Remove multiline comments
    .split(linebreakRegex) // Split at newlines
    .filter(function (line) {
      return line.length > 0 && !isLineComment(line);
    }) // Removes lines containing only line comments
    .map(stripLineComment) // Remove line comments inside text
    .join(' '); // Rejoin all lines

    var eliminatedExpressionIndices = (0, _difference.default)(code.match(placeholderUtils.placeholderRegex), newCode.match(placeholderUtils.placeholderRegex)).map(function (x) {
      return parseInt(x.match(/\d+/)[0], 10);
    });
    return [compressSymbols(newCode), eliminatedExpressionIndices];
  };
};

var minifyRaw = minify('(?:\\\\r|\\\\n|\\r|\\n)');
exports.minifyRaw = minifyRaw;
var minifyCooked = minify('[\\r\\n]');
exports.minifyCooked = minifyCooked;

var minifyRawValues = function minifyRawValues(rawValues) {
  return (0, placeholderUtils.splitByPlaceholders)(minifyRaw(injectUniquePlaceholders(rawValues)), false);
};

exports.minifyRawValues = minifyRawValues;

var minifyCookedValues = function minifyCookedValues(cookedValues) {
  return (0, placeholderUtils.splitByPlaceholders)(minifyCooked(injectUniquePlaceholders(cookedValues)), false);
};

exports.minifyCookedValues = minifyCookedValues;
});

unwrapExports(minify_1);
var minify_2 = minify_1.minifyCookedValues;
var minify_3 = minify_1.minifyRawValues;
var minify_4 = minify_1.minifyCooked;
var minify_5 = minify_1.minifyRaw;
var minify_6 = minify_1.compressSymbols;
var minify_7 = minify_1.stripLineComment;

var minify = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;







function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var _default = function _default(t) {
  return function (path, state) {
    if ((0, options.useMinify)(state) && ((0, detectors.isStyled)(t)(path.node.tag, state) || (0, detectors.isHelper)(t)(path.node.tag, state))) {
      var templateLiteral = path.node.quasi;
      var quasisLength = templateLiteral.quasis.length;

      var _minifyRawValues = (0, minify_1.minifyRawValues)(templateLiteral.quasis.map(function (x) {
        return x.value.raw;
      })),
          _minifyRawValues2 = _slicedToArray(_minifyRawValues, 1),
          rawValuesMinified = _minifyRawValues2[0];

      var _minifyCookedValues = (0, minify_1.minifyCookedValues)(templateLiteral.quasis.map(function (x) {
        return x.value.cooked;
      })),
          _minifyCookedValues2 = _slicedToArray(_minifyCookedValues, 2),
          cookedValuesMinfified = _minifyCookedValues2[0],
          eliminatedExpressionIndices = _minifyCookedValues2[1];

      eliminatedExpressionIndices.forEach(function (expressionIndex, iteration) {
        templateLiteral.expressions.splice(expressionIndex - iteration, 1);
      });

      for (var i = 0; i < quasisLength; i++) {
        var element = templateLiteral.quasis[i];
        element.value.raw = rawValuesMinified[i];
        element.value.cooked = cookedValuesMinfified[i];
      }
    }
  };
};

exports.default = _default;
});

unwrapExports(minify);

var getName = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * Get the name of variable that contains node
 *
 * @param  {Path} path to the node
 *
 * @return {String}   The target
 */
var _default = function _default(t) {
  return function (path) {
    var namedNode;
    path.find(function (path) {
      // const X = styled
      if (path.isAssignmentExpression()) {
        namedNode = path.node.left; // const X = { Y: styled }
      } else if (path.isObjectProperty()) {
        namedNode = path.node.key; // class Y { (static) X = styled }
      } else if (path.isClassProperty()) {
        namedNode = path.node.key; // let X; X = styled
      } else if (path.isVariableDeclarator()) {
        namedNode = path.node.id;
      } else if (path.isStatement()) {
        // we've hit a statement, we should stop crawling up
        return true;
      } // we've got an displayName (if we need it) no need to continue


      if (namedNode) return true;
    }); // foo.bar -> bar

    if (t.isMemberExpression(namedNode)) {
      namedNode = namedNode.property;
    } // identifiers are the only thing we can reliably get a name from


    return t.isIdentifier(namedNode) ? namedNode.name : undefined;
  };
};

exports.default = _default;
});

unwrapExports(getName);

var prefixDigit = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = prefixLeadingDigit;

function prefixLeadingDigit(str) {
  return str.replace(/^(\d)/, 'sc-$1');
}
});

unwrapExports(prefixDigit);

var hash = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * JS Implementation of MurmurHash2
 *
 * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
 * @see http://github.com/garycourt/murmurhash-js
 * @author <a href="mailto:aappleby@gmail.com">Austin Appleby</a>
 * @see http://sites.google.com/site/murmurhash/
 *
 * @param {string} str ASCII only
 * @return {string} Base 36 encoded hash result
 */
function murmurhash2_32_gc(str) {
  var l = str.length;
  var h = l;
  var i = 0;
  var k;

  while (l >= 4) {
    k = str.charCodeAt(i) & 0xff | (str.charCodeAt(++i) & 0xff) << 8 | (str.charCodeAt(++i) & 0xff) << 16 | (str.charCodeAt(++i) & 0xff) << 24;
    k = (k & 0xffff) * 0x5bd1e995 + (((k >>> 16) * 0x5bd1e995 & 0xffff) << 16);
    k ^= k >>> 24;
    k = (k & 0xffff) * 0x5bd1e995 + (((k >>> 16) * 0x5bd1e995 & 0xffff) << 16);
    h = (h & 0xffff) * 0x5bd1e995 + (((h >>> 16) * 0x5bd1e995 & 0xffff) << 16) ^ k;
    l -= 4;
    ++i;
  } // forgive existing code

  /* eslint-disable no-fallthrough */


  switch (l) {
    case 3:
      h ^= (str.charCodeAt(i + 2) & 0xff) << 16;

    case 2:
      h ^= (str.charCodeAt(i + 1) & 0xff) << 8;

    case 1:
      h ^= str.charCodeAt(i) & 0xff;
      h = (h & 0xffff) * 0x5bd1e995 + (((h >>> 16) * 0x5bd1e995 & 0xffff) << 16);
  }
  /* eslint-enable no-fallthrough */


  h ^= h >>> 13;
  h = (h & 0xffff) * 0x5bd1e995 + (((h >>> 16) * 0x5bd1e995 & 0xffff) << 16);
  h ^= h >>> 15;
  return (h >>> 0).toString(36);
}

var _default = murmurhash2_32_gc;
exports.default = _default;
});

unwrapExports(hash);

var displayNameAndId = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(path$1);

var _fs = _interopRequireDefault(fs);



var _getName = _interopRequireDefault(getName);

var _prefixDigit = _interopRequireDefault(prefixDigit);

var _hash = _interopRequireDefault(hash);



function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var addConfig = function addConfig(t) {
  return function (path, displayName, componentId) {
    if (!displayName && !componentId) {
      return;
    }

    var withConfigProps = [];

    if (displayName) {
      withConfigProps.push(t.objectProperty(t.identifier('displayName'), t.stringLiteral(displayName)));
    }

    if (componentId) {
      withConfigProps.push(t.objectProperty(t.identifier('componentId'), t.stringLiteral(componentId)));
    }

    if (path.node.tag) {
      // Replace x`...` with x.withConfig({ })`...`
      path.node.tag = t.callExpression(t.memberExpression(path.node.tag, t.identifier('withConfig')), [t.objectExpression(withConfigProps)]);
    } else {
      path.replaceWith(t.callExpression(t.callExpression(t.memberExpression(path.node.callee, t.identifier('withConfig')), [t.objectExpression(withConfigProps)]), path.node.arguments));
    }
  };
};

var getBlockName = function getBlockName(file) {
  var name = _path.default.basename(file.opts.filename, _path.default.extname(file.opts.filename));

  return name !== 'index' ? name : _path.default.basename(_path.default.dirname(file.opts.filename));
};

var getDisplayName = function getDisplayName(t) {
  return function (path, state) {
    var file = state.file;
    var componentName = (0, _getName.default)(t)(path);

    if (file) {
      var blockName = getBlockName(file);

      if (blockName === componentName) {
        return componentName;
      }

      return componentName ? `${(0, _prefixDigit.default)(blockName)}__${componentName}` : (0, _prefixDigit.default)(blockName);
    } else {
      return componentName;
    }
  };
};

var findModuleRoot = function findModuleRoot(filename) {
  if (!filename) {
    return null;
  }

  var dir = _path.default.dirname(filename);

  if (_fs.default.existsSync(_path.default.join(dir, 'package.json'))) {
    return dir;
  } else if (dir !== filename) {
    return findModuleRoot(dir);
  } else {
    return null;
  }
};

var FILE_HASH = 'styled-components-file-hash';
var COMPONENT_POSITION = 'styled-components-component-position';
var separatorRegExp = new RegExp(`\\${_path.default.sep}`, 'g');

var getFileHash = function getFileHash(state) {
  var file = state.file; // hash calculation is costly due to fs operations, so we'll cache it per file.

  if (file.get(FILE_HASH)) {
    return file.get(FILE_HASH);
  }

  var filename = file.opts.filename; // find module root directory

  var moduleRoot = findModuleRoot(filename);

  var filePath = moduleRoot && _path.default.relative(moduleRoot, filename).replace(separatorRegExp, '/');

  var moduleName = moduleRoot && JSON.parse(_fs.default.readFileSync(_path.default.join(moduleRoot, 'package.json'))).name;
  var code = file.code;
  var stuffToHash = [moduleName];

  if (filePath) {
    stuffToHash.push(filePath);
  } else {
    stuffToHash.push(code);
  }

  var fileHash = (0, _hash.default)(stuffToHash.join(''));
  file.set(FILE_HASH, fileHash);
  return fileHash;
};

var getNextId = function getNextId(state) {
  var id = state.file.get(COMPONENT_POSITION) || 0;
  state.file.set(COMPONENT_POSITION, id + 1);
  return id;
};

var getComponentId = function getComponentId(state) {
  // Prefix the identifier with a character because CSS classes cannot start with a number
  return `${(0, _prefixDigit.default)(getFileHash(state))}-${getNextId(state)}`;
};

var _default = function _default(t) {
  return function (path, state) {
    if (path.node.tag ? (0, detectors.isStyled)(t)(path.node.tag, state) :
    /* styled()`` */
    (0, detectors.isStyled)(t)(path.node.callee, state) && path.node.callee.property && path.node.callee.property.name !== 'withConfig' || // styled(x)({})
    (0, detectors.isStyled)(t)(path.node.callee, state) && !t.isMemberExpression(path.node.callee.callee) || // styled(x).attrs()({})
    (0, detectors.isStyled)(t)(path.node.callee, state) && t.isMemberExpression(path.node.callee.callee) && path.node.callee.callee.property && path.node.callee.callee.property.name && path.node.callee.callee.property.name !== 'withConfig') {
      var displayName = (0, options.useDisplayName)(state) && getDisplayName(t)(path, (0, options.useFileName)(state) && state);
      addConfig(t)(path, displayName && displayName.replace(/[^_a-zA-Z0-9-]/g, ''), (0, options.useSSR)(state) && getComponentId(state));
    }
  };
};

exports.default = _default;
});

unwrapExports(displayNameAndId);

var transpile = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;



function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var _default = function _default(t) {
  return function (path, state) {
    if ((0, detectors.isStyled)(t)(path.node.tag, state) || (0, detectors.isHelper)(t)(path.node.tag, state)) {
      var _path$node = path.node,
          callee = _path$node.tag,
          _path$node$quasi = _path$node.quasi,
          quasis = _path$node$quasi.quasis,
          expressions = _path$node$quasi.expressions;
      var values = t.arrayExpression(quasis.filter(function (quasi) {
        return quasi.value.cooked !== undefined;
      }).map(function (quasi) {
        return t.stringLiteral(quasi.value.cooked);
      }));
      path.replaceWith(t.callExpression(callee, [values].concat(_toConsumableArray(expressions))));
    }
  };
};

exports.default = _default;
});

unwrapExports(transpile);

var templateLiterals = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;



var _transpile = _interopRequireDefault(transpile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function _default(t) {
  return function (path, state) {
    if ((0, options.useTranspileTemplateLiterals)(state)) {
      (0, _transpile.default)(t)(path, state);
    }
  };
};

exports.default = _default;
});

unwrapExports(templateLiterals);

var assignStyledRequired = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;



var _default = function _default(t) {
  return function (path, state) {
    if (t.isCallExpression(path.node.init) && t.isIdentifier(path.node.init.callee) && path.node.init.callee.name === 'require' && path.node.init.arguments && path.node.init.arguments[0] && t.isLiteral(path.node.init.arguments[0]) && (0, detectors.isValidTopLevelImport)(path.node.init.arguments[0].value)) {
      state.styledRequired = path.node.id.name;
    }
  };
};

exports.default = _default;
});

unwrapExports(assignStyledRequired);

var transpileCssProp = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;







// Most of this code was taken from @satya164's babel-plugin-css-prop
// @see https://github.com/satya164/babel-plugin-css-prop
var TAG_NAME_REGEXP = /^[a-z][a-z\d]*(\-[a-z][a-z\d]*)?$/;

var getName = function getName(node, t) {
  if (typeof node.name === 'string') return node.name;

  if (t.isJSXMemberExpression(node)) {
    return `${getName(node.object, t)}.${node.property.name}`;
  }

  throw path.buildCodeFrameError(`Cannot infer name from node with type "${node.type}". Please submit an issue at github.com/styled-components/babel-plugin-styled-components with your code so we can take a look at your use case!`);
};

var _default = function _default(t) {
  return function (path, state) {
    if (!(0, options.useCssProp)(state)) return;
    if (path.node.name.name !== 'css') return;
    var program = state.file.path; // state.customImportName is passed through from styled-components/macro if it's used
    // since the macro also inserts the import

    var importName = state.customImportName || (0, detectors.importLocalName)('default', state);
    var bindings = program.scope.bindings; // Insert import if it doesn't exist yet

    if (!importName || !bindings[importName.name] || !bindings[importName]) {
      (0, helperModuleImports.addDefault)(path, 'styled-components', {
        nameHint: 'styled'
      });
      importName = t.identifier((0, detectors.importLocalName)('default', state, true));
    }

    if (!t.isIdentifier(importName)) importName = t.identifier(importName);
    var elem = path.parentPath;
    var name = getName(elem.node.name, t);
    var id = path.scope.generateUidIdentifier('Styled' + name.replace(/^([a-z])/, function (match, p1) {
      return p1.toUpperCase();
    }));
    var styled;
    var injector;

    if (TAG_NAME_REGEXP.test(name)) {
      styled = t.memberExpression(importName, t.identifier(name));
    } else {
      styled = t.callExpression(importName, [t.identifier(name)]);

      if (bindings[name] && !t.isImportDeclaration(bindings[name].path.parent)) {
        injector = function injector(nodeToInsert) {
          return (t.isVariableDeclaration(bindings[name].path.parent) ? bindings[name].path.parentPath : bindings[name].path).insertAfter(nodeToInsert);
        };
      }
    }

    var css;

    if (t.isStringLiteral(path.node.value)) {
      css = t.templateLiteral([t.templateElement({
        raw: path.node.value.value,
        cooked: path.node.value.value
      }, true)], []);
    } else if (t.isJSXExpressionContainer(path.node.value)) {
      if (t.isTemplateLiteral(path.node.value.expression)) {
        css = path.node.value.expression;
      } else if (t.isTaggedTemplateExpression(path.node.value.expression) && path.node.value.expression.tag.name === 'css') {
        css = path.node.value.expression.quasi;
      } else if (t.isObjectExpression(path.node.value.expression)) {
        css = path.node.value.expression;
      } else {
        css = t.templateLiteral([t.templateElement({
          raw: '',
          cooked: ''
        }, false), t.templateElement({
          raw: '',
          cooked: ''
        }, true)], [path.node.value.expression]);
      }
    }

    if (!css) return;
    elem.node.attributes = elem.node.attributes.filter(function (attr) {
      return attr !== path.node;
    });
    elem.node.name = t.jSXIdentifier(id.name);

    if (elem.parentPath.node.closingElement) {
      elem.parentPath.node.closingElement.name = t.jSXIdentifier(id.name);
    } // object syntax


    if (t.isObjectExpression(css)) {
      /**
       * for objects as CSS props, we have to recurse through the object and replace any
       * object value scope references with generated props similar to how the template
       * literal transform above creates dynamic interpolations
       */
      var p = t.identifier('p');
      var replaceObjectWithPropFunction = false;
      css.properties = css.properties.reduce(function propertiesReducer(acc, property) {
        if (t.isObjectExpression(property.value)) {
          // recurse for objects within objects (e.g. {'::before': { content: x }})
          property.value.properties = property.value.properties.reduce(propertiesReducer, []);
          acc.push(property);
        } else if ( // if a non-primitive value we have to interpolate it
        [t.isBigIntLiteral, t.isBooleanLiteral, t.isNullLiteral, t.isNumericLiteral, t.isStringLiteral].filter(Boolean) // older versions of babel might not have bigint support baked in
        .every(function (x) {
          return !x(property.value);
        })) {
          replaceObjectWithPropFunction = true;

          var _name = path.scope.generateUidIdentifier('css');

          elem.node.attributes.push(t.jSXAttribute(t.jSXIdentifier(_name.name), t.jSXExpressionContainer(property.value)));
          acc.push(t.objectProperty(property.key, t.memberExpression(p, _name)));
        } else {
          // some sort of primitive which is safe to pass through as-is
          acc.push(property);
        }

        return acc;
      }, []);

      if (replaceObjectWithPropFunction) {
        css = t.arrowFunctionExpression([p], css);
      }
    } else {
      // tagged template literal
      css.expressions = css.expressions.reduce(function (acc, ex) {
        if (Object.keys(bindings).some(function (key) {
          return bindings[key].referencePaths.find(function (p) {
            return p.node === ex;
          });
        }) || t.isFunctionExpression(ex) || t.isArrowFunctionExpression(ex)) {
          acc.push(ex);
        } else {
          var _name2 = path.scope.generateUidIdentifier('css');

          var _p = t.identifier('p');

          elem.node.attributes.push(t.jSXAttribute(t.jSXIdentifier(_name2.name), t.jSXExpressionContainer(ex)));
          acc.push(t.arrowFunctionExpression([_p], t.memberExpression(_p, _name2)));
        }

        return acc;
      }, []);
    }

    if (!injector) {
      var parent = elem;

      while (!t.isProgram(parent.parentPath)) {
        parent = parent.parentPath;
      }

      injector = function injector(nodeToInsert) {
        return parent.insertBefore(nodeToInsert);
      };
    }

    injector(t.variableDeclaration('var', [t.variableDeclarator(id, t.isObjectExpression(css) || t.isArrowFunctionExpression(css) ? t.callExpression(styled, [css]) : t.taggedTemplateExpression(styled, css))]));
  };
};

exports.default = _default;
});

unwrapExports(transpileCssProp);

var lib$1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _babelPluginSyntaxJsx = _interopRequireDefault(lib);

var _pure = _interopRequireDefault(pure);

var _minify = _interopRequireDefault(minify);

var _displayNameAndId = _interopRequireDefault(displayNameAndId);

var _templateLiterals = _interopRequireDefault(templateLiterals);

var _assignStyledRequired = _interopRequireDefault(assignStyledRequired);

var _transpileCssProp = _interopRequireDefault(transpileCssProp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(_ref) {
  var t = _ref.types;
  return {
    inherits: _babelPluginSyntaxJsx.default,
    visitor: {
      Program(path, state) {
        path.traverse({
          JSXAttribute(path, state) {
            (0, _transpileCssProp.default)(t)(path, state);
          },

          VariableDeclarator(path, state) {
            (0, _assignStyledRequired.default)(t)(path, state);
          }

        }, state);
      },

      CallExpression(path, state) {
        (0, _displayNameAndId.default)(t)(path, state);
        (0, _pure.default)(t)(path, state);
      },

      TaggedTemplateExpression(path, state) {
        (0, _minify.default)(t)(path, state);
        (0, _displayNameAndId.default)(t)(path, state);
        (0, _templateLiterals.default)(t)(path, state);
        (0, _pure.default)(t)(path, state);
      }

    }
  };
}
});

var styledComponents = unwrapExports(lib$1);

var getRNPlaygroundPlugin=function getRNPlaygroundPlugin(){return styledComponents;};var getRNPlaygroundPluginConfig=function getRNPlaygroundPluginConfig(config){return [styledComponents,config];};

exports.__moduleExports = lib$1;
exports.getRNPlaygroundPlugin = getRNPlaygroundPlugin;
exports.getRNPlaygroundPluginConfig = getRNPlaygroundPluginConfig;
