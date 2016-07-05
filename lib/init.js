/*Meteor.startup(function() {

  if(Meteor.isServer)
    MPlugin.init()

  if(Meteor.isClient)
    Tracker.autorun(function() {
      if(MPlugin.Subscription.ready()) {
        console.log('namspace subs ready')
        MPlugin.init()
      }
    })
    

})*/



if(Meteor.isServer)
  MPlugin.init()

Meteor.startup(function() {
  if(Meteor.isClient)
        MPlugin.init()
})

MPlugin.initRoutes()