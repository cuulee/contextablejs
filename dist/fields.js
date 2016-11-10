'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Field = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

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

var _typeable = require('typeable');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
* Document field class.
*/

var Field = exports.Field = function (_objectschema$Field) {
  (0, _inherits3.default)(Field, _objectschema$Field);

  function Field() {
    (0, _classCallCheck3.default)(this, Field);
    return (0, _possibleConstructorReturn3.default)(this, (Field.__proto__ || (0, _getPrototypeOf2.default)(Field)).apply(this, arguments));
  }

  (0, _createClass3.default)(Field, [{
    key: 'handle',


    /*
    * Handles the field by populating the `_errors` property.
    */

    value: function () {
      var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(error) {
        var relatives, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, relative, isModel;

        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                relatives = (0, _typeable.toArray)(this.value) || []; // validate related models

                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context.prev = 4;
                _iterator = (0, _getIterator3.default)(relatives);

              case 6:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context.next = 15;
                  break;
                }

                relative = _step.value;
                isModel = relative instanceof this.$owner.constructor;

                if (!isModel) {
                  _context.next = 12;
                  break;
                }

                _context.next = 12;
                return relative.handle(error, { quiet: true });

              case 12:
                _iteratorNormalCompletion = true;
                _context.next = 6;
                break;

              case 15:
                _context.next = 21;
                break;

              case 17:
                _context.prev = 17;
                _context.t0 = _context['catch'](4);
                _didIteratorError = true;
                _iteratorError = _context.t0;

              case 21:
                _context.prev = 21;
                _context.prev = 22;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 24:
                _context.prev = 24;

                if (!_didIteratorError) {
                  _context.next = 27;
                  break;
                }

                throw _iteratorError;

              case 27:
                return _context.finish(24);

              case 28:
                return _context.finish(21);

              case 29:
                _context.next = 31;
                return this.$owner.$handler.handle( // validate this field
                error, this.$owner.$schema.fields[this.name].handle);

              case 31:
                this._errors = _context.sent;
                return _context.abrupt('return', this);

              case 33:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[4, 17, 21, 29], [22,, 24, 28]]);
      }));

      function handle(_x) {
        return _ref.apply(this, arguments);
      }

      return handle;
    }()
  }]);
  return Field;
}(objectschema.Field);