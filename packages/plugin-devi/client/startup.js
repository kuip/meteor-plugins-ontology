/*Tracker.autorun(function() {
  FlowRouter.watchPathChange()
  var route = FlowRouter.current()
  console.log(route)
  if(route && route.path) {
    if(Meteor.userId() && route.path === '/na/login')
      FlowRouter.go('/')
    //var user = Meteor.user()
    //if((!user || user.username !== 'loredana') && route.path.indexOf('prev') === -1 && route.path !== '/na/notauth' && route.path !== '/na/login')
    //  FlowRouter.go('/na/notauth')
  }
})


Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
});*/