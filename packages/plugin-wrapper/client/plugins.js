Template.registerHelper('log', function(obj) {
  console.log(obj)
})

Template.Plugins.onCreated(function() {
  window.windowType = "MeteorPlugins"
  window.addEventListener("message", Plugins.f.apiCallback, false);
})

Template.PluginsChooser.onCreated(function() {
  this.changed = []
  this.choices = new ReactiveVar([])
  this.waiting = new ReactiveVar(null)
  var self = this

  Meteor.subscribe('plugins')

  this.autorun(function() {
    self.choices.set(Plugins.persist.Plugins.find({}, {sort: {isActive: -1, isRemovable: 1}}).fetch())
  })
})

Template.PluginsChooser.helpers({
  choices: function() {
    return Template.instance().choices.get()//Plugins.persist.Plugins.find().fetch()
  },
  status: function() {
    if(!this.isRemovable)
      return 'plugins_disabled'

    if(this.isActive)
      return 'plugins_active'
    
    return 'plugins_inactive'
  },
  waiting: function() {
    return Template.instance().waiting.get()
  },
  adminroute: function() {
    return 'plugins/' + encodeURIComponent(this.key)
  }
})

Template.PluginsChooser.events({
  'click .plugins_toggle': function(e,templ) {
    var choices = Template.instance().choices.get()
    for(c in choices)
      if(choices[c].key === this.key) {
        console.log(this.key)
        if(choices[c].isActive && choices[c].isRemovable)
          choices[c].isActive = false
        else if(!choices[c].isActive)
          choices[c].isActive = true
        if(Template.instance().changed.indexOf(this.key) === -1)
          Template.instance().changed.push(this.key)
      }
      console.log(choices)
    Template.instance().choices.set(choices)
  },
  'click .plugins_submit': function(e, templ) {
    Template.instance().waiting.set(true)
    Meteor.call('updatePackage', Template.instance().changed)
  }
})