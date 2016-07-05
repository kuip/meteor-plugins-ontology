FlowRouter.route('/devi/:id?', {
  action: function() {
    BlazeLayout.render('ApplicationLayout', {main: 'main'});
  }
});


FlowRouter.route('/devi/prev/:id', {
  action: function(params) {
  	Session.set("document", params.id);
    BlazeLayout.render('ApplicationLayout', {main: 'preview'});
  }
});

FlowRouter.route('/devi/raw/:id', {
  action: function() {
    BlazeLayout.render('ApplicationLayout', {main: 'raw'});
  }
});