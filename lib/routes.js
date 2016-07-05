FlowRouter.route('/', {
    action: function(params, queryParams) {
      BlazeLayout.render('home');
    }
});

FlowRouter.route('/plugins', {
    action: function(params, queryParams) {
      BlazeLayout.render('Plugins');
    }
});