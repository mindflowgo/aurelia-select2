// *****************************************************************
// Aurelia SELECT2 custom element
// Based on work by: https://gist.github.com/mujimu
//
// Contact me: codefreeze8@gmail.com
//
// Version: 1.0 - Dec, 2017
//
// Overcomes an aurelia issue with de-coupling/re-coupling causing a value-change to null briefly
// *****************************************************************

import {bindable, inject, customElement} from 'aurelia-framework';
import $ from 'jquery';
import 'select2';
import _ from 'lodash';

@customElement('select2')
@inject(Element)
export class Select2CustomMultiselect {
  @bindable name = null;    // name/id of custom select
  @bindable selected = [];  // default selected values
  @bindable options = {};   // array of options with id/name properties
  @bindable placeholder = "";
  @bindable allow_clear = false;
  @bindable style = "";
  @bindable callback = null;

  constructor(element) {
    this.element = element;
    this.selectedDecoupled = []; // decoupled variable bound to underlying SELECT
    this.SELECT = '';       // pointer to the underlying 'SELECT' element
  }

  attached() {
    this.SELECT = $(this.element).find('select');
    var sel = this.SELECT.select2({
      theme: "bootstrap",
      templateSelection: this.formatHtml, templateResult: this.formatHtml    
      });

    // on any change, propagate it to underlying select to trigger two-way bind
    sel.on('change', (event) => {
      // don't propagate endlessly
      // see: http://stackoverflow.com/a/34121891/4354884
      if (event.originalEvent) { return; }
      // dispatch to raw select within the custom element
      // bubble it up to allow change handler on custom element
      var notice = new Event('change', {bubbles: true});
      $(this.SELECT)[0].dispatchEvent(notice);
    });

    //console.log("select2 attached");
  }

  // when the selected values are externally changed, trigger update
  // we decouple the actual SELECT element from the external 'selected'
  // because at the start aurelia causes 'selected' to have a "" value,
  // which is not allowed for multi-select, so we ignore invalid and force a null-array
  selectedChanged( newV, oldV ){
    //console.log( "select2 -> oldV("+oldV+") newV("+newV+") "+(typeof newV) );
    if( typeof newV =='object' )
      this.selectedDecoupled = newV;
    else
      this.selectedDecoupled = [];

    $(this.SELECT).val(this.selectedDecoupled ).trigger('change');
  }

  // to allow pass-thru of HTML which comes as glyph icons.
  formatHtml ( item ) {
    if (item.text.indexOf('<')>-1){
      // must pass back as jquery object to by-pass string-sanitizer
      var $state = $('<span>'+item.text+'</span>');
      return $state;
    };
    return item.text;
  };

  detached() {
    this.SELECT.select2('destroy');
    //console.log("select2 detached");
  }
}
