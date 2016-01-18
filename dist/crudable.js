"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var $ = require('jquery');
(function ($, undefined) {

  // Crudable object

  var Crudable = function () {
    function Crudable(element, options) {
      _classCallCheck(this, Crudable);

      this.element = $(element);
      this._processOptions(options);
      this._attachEvent();
    }

    _createClass(Crudable, [{
      key: '_processOptions',
      value: function _processOptions(options) {
        // store raw option for reference
        this._o = Object.assign({}, this._o, options);
        // processed options
        this.o = Object.assign({}, this._o);
      }
    }, {
      key: '_appendElement',
      value: function _appendElement(element) {
        var _this = this;

        return function () {
          _this._appendNewElement(element);
        };
      }
    }, {
      key: '_deleteElement',
      value: function _deleteElement(element) {
        var _this2 = this;

        return function () {
          if (_this2.o.beforeDelete !== $.noop) {
            _this2.o.beforeDelete(element);
          }
          if (element.siblings('.' + _this2.o.crudableLabel).size() == 0) _this2._appendNewElement(element);
          element.remove();
          if (_this2.o.afterDelete !== $.noop) {
            _this2.o.afterDelete();
          }
        };
      }
    }, {
      key: '_appendNewElement',
      value: function _appendNewElement(element) {
        var placeholder = void 0,
            label = void 0,
            valueDefault = void 0,
            newElement = element.clone(),
            $inputs = newElement.find('input');
        $inputs.each(function () {
          var $this = $(this);
          valueDefault = $this.data('crudable-default');
          if (valueDefault !== "undefined") $this.val(valueDefault);
        });
        if (this.o.beforeCreate !== $.noop) {
          this.o.beforeCreate(newElement);
        }
        element.after(newElement);
        if (this.o.afterCreate !== $.noop) {
          this.o.afterCreate(newElement);
        }
        newElement.crudable(this._o);
      }
    }, {
      key: '_attachEvent',
      value: function _attachEvent() {
        this.element.find('.' + this.o.createLabel).click(this._appendElement(this.element));
        this.element.find('.' + this.o.deleteLabel).click(this._deleteElement(this.element));
      }
    }]);

    return Crudable;
  }();

  ;

  // Registering crudable with jquery
  $.fn.crudable = function () {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var option = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var internal_return = void 0;
    this.each(function () {
      var $this = $(this),
          data = $this.data('crudable'),
          options = (typeof option === 'undefined' ? 'undefined' : _typeof(option)) === 'object' && option;
      if (!data) {
        $this.data('crudable', new Crudable(this, Object.assign({}, defaults, option)));
      }
      if (typeof option === 'string' && _typeof(data[option] === 'function')) {
        internal_return = data[option].apply(data, args);
        if (internal_return !== undefined) return false;
      }
    });
    if (internal_return !== undefined) return internal_return;else return this;
  };

  var defaults = $.fn.crudable.defaults = {
    createLabel: "crudable-create",
    deleteLabel: "crudable-delete",
    crudableLabel: "crudable",
    beforeCreate: $.noop,
    afterCreate: $.noop,
    beforeDelete: $.noop,
    afterDelete: $.noop
  };
})(window.jQuery);
