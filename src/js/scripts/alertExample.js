inisoftDemo.alertExample = {
  init: function() {
    this.fireAlert();
  },

  fireAlert: function() {
    $('.js-example-btn-3').click(function() {
      alert('awoooga');  
    });
  }

}