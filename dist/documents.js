'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Document = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _objectschema = require('objectschema');

var objectschema = _interopRequireWildcard(_objectschema);

var _handleable = require('handleable');

var _fields = require('./fields');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
* Creates a Model class with context.
*/

var Document = exports.Document = function (_objectschema$Documen) {
  (0, _inherits3.default)(Document, _objectschema$Documen);

  /*
  * Class constructor.
  */

  function Document(data, schema, parent) {
    (0, _classCallCheck3.default)(this, Document);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Document.__proto__ || (0, _getPrototypeOf2.default)(Document)).call(this, data, schema, parent));

    Object.defineProperty(_this, '$handler', { // field error handler
      value: _this._createHandler()
    });
    return _this;
  }

  /*
  * Returns a new instance of validator.
  */

  (0, _createClass3.default)(Document, [{
    key: '_createHandler',
    value: function _createHandler() {
      return new _handleable.Handler((0, _extends3.default)({}, {
        handlers: this.$schema.handlers,
        firstErrorOnly: this.$schema.firstErrorOnly,
        context: this
      }));
    }

    /*
    * OVERRIDDEN: Creates a new Field instance.
    */

  }, {
    key: '_createField',
    value: function _createField(name) {
      return new _fields.Field(this, name);
    }

    /*
    * If the error is not a validation error, then it tries to create one by
    * checking document fields against handlers.
    */

  }, {
    key: 'handle',
    value: function handle(error) {
      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref$quiet = _ref.quiet,
          quiet = _ref$quiet === undefined ? true : _ref$quiet;

      var fields, path, paths, _error;

      return _regenerator2.default.async(function handle$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!(error.code === 422)) {
                _context.next = 2;
                break;
              }

              return _context.abrupt('return', this);

            case 2:
              fields = this.$schema.fields;
              _context.t0 = _regenerator2.default.keys(fields);

            case 4:
              if ((_context.t1 = _context.t0()).done) {
                _context.next = 10;
                break;
              }

              path = _context.t1.value;
              _context.next = 8;
              return _regenerator2.default.awrap(this['$' + path].handle(error));

            case 8:
              _context.next = 4;
              break;

            case 10:
              paths = this.collectErrors().map(function (e) {
                return e.path;
              });

              if (!(!quiet && paths.length > 0)) {
                _context.next = 16;
                break;
              }

              _error = this._createValidationError(paths);
              throw _error;

            case 16:
              if (!(paths.length === 0)) {
                _context.next = 18;
                break;
              }

              throw error;

            case 18:
              return _context.abrupt('return', this);

            case 19:
            case 'end':
              return _context.stop();
          }
        }
      }, null, this);
    }
  }]);
  return Document;
}(objectschema.Document);