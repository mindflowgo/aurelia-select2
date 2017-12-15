//import {computedFrom} from 'aurelia-framework';

export class Welcome {
  heading = 'Welcome to the Aurelia Navigation App!';
  options = [];
  selected = [];

  submit() {
    alert(`you selected: ${this.selected}`);
    return false;
  }

  activate() {
    console.log('activate');
    this.options = [
      {label: "Option 1", label_full: "<i class='glyph-icon icon-book'></i> Option 1", value: 1},
      {label: "Option 2", label_full: "<i class='glyph-icon icon-coffee'></i> Option 2", value: 2},
      {label: "Option 3", label_full: "<i class='glyph-icon icon-coffee'></i> Option 3", value: 3}
    ];

    this.selected = ["3","1"];
  }

}
