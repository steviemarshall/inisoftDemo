$(document).foundation();

//Main setup for front-end JS 
var inisoftDemo = {
  init: function() {
    this.ui.init();
    this.alert.init();
  }
};

$(document).ready(function() {
  inisoftDemo.init();
});