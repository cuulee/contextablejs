'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Field = undefined;

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _objectschema = require('objectschema');

var objectschema = _interopRequireWildcard(_objectschema);

var _typeable = require('typeable');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
* Document field class.
*/

class Field extends objectschema.Field {

  /*
  * Handles the field by populating the `_errors` property.
  */

  handle(error) {
    var _this = this;

    return (0, _asyncToGenerator3.default)(function* () {
      let relatives = (0, _typeable.toArray)(_this.value) || []; // validate related models
      for (let relative of relatives) {
        let isModel = relative instanceof _this.$owner.constructor;

        if (isModel) {
          yield relative.handle(error, { quiet: true }); // don't throw
        }
      }

      _this._errors = yield _this.$owner.$handler.handle( // validate this field
      error, _this.$owner.$schema.fields[_this.name].handle);

      return _this;
    })();
  }

}
exports.Field = Field;