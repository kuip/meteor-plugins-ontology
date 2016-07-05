Template.UserTab.onCreated(function() {
  this.subscribe('Users')
  this.subscribe('Roles')

  this.collection = Meteor.users
  this.component = new Users(Meteor.users)
})

Template.UserTab.helpers({
  item: function() {
    return Template.instance().collection.find().fetch()
  }
})

Template.User.onCreated(function() {
  this.collection = Meteor.users
  this.roles = MPlugin.Plugins['loredanacirstea:plugin-ontology'].Collection['pluginconcept']._collection

  this.component = new User(Meteor.users, Template.currentData()._id)
  this.component.ini('addUserRoles')
})

Template.User.onRendered(function() {
  this.component.render('roles_' + this.component.id)
})

Template.RoleTab.onCreated(function() {
  this.component = new Roles()
  this.component.ini('addRole')
  this.component.ini('addTranslation')
})

Template.RoleTab.onRendered(function() {
  this.component.render('rolesWired')
})

Template.RoleTab.helpers({
  item: function() {
    var items = Template.instance().component.docs
    return items
  }
})


Template.PermissionTab.onCreated(function() {
  this.component = new Permissions()
  this.component.ini('filter')
  this.component.ini('add')
})

Template.PermissionTab.onRendered(function() {
  this.component.render('permissionWired')
})


Template.PermissionTab.helpers({
  item: function() {
    var items = Template.instance().component.docs
    return items
  }
})

Template.PermissionTable.onCreated(function() {
  this.component = new Permission(Template.currentData()._id)
  this.component.ini('roleLabel')
})
Template.PermissionTable.onRendered(function() {
  this.component.render('role_'+this.component.id)
})