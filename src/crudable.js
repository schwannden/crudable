"use strict";

var $ = require('jquery');
(function($, undefined){

  // Crudable object
  class Crudable {
    constructor (element, options) {
      this.element = $(element);
      this._processOptions(options);
      this._attachEvent();
    }

    _processOptions(options){
      // store raw option for reference
      this._o = Object.assign({}, this._o, options);
      // processed options
      this.o = Object.assign({}, this._o);
    }

    _appendElement(element) {
      return () => {
        this._appendNewElement(element);
      }
    }

    _deleteElement(element) {
      return () => {
        if(this.o.beforeDelete !== $.noop) { this.o.beforeDelete(element); }
        if (element.siblings(`.${this.o.crudableLabel}`).size() == 0)
          this._appendNewElement(element);
        element.remove();
        if(this.o.afterDelete !== $.noop) { this.o.afterDelete(); }
      }
    }

    _appendNewElement(element) {
      let placeholder, label, valueDefault,
          newElement = element.clone(),
          $inputs = newElement.find('input');
      $inputs.each(function(){
        let $this = $(this);
        valueDefault = $this.data('crudable-default');
        if( valueDefault !== "undefined")
          $this.val(valueDefault);
      });
      if(this.o.beforeCreate !== $.noop) { this.o.beforeCreate(newElement); }
      element.after(newElement);
      if(this.o.afterCreate !== $.noop) { this.o.afterCreate(newElement); }
      newElement.crudable(this._o);
    }

    _attachEvent() {
      this.element.find(`.${this.o.createLabel}`).click(this._appendElement(this.element));
      this.element.find(`.${this.o.deleteLabel}`).click(this._deleteElement(this.element));
    }

  };

  // Registering crudable with jquery
  $.fn.crudable = function(option = {}, ...args) {
    let internal_return;
    this.each(function(){
      let $this = $(this),
          data = $this.data('crudable'),
          options = typeof option === 'object' && option;
      if (!data) {
        $this.data('crudable', new Crudable(this, Object.assign({}, defaults, option)));
      }
      if (typeof(option) === 'string' && typeof(data[option] === 'function')) {
        internal_return = data[option].apply (data, args);
        if (internal_return !== undefined)
          return false;
      }
    });
    if (internal_return !== undefined)
      return internal_return;
    else
      return this;

  };

  let defaults = $.fn.crudable.defaults = {
    createLabel: "crudable-create",
    deleteLabel: "crudable-delete",
    crudableLabel: "crudable",
    beforeCreate: $.noop,
    afterCreate: $.noop,
    beforeDelete: $.noop,
    afterDelete: $.noop,
  };
})(window.jQuery)
