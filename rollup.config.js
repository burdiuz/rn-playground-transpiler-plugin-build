import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';

const plugins = [
	resolve({
      jsnext: true,
      main: false
    }),
	babel({
		presets: [['module:metro-react-native-babel-preset', { disableImportExportTransform: true }]],
		plugins: ['@babel/plugin-external-helpers'],
		exclude: 'node_modules/**',
		runtimeHelpers: true,
		externalHelpers: true,
		babelrc: false,
	}),
	commonjs({
		include: ['node_modules/**'],
	}),
	json(),
];

export const external = [
	'zlib',
	'console',
	'constants',
	'crypto',
	'dns',
	'net',
	'domain',
	'http',
	'https',
	'os',
	'path',
	'querystring',
	'fs',
	'dgram',
	'stream',
	'timers',
	'tty',
	'vm',
	'@babel/core',
	'@babel/generator',
	'@babel/helper-annotate-as-pure',
	'@babel/helper-builder-binary-assignment-operator-visitor',
	'@babel/helper-call-delegate',
	'@babel/helper-create-class-features-plugin',
	'@babel/helper-create-regexp-features-plugin',
	'@babel/helper-define-map',
	'@babel/helper-explode-assignable-expression',
	'@babel/helper-function-name',
	'@babel/helper-get-function-arity',
	'@babel/helper-hoist-variables',
	'@babel/helper-member-expression-to-functions',
	'@babel/helper-module-imports',
	'@babel/helper-module-transforms',
	'@babel/helper-optimise-call-expression',
	'@babel/helper-plugin-utils',
	'@babel/helper-regex',
	'@babel/helper-remap-async-to-generator',
	'@babel/helper-replace-supers',
	'@babel/helper-simple-access',
	'@babel/helper-split-export-declaration',
	'@babel/helper-wrap-function',
	'@babel/helpers',
	'@babel/parser',
	'@babel/plugin-external-helpers',
	'@babel/plugin-proposal-class-properties',
	'@babel/plugin-proposal-export-default-from',
	'@babel/plugin-proposal-nullish-coalescing-operator',
	'@babel/plugin-proposal-object-rest-spread',
	'@babel/plugin-proposal-optional-catch-binding',
	'@babel/plugin-proposal-optional-chaining',
	'@babel/plugin-syntax-dynamic-import',
	'@babel/plugin-syntax-export-default-from',
	'@babel/plugin-syntax-flow',
	'@babel/plugin-transform-arrow-functions',
	'@babel/plugin-transform-block-scoping',
	'@babel/plugin-transform-classes',
	'@babel/plugin-transform-computed-properties',
	'@babel/plugin-transform-destructuring',
	'@babel/plugin-transform-exponentiation-operator',
	'@babel/plugin-transform-flow-strip-types',
	'@babel/plugin-transform-for-of',
	'@babel/plugin-transform-function-name',
	'@babel/plugin-transform-literals',
	'@babel/plugin-transform-modules-commonjs',
	'@babel/plugin-transform-object-assign',
	'@babel/plugin-transform-parameters',
	'@babel/plugin-transform-react-display-name',
	'@babel/plugin-transform-react-jsx',
	'@babel/plugin-transform-react-jsx-source',
	'@babel/plugin-transform-regenerator',
	'@babel/plugin-transform-runtime',
	'@babel/plugin-transform-shorthand-properties',
	'@babel/plugin-transform-spread',
	'@babel/plugin-transform-sticky-regex',
	'@babel/plugin-transform-template-literals',
	'@babel/plugin-transform-typescript',
	'@babel/plugin-transform-unicode-regex',
	'@babel/types',
	'babel-literal-to-ast',
	'babel-plugin-transform-es2015-modules-commonjs',
	'core-js',
	'@babel/runtime/regenerator',
	'@babel/runtime/helpers/applyDecoratedDescriptor',
	'@babel/runtime/helpers/arrayWithHoles',
	'@babel/runtime/helpers/arrayWithoutHoles',
	'@babel/runtime/helpers/assertThisInitialized',
	'@babel/runtime/helpers/AsyncGenerator',
	'@babel/runtime/helpers/asyncGeneratorDelegate',
	'@babel/runtime/helpers/asyncIterator',
	'@babel/runtime/helpers/asyncToGenerator',
	'@babel/runtime/helpers/awaitAsyncGenerator',
	'@babel/runtime/helpers/AwaitValue',
	'@babel/runtime/helpers/classCallCheck',
	'@babel/runtime/helpers/classNameTDZError',
	'@babel/runtime/helpers/classPrivateFieldDestructureSet',
	'@babel/runtime/helpers/classPrivateFieldGet',
	'@babel/runtime/helpers/classPrivateFieldLooseBase',
	'@babel/runtime/helpers/classPrivateFieldLooseKey',
	'@babel/runtime/helpers/classPrivateFieldSet',
	'@babel/runtime/helpers/classPrivateMethodGet',
	'@babel/runtime/helpers/classPrivateMethodSet',
	'@babel/runtime/helpers/classStaticPrivateFieldSpecGet',
	'@babel/runtime/helpers/classStaticPrivateFieldSpecSet',
	'@babel/runtime/helpers/classStaticPrivateMethodGet',
	'@babel/runtime/helpers/classStaticPrivateMethodSet',
	'@babel/runtime/helpers/construct',
	'@babel/runtime/helpers/createClass',
	'@babel/runtime/helpers/decorate',
	'@babel/runtime/helpers/defaults',
	'@babel/runtime/helpers/defineEnumerableProperties',
	'@babel/runtime/helpers/defineProperty',
	'@babel/runtime/helpers/extends',
	'@babel/runtime/helpers/get',
	'@babel/runtime/helpers/getPrototypeOf',
	'@babel/runtime/helpers/inherits',
	'@babel/runtime/helpers/inheritsLoose',
	'@babel/runtime/helpers/initializerDefineProperty',
	'@babel/runtime/helpers/initializerWarningHelper',
	'@babel/runtime/helpers/instanceof',
	'@babel/runtime/helpers/interopRequireDefault',
	'@babel/runtime/helpers/interopRequireWildcard',
	'@babel/runtime/helpers/isNativeFunction',
	'@babel/runtime/helpers/iterableToArray',
	'@babel/runtime/helpers/iterableToArrayLimit',
	'@babel/runtime/helpers/iterableToArrayLimitLoose',
	'@babel/runtime/helpers/jsx',
	'@babel/runtime/helpers/newArrowCheck',
	'@babel/runtime/helpers/nonIterableRest',
	'@babel/runtime/helpers/nonIterableSpread',
	'@babel/runtime/helpers/objectDestructuringEmpty',
	'@babel/runtime/helpers/objectSpread',
	'@babel/runtime/helpers/objectSpread2',
	'@babel/runtime/helpers/objectWithoutProperties',
	'@babel/runtime/helpers/objectWithoutPropertiesLoose',
	'@babel/runtime/helpers/possibleConstructorReturn',
	'@babel/runtime/helpers/readOnlyError',
	'@babel/runtime/helpers/set',
	'@babel/runtime/helpers/setPrototypeOf',
	'@babel/runtime/helpers/skipFirstGeneratorNext',
	'@babel/runtime/helpers/slicedToArray',
	'@babel/runtime/helpers/slicedToArrayLoose',
	'@babel/runtime/helpers/superPropBase',
	'@babel/runtime/helpers/taggedTemplateLiteral',
	'@babel/runtime/helpers/taggedTemplateLiteralLoose',
	'@babel/runtime/helpers/tdz',
	'@babel/runtime/helpers/temporalRef',
	'@babel/runtime/helpers/temporalUndefined',
	'@babel/runtime/helpers/toArray',
	'@babel/runtime/helpers/toConsumableArray',
	'@babel/runtime/helpers/toPrimitive',
	'@babel/runtime/helpers/toPropertyKey',
	'@babel/runtime/helpers/typeof',
	'@babel/runtime/helpers/wrapAsyncGenerator',
	'@babel/runtime/helpers/wrapNativeSuper',
	'@babel/runtime/helpers/wrapRegExp',
	'lodash',
	'lodash/add',
	'lodash/after',
	'lodash/array',
	'lodash/ary',
	'lodash/assign',
	'lodash/assignIn',
	'lodash/assignInWith',
	'lodash/assignWith',
	'lodash/at',
	'lodash/attempt',
	'lodash/before',
	'lodash/bind',
	'lodash/bindAll',
	'lodash/bindKey',
	'lodash/camelCase',
	'lodash/capitalize',
	'lodash/castArray',
	'lodash/ceil',
	'lodash/chain',
	'lodash/chunk',
	'lodash/clamp',
	'lodash/clone',
	'lodash/cloneDeep',
	'lodash/cloneDeepWith',
	'lodash/cloneWith',
	'lodash/collection',
	'lodash/commit',
	'lodash/compact',
	'lodash/concat',
	'lodash/cond',
	'lodash/conforms',
	'lodash/conformsTo',
	'lodash/constant',
	'lodash/core',
	'lodash/countBy',
	'lodash/create',
	'lodash/curry',
	'lodash/curryRight',
	'lodash/date',
	'lodash/debounce',
	'lodash/deburr',
	'lodash/defaults',
	'lodash/defaultsDeep',
	'lodash/defaultTo',
	'lodash/defer',
	'lodash/delay',
	'lodash/difference',
	'lodash/differenceBy',
	'lodash/differenceWith',
	'lodash/divide',
	'lodash/drop',
	'lodash/dropRight',
	'lodash/dropRightWhile',
	'lodash/dropWhile',
	'lodash/each',
	'lodash/eachRight',
	'lodash/endsWith',
	'lodash/entries',
	'lodash/entriesIn',
	'lodash/eq',
	'lodash/escape',
	'lodash/escapeRegExp',
	'lodash/every',
	'lodash/extend',
	'lodash/extendWith',
	'lodash/fill',
	'lodash/filter',
	'lodash/find',
	'lodash/findIndex',
	'lodash/findKey',
	'lodash/findLast',
	'lodash/findLastIndex',
	'lodash/findLastKey',
	'lodash/first',
	'lodash/flatMap',
	'lodash/flatMapDeep',
	'lodash/flatMapDepth',
	'lodash/flatten',
	'lodash/flattenDeep',
	'lodash/flattenDepth',
	'lodash/flip',
	'lodash/floor',
	'lodash/flow',
	'lodash/flowRight',
	'lodash/forEach',
	'lodash/forEachRight',
	'lodash/forIn',
	'lodash/forInRight',
	'lodash/forOwn',
	'lodash/forOwnRight',
	'lodash/fp',
	'lodash/fromPairs',
	'lodash/function',
	'lodash/functions',
	'lodash/functionsIn',
	'lodash/get',
	'lodash/groupBy',
	'lodash/gt',
	'lodash/gte',
	'lodash/has',
	'lodash/hasIn',
	'lodash/head',
	'lodash/identity',
	'lodash/includes',
	'lodash/index',
	'lodash/indexOf',
	'lodash/initial',
	'lodash/inRange',
	'lodash/intersection',
	'lodash/intersectionBy',
	'lodash/intersectionWith',
	'lodash/invert',
	'lodash/invertBy',
	'lodash/invoke',
	'lodash/invokeMap',
	'lodash/isArguments',
	'lodash/isArray',
	'lodash/isArrayBuffer',
	'lodash/isArrayLike',
	'lodash/isArrayLikeObject',
	'lodash/isBoolean',
	'lodash/isBuffer',
	'lodash/isDate',
	'lodash/isElement',
	'lodash/isEmpty',
	'lodash/isEqual',
	'lodash/isEqualWith',
	'lodash/isError',
	'lodash/isFinite',
	'lodash/isFunction',
	'lodash/isInteger',
	'lodash/isLength',
	'lodash/isMap',
	'lodash/isMatch',
	'lodash/isMatchWith',
	'lodash/isNaN',
	'lodash/isNative',
	'lodash/isNil',
	'lodash/isNull',
	'lodash/isNumber',
	'lodash/isObject',
	'lodash/isObjectLike',
	'lodash/isPlainObject',
	'lodash/isRegExp',
	'lodash/isSafeInteger',
	'lodash/isSet',
	'lodash/isString',
	'lodash/isSymbol',
	'lodash/isTypedArray',
	'lodash/isUndefined',
	'lodash/isWeakMap',
	'lodash/isWeakSet',
	'lodash/iteratee',
	'lodash/join',
	'lodash/kebabCase',
	'lodash/keyBy',
	'lodash/keys',
	'lodash/keysIn',
	'lodash/lang',
	'lodash/last',
	'lodash/lastIndexOf',
	'lodash/lodash',
	'lodash/lowerCase',
	'lodash/lowerFirst',
	'lodash/lt',
	'lodash/lte',
	'lodash/map',
	'lodash/mapKeys',
	'lodash/mapValues',
	'lodash/matches',
	'lodash/matchesProperty',
	'lodash/math',
	'lodash/max',
	'lodash/maxBy',
	'lodash/mean',
	'lodash/meanBy',
	'lodash/memoize',
	'lodash/merge',
	'lodash/mergeWith',
	'lodash/method',
	'lodash/methodOf',
	'lodash/min',
	'lodash/minBy',
	'lodash/mixin',
	'lodash/multiply',
	'lodash/negate',
	'lodash/next',
	'lodash/noop',
	'lodash/now',
	'lodash/nth',
	'lodash/nthArg',
	'lodash/number',
	'lodash/object',
	'lodash/omit',
	'lodash/omitBy',
	'lodash/once',
	'lodash/orderBy',
	'lodash/over',
	'lodash/overArgs',
	'lodash/overEvery',
	'lodash/overSome',
	'lodash/pad',
	'lodash/padEnd',
	'lodash/padStart',
	'lodash/parseInt',
	'lodash/partial',
	'lodash/partialRight',
	'lodash/partition',
	'lodash/pick',
	'lodash/pickBy',
	'lodash/plant',
	'lodash/property',
	'lodash/propertyOf',
	'lodash/pull',
	'lodash/pullAll',
	'lodash/pullAllBy',
	'lodash/pullAllWith',
	'lodash/pullAt',
	'lodash/random',
	'lodash/range',
	'lodash/rangeRight',
	'lodash/rearg',
	'lodash/reduce',
	'lodash/reduceRight',
	'lodash/reject',
	'lodash/remove',
	'lodash/repeat',
	'lodash/replace',
	'lodash/rest',
	'lodash/result',
	'lodash/reverse',
	'lodash/round',
	'lodash/sample',
	'lodash/sampleSize',
	'lodash/seq',
	'lodash/set',
	'lodash/setWith',
	'lodash/shuffle',
	'lodash/size',
	'lodash/slice',
	'lodash/snakeCase',
	'lodash/some',
	'lodash/sortBy',
	'lodash/sortedIndex',
	'lodash/sortedIndexBy',
	'lodash/sortedIndexOf',
	'lodash/sortedLastIndex',
	'lodash/sortedLastIndexBy',
	'lodash/sortedLastIndexOf',
	'lodash/sortedUniq',
	'lodash/sortedUniqBy',
	'lodash/split',
	'lodash/spread',
	'lodash/startCase',
	'lodash/startsWith',
	'lodash/string',
	'lodash/stubArray',
	'lodash/stubFalse',
	'lodash/stubObject',
	'lodash/stubString',
	'lodash/stubTrue',
	'lodash/subtract',
	'lodash/sum',
	'lodash/sumBy',
	'lodash/tail',
	'lodash/take',
	'lodash/takeRight',
	'lodash/takeRightWhile',
	'lodash/takeWhile',
	'lodash/tap',
	'lodash/template',
	'lodash/templateSettings',
	'lodash/throttle',
	'lodash/thru',
	'lodash/times',
	'lodash/toArray',
	'lodash/toFinite',
	'lodash/toInteger',
	'lodash/toIterator',
	'lodash/toJSON',
	'lodash/toLength',
	'lodash/toLower',
	'lodash/toNumber',
	'lodash/toPairs',
	'lodash/toPairsIn',
	'lodash/toPath',
	'lodash/toPlainObject',
	'lodash/toSafeInteger',
	'lodash/toString',
	'lodash/toUpper',
	'lodash/transform',
	'lodash/trim',
	'lodash/trimEnd',
	'lodash/trimStart',
	'lodash/truncate',
	'lodash/unary',
	'lodash/unescape',
	'lodash/union',
	'lodash/unionBy',
	'lodash/unionWith',
	'lodash/uniq',
	'lodash/uniqBy',
	'lodash/uniqueId',
	'lodash/uniqWith',
	'lodash/unset',
	'lodash/unzip',
	'lodash/unzipWith',
	'lodash/update',
	'lodash/updateWith',
	'lodash/upperCase',
	'lodash/upperFirst',
	'lodash/util',
	'lodash/value',
	'lodash/valueOf',
	'lodash/values',
	'lodash/valuesIn',
	'lodash/without',
	'lodash/words',
	'lodash/wrap',
	'lodash/wrapperAt',
	'lodash/wrapperChain',
	'lodash/wrapperLodash',
	'lodash/wrapperReverse',
	'lodash/wrapperValue',
	'lodash/xor',
	'lodash/xorBy',
	'lodash/xorWith',
	'lodash/zip',
	'lodash/zipObject',
	'lodash/zipObjectDeep',
	'lodash/zipWith',
];

export const getEndpointConfig = (path, exludeModules = []) => ({
	input: `source/${path}.js`,
	output: [
		{
			file: `dist/${path}.js`,
			sourcemap: false,
			exports: 'named',
			format: 'cjs',
		},
	],
	plugins: [...plugins],
	external: [...external, ...exludeModules],
});

export default [
	getEndpointConfig('@babel/plugin-proposal-decorators'),
	getEndpointConfig('babel-plugin-graphql-tag', ['graphql', 'graphql-tag']),
	getEndpointConfig('babel-plugin-styled-components', [
		'styled-components',
		'styled-components/no-tags',
		'styled-components/native',
		'styled-components/primitives',
	]),
];
