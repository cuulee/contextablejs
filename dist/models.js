'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

exports.createModel = createModel;

var _typeable = require('typeable');

var _objectschema = require('objectschema');

var _handleable = require('handleable');

var _schemas = require('./schemas');

var _fields = require('./fields');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
* Creates a Model class with context.
*/

function createModel(schema) {
  var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var classMethods = schema.classMethods,
      classVirtuals = schema.classVirtuals,
      instanceMethods = schema.instanceMethods,
      instanceVirtuals = schema.instanceVirtuals;

  /*
  * Model class template.
  */

  var Model = function (_Document) {
    (0, _inherits3.default)(Model, _Document);

    /*
    * Class constructor.
    */

    function Model() {
      (0, _classCallCheck3.default)(this, Model);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var relatedSchema = args[0],
          data = args[1]; // a workaround because a Document constructor has more then 1 argument

      if (!data) {
        data = relatedSchema;
        relatedSchema = schema;
      }

      var _this = (0, _possibleConstructorReturn3.default)(this, (Model.__proto__ || Object.getPrototypeOf(Model)).call(this, relatedSchema, data));

      Object.defineProperty(_this, '$context', {
        value: context
      });
      Object.defineProperty(_this, '$handler', {
        value: _this._createHandler()
      });

      for (var name in instanceMethods) {
        var method = instanceMethods[name];

        Object.defineProperty(_this, name, {
          value: method
        });
      }

      for (var _name in instanceVirtuals) {
        var _instanceVirtuals$_na = instanceVirtuals[_name],
            get = _instanceVirtuals$_na.get,
            set = _instanceVirtuals$_na.set;


        Object.defineProperty(_this, _name, {
          get: get,
          set: set,
          enumerable: true // expose as object key
        });
      }
      return _this;
    }

    /*
    * Returns a new instance of validator.
    */

    (0, _createClass3.default)(Model, [{
      key: '_createHandler',
      value: function _createHandler() {
        return new _handleable.Handler((0, _extends3.default)({}, this.$schema.handlerOptions, { context: this }));
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
    return Model;
  }(_objectschema.Document);

  ;

  /*
  * Module static properties.
  */

  Object.defineProperty(Model, '$context', {
    value: context
  });

  for (var name in classMethods) {
    var method = classMethods[name];

    Object.defineProperty(Model, name, {
      value: method.bind(Model)
    });
  }

  for (var _name2 in classVirtuals) {
    var _classVirtuals$_name = classVirtuals[_name2],
        get = _classVirtuals$_name.get,
        set = _classVirtuals$_name.set;


    Object.defineProperty(Model, _name2, {
      get: get ? get.bind(Model) : undefined,
      set: set ? set.bind(Model) : undefined,
      enumerable: true // expose as object key
    });
  }

  /*
  * Returning Module class.
  */

  return Model;
}