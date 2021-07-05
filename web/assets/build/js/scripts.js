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
inisoftDemo.ui = {

  init: function() {
    this.addBodyClass();
    this.swapText();
  },

  addBodyClass: function() {
    $('.js-example-btn-1').click(function() {
      var body = $('body');
      body.toggleClass('active');      

    });
  },

  swapText: function() {
    $('.js-example-btn-2').click(function() {
      $('h1.hello').text(function(i, v) {
        return v == 'hello' ? 'goodbye' : 'hello'
      })
    });
  }

}


