Plugins = {}
Plugins.persist = {}
Plugins.persist.Plugins = new Mongo.Collection('plugins')
Plugins.schemas = {}
Plugins.choices = {
  "meteor-base": {key: "meteor-base", title: "Meteor Base", description: "Packages every Meteor app needs to have", isRemovable: false, isActive: true, repository: "https://github.com/meteor/meteor/tree/devel/packages/meteor-base"},
  "mobile-experience": {key: "mobile-experience", title: "Mobile Experience", description: "Packages for a great mobile UX", isRemovable: false, isActive: true, repository: "https://github.com/meteor/meteor/tree/devel/packages/mobile-experience"},
  "mongo": {key: "mongo", title: "Mongo DB", description: "The database Meteor supports right now", isRemovable: false, isActive: true, repository: "https://github.com/meteor/meteor/tree/devel/packages/mongo"},
  "blaze-html-templates": {key: "blaze-html-templates", title: "Blaze HTML Templates", description: "Compile .html files into Meteor Blaze views", isRemovable: false, isActive: true, repository: "https://github.com/meteor/meteor/tree/devel/packages/blaze-html-templates"},
  "session": {key: "session", title: "Session", description: "Client-side reactive dictionary for your app", isRemovable: false, isActive: true, repository: "https://github.com/meteor/meteor/tree/devel/packages/session"},
  "jquery": {key: "jquery", title: "Jquery", description: "Helpful client-side library", isRemovable: false, isActive: true, repository: "https://github.com/meteor/meteor/tree/devel/packages/jquery"},
  "tracker": {key: "tracker", title: "Tracker", description: "Meteor's client-side reactive programming library", isRemovable: false, isActive: true, repository: "https://github.com/meteor/meteor/tree/devel/packages/tracker"},
  "standard-minifiers": {key: "standard-minifiers", title: "Standard Minifiers", description: "JS/CSS minifiers run for production mode", isRemovable: false, isActive: true, repository: "https://github.com/meteor/meteor/tree/devel/packages/standard-minifiers"},
  "es5-shim": {key: "es5-shim", title: "ES5 Shim", description: "ECMAScript 5 compatibility for older browsers.", isRemovable: false, isActive: true, repository: "https://github.com/meteor/meteor/tree/devel/packages/es5-shim"},
  "ecmascript": {key: "ecmascript", title: "ES5", description: "Enable ECMAScript2015+ syntax in app code", isRemovable: false, isActive: true, repository: "https://github.com/meteor/meteor/tree/devel/packages/ecmascript"},
  "autopublish": {key: "autopublish", title: "Autopublish", description: "Publish all data to the clients (for prototyping)", isRemovable: true, isActive: true, repository: "https://github.com/meteor/meteor/tree/devel/packages/autopublish"},
  "insecure": {key: "insecure", title: "Insecure", description: "Allow all DB writes from clients (for prototyping)", isRemovable: true, isActive: true, repository: "https://github.com/meteor/meteor/tree/devel/packages/insecure"},
  "underscore": {key: "underscore", title: "Underscore", description: "", isRemovable: true, isActive: false , repository: "https://github.com/meteor/meteor/tree/devel/packages/underscore"},
  "reactive-var": {key: "reactive-var", title: "Reactive Var", description: "", isRemovable: false, isActive: false , repository: "https://github.com/meteor/meteor/tree/devel/packages/reactive-var"},
  "aldeed:collection2": {key: "aldeed:collection2", title: "Collection 2", description: "", isRemovable: true, isActive: false , repository: "https://github.com/aldeed/meteor-collection2"},
  "u2622:persistent-session": {key: "u2622:persistent-session", title: "Persistent Session", description: "", isRemovable: true, isActive: false, repository: "https://github.com/okgrow/meteor-persistent-session"}
}


Plugins.f = {}
Plugins.f.apiCallback = function(event) {
  console.log('apiCallback')
  var data = event.data
  if(data instanceof Object) {
    Meteor.call('updatePlugins', data)
    $('#tab1').prop("checked", true)
  }
}