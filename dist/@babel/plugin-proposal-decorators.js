'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _defineProperty = _interopDefault(require('@babel/runtime/helpers/defineProperty'));
var helperPluginUtils = _interopDefault(require('@babel/helper-plugin-utils'));
var helperCreateClassFeaturesPlugin = _interopDefault(require('@babel/helper-create-class-features-plugin'));
var core = _interopDefault(require('@babel/core'));

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var lib = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _helperPluginUtils() {
  const data = helperPluginUtils;

  _helperPluginUtils = function () {
    return data;
  };

  return data;
}

var _default = (0, _helperPluginUtils().declare)((api, options) => {
  api.assertVersion(7);
  const {
    legacy = false
  } = options;

  if (typeof legacy !== "boolean") {
    throw new Error("'legacy' must be a boolean.");
  }

  const {
    decoratorsBeforeExport
  } = options;

  if (decoratorsBeforeExport === undefined) {
    if (!legacy) {
      throw new Error("The '@babel/plugin-syntax-decorators' plugin requires a" + " 'decoratorsBeforeExport' option, whose value must be a boolean." + " If you want to use the legacy decorators semantics, you can set" + " the 'legacy: true' option.");
    }
  } else {
    if (legacy) {
      throw new Error("'decoratorsBeforeExport' can't be used with legacy decorators.");
    }

    if (typeof decoratorsBeforeExport !== "boolean") {
      throw new Error("'decoratorsBeforeExport' must be a boolean.");
    }
  }

  return {
    name: "syntax-decorators",

    manipulateOptions(opts, parserOpts) {
      parserOpts.plugins.push(legacy ? "decorators-legacy" : ["decorators", {
        decoratorsBeforeExport
      }]);
    }

  };
});

exports.default = _default;
});

unwrapExports(lib);

var transformerLegacy = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;



const buildClassDecorator = (0, core.template)(`
  DECORATOR(CLASS_REF = INNER) || CLASS_REF;
`);
const buildClassPrototype = (0, core.template)(`
  CLASS_REF.prototype;
`);
const buildGetDescriptor = (0, core.template)(`
    Object.getOwnPropertyDescriptor(TARGET, PROPERTY);
`);
const buildGetObjectInitializer = (0, core.template)(`
    (TEMP = Object.getOwnPropertyDescriptor(TARGET, PROPERTY), (TEMP = TEMP ? TEMP.value : undefined), {
        enumerable: true,
        configurable: true,
        writable: true,
        initializer: function(){
            return TEMP;
        }
    })
`);
const WARNING_CALLS = new WeakSet();

function applyEnsureOrdering(path) {
  const decorators = (path.isClass() ? [path].concat(path.get("body.body")) : path.get("properties")).reduce((acc, prop) => acc.concat(prop.node.decorators || []), []);
  const identDecorators = decorators.filter(decorator => !core.types.isIdentifier(decorator.expression));
  if (identDecorators.length === 0) return;
  return core.types.sequenceExpression(identDecorators.map(decorator => {
    const expression = decorator.expression;
    const id = decorator.expression = path.scope.generateDeclaredUidIdentifier("dec");
    return core.types.assignmentExpression("=", id, expression);
  }).concat([path.node]));
}

function applyClassDecorators(classPath) {
  if (!hasClassDecorators(classPath.node)) return;
  const decorators = classPath.node.decorators || [];
  classPath.node.decorators = null;
  const name = classPath.scope.generateDeclaredUidIdentifier("class");
  return decorators.map(dec => dec.expression).reverse().reduce(function (acc, decorator) {
    return buildClassDecorator({
      CLASS_REF: core.types.cloneNode(name),
      DECORATOR: core.types.cloneNode(decorator),
      INNER: acc
    }).expression;
  }, classPath.node);
}

function hasClassDecorators(classNode) {
  return !!(classNode.decorators && classNode.decorators.length);
}

function applyMethodDecorators(path, state) {
  if (!hasMethodDecorators(path.node.body.body)) return;
  return applyTargetDecorators(path, state, path.node.body.body);
}

function hasMethodDecorators(body) {
  return body.some(node => node.decorators && node.decorators.length);
}

function applyObjectDecorators(path, state) {
  if (!hasMethodDecorators(path.node.properties)) return;
  return applyTargetDecorators(path, state, path.node.properties);
}

function applyTargetDecorators(path, state, decoratedProps) {
  const name = path.scope.generateDeclaredUidIdentifier(path.isClass() ? "class" : "obj");
  const exprs = decoratedProps.reduce(function (acc, node) {
    const decorators = node.decorators || [];
    node.decorators = null;
    if (decorators.length === 0) return acc;

    if (node.computed) {
      throw path.buildCodeFrameError("Computed method/property decorators are not yet supported.");
    }

    const property = core.types.isLiteral(node.key) ? node.key : core.types.stringLiteral(node.key.name);
    const target = path.isClass() && !node.static ? buildClassPrototype({
      CLASS_REF: name
    }).expression : name;

    if (core.types.isClassProperty(node, {
      static: false
    })) {
      const descriptor = path.scope.generateDeclaredUidIdentifier("descriptor");
      const initializer = node.value ? core.types.functionExpression(null, [], core.types.blockStatement([core.types.returnStatement(node.value)])) : core.types.nullLiteral();
      node.value = core.types.callExpression(state.addHelper("initializerWarningHelper"), [descriptor, core.types.thisExpression()]);
      WARNING_CALLS.add(node.value);
      acc = acc.concat([core.types.assignmentExpression("=", descriptor, core.types.callExpression(state.addHelper("applyDecoratedDescriptor"), [core.types.cloneNode(target), core.types.cloneNode(property), core.types.arrayExpression(decorators.map(dec => core.types.cloneNode(dec.expression))), core.types.objectExpression([core.types.objectProperty(core.types.identifier("configurable"), core.types.booleanLiteral(true)), core.types.objectProperty(core.types.identifier("enumerable"), core.types.booleanLiteral(true)), core.types.objectProperty(core.types.identifier("writable"), core.types.booleanLiteral(true)), core.types.objectProperty(core.types.identifier("initializer"), initializer)])]))]);
    } else {
      acc = acc.concat(core.types.callExpression(state.addHelper("applyDecoratedDescriptor"), [core.types.cloneNode(target), core.types.cloneNode(property), core.types.arrayExpression(decorators.map(dec => core.types.cloneNode(dec.expression))), core.types.isObjectProperty(node) || core.types.isClassProperty(node, {
        static: true
      }) ? buildGetObjectInitializer({
        TEMP: path.scope.generateDeclaredUidIdentifier("init"),
        TARGET: core.types.cloneNode(target),
        PROPERTY: core.types.cloneNode(property)
      }).expression : buildGetDescriptor({
        TARGET: core.types.cloneNode(target),
        PROPERTY: core.types.cloneNode(property)
      }).expression, core.types.cloneNode(target)]));
    }

    return acc;
  }, []);
  return core.types.sequenceExpression([core.types.assignmentExpression("=", core.types.cloneNode(name), path.node), core.types.sequenceExpression(exprs), core.types.cloneNode(name)]);
}

function decoratedClassToExpression({
  node,
  scope
}) {
  if (!hasClassDecorators(node) && !hasMethodDecorators(node.body.body)) {
    return;
  }

  const ref = node.id ? core.types.cloneNode(node.id) : scope.generateUidIdentifier("class");
  return core.types.variableDeclaration("let", [core.types.variableDeclarator(ref, core.types.toExpression(node))]);
}

var _default = {
  ExportDefaultDeclaration(path) {
    const decl = path.get("declaration");
    if (!decl.isClassDeclaration()) return;
    const replacement = decoratedClassToExpression(decl);

    if (replacement) {
      const [varDeclPath] = path.replaceWithMultiple([replacement, core.types.exportNamedDeclaration(null, [core.types.exportSpecifier(core.types.cloneNode(replacement.declarations[0].id), core.types.identifier("default"))])]);

      if (!decl.node.id) {
        path.scope.registerDeclaration(varDeclPath);
      }
    }
  },

  ClassDeclaration(path) {
    const replacement = decoratedClassToExpression(path);

    if (replacement) {
      path.replaceWith(replacement);
    }
  },

  ClassExpression(path, state) {
    const decoratedClass = applyEnsureOrdering(path) || applyClassDecorators(path) || applyMethodDecorators(path, state);
    if (decoratedClass) path.replaceWith(decoratedClass);
  },

  ObjectExpression(path, state) {
    const decoratedObject = applyEnsureOrdering(path) || applyObjectDecorators(path, state);
    if (decoratedObject) path.replaceWith(decoratedObject);
  },

  AssignmentExpression(path, state) {
    if (!WARNING_CALLS.has(path.node.right)) return;
    path.replaceWith(core.types.callExpression(state.addHelper("initializerDefineProperty"), [core.types.cloneNode(path.get("left.object").node), core.types.stringLiteral(path.get("left.property").node.name || path.get("left.property").node.value), core.types.cloneNode(path.get("right.arguments")[0].node), core.types.cloneNode(path.get("right.arguments")[1].node)]));
  },

  CallExpression(path, state) {
    if (path.node.arguments.length !== 3) return;
    if (!WARNING_CALLS.has(path.node.arguments[2])) return;

    if (path.node.callee.name !== state.addHelper("defineProperty").name) {
      return;
    }

    path.replaceWith(core.types.callExpression(state.addHelper("initializerDefineProperty"), [core.types.cloneNode(path.get("arguments")[0].node), core.types.cloneNode(path.get("arguments")[1].node), core.types.cloneNode(path.get("arguments.2.arguments")[0].node), core.types.cloneNode(path.get("arguments.2.arguments")[1].node)]));
  }

};
exports.default = _default;
});

unwrapExports(transformerLegacy);

var lib$1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;



var _pluginSyntaxDecorators = _interopRequireDefault(lib);



var _transformerLegacy = _interopRequireDefault(transformerLegacy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (0, helperPluginUtils.declare)((api, options) => {
  api.assertVersion(7);
  const {
    legacy = false
  } = options;

  if (typeof legacy !== "boolean") {
    throw new Error("'legacy' must be a boolean.");
  }

  const {
    decoratorsBeforeExport
  } = options;

  if (decoratorsBeforeExport === undefined) {
    if (!legacy) {
      throw new Error("The decorators plugin requires a 'decoratorsBeforeExport' option," + " whose value must be a boolean. If you want to use the legacy" + " decorators semantics, you can set the 'legacy: true' option.");
    }
  } else {
    if (legacy) {
      throw new Error("'decoratorsBeforeExport' can't be used with legacy decorators.");
    }

    if (typeof decoratorsBeforeExport !== "boolean") {
      throw new Error("'decoratorsBeforeExport' must be a boolean.");
    }
  }

  if (legacy) {
    return {
      name: "proposal-decorators",
      inherits: _pluginSyntaxDecorators.default,

      manipulateOptions({
        generatorOpts
      }) {
        generatorOpts.decoratorsBeforeExport = decoratorsBeforeExport;
      },

      visitor: _transformerLegacy.default
    };
  }

  return (0, helperCreateClassFeaturesPlugin.createClassFeaturePlugin)({
    name: "proposal-decorators",
    feature: helperCreateClassFeaturesPlugin.FEATURES.decorators,

    manipulateOptions({
      generatorOpts,
      parserOpts
    }) {
      parserOpts.plugins.push(["decorators", {
        decoratorsBeforeExport
      }]);
      generatorOpts.decoratorsBeforeExport = decoratorsBeforeExport;
    }

  });
});

exports.default = _default;
});

var decoratorsPlugin = unwrapExports(lib$1);

function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);if(enumerableOnly)symbols=symbols.filter(function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable;});keys.push.apply(keys,symbols);}return keys;}function _objectSpread(target){for(var i=1;i<arguments.length;i++){var source=arguments[i]!=null?arguments[i]:{};if(i%2){ownKeys(source,true).forEach(function(key){_defineProperty(target,key,source[key]);});}else if(Object.getOwnPropertyDescriptors){Object.defineProperties(target,Object.getOwnPropertyDescriptors(source));}else{ownKeys(source).forEach(function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key));});}}return target;}var getRNPlaygroundPlugin=function getRNPlaygroundPlugin(){return decoratorsPlugin;};var getRNPlaygroundPluginConfig=function getRNPlaygroundPluginConfig(){var config=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};return [decoratorsPlugin,_objectSpread({decoratorsBeforeExport:true},config)];};

exports.__moduleExports = lib$1;
exports.getRNPlaygroundPlugin = getRNPlaygroundPlugin;
exports.getRNPlaygroundPluginConfig = getRNPlaygroundPluginConfig;
