Users = class Users extends MPlugin.Class.WiredDocuments {
  constructor(collection) {
    super(collection)

    var self = this
  }
}


User = class User extends MPlugin.Class.WiredDocument {
  constructor(collection, id) {
    super(collection, id)

    var self = this

    this._roles = new ReactiveVar()

    this._dict = {
      addUserRoles: {
        class: MPlugin.Class.RoleTags,
        actions: {
          change: function(value) {
            if(value) {
              var roles = value.split(',')

              Meteor.call('setRoles', self.id, roles, function(err, res) {
                if(err)
                  console.log(err)
              })
            }
          }
        },
        track: 'change'
      }
    }

    Tracker.autorun(function() {
      var doc = self.doc
      if(doc && doc.roles)
        self.roles = doc.roles
    })

    Tracker.autorun(function() {
      var changed = self.roles && self.rendered
      
      if(changed && self.wired('addUserRoles'))
        Tracker.nonreactive(function() {
          self.wired('addUserRoles').tags = self.roles
        })
    })

  }

  get roles() {
    return this._roles.get()
  }

  set roles(roles) {
    this._roles.set(roles)
  }
}


Roles = class Roles extends MPlugin.Class.WiredDocuments {
  constructor() {
    var collection = MPlugin.Plugins['loredanacirstea:plugin-ontology'].Collection['pluginconcept']._collection
    super(collection)

    var self = this
    self.query = {ontology: RoleOntology}
    self.subscription = 'Concepts'

    Tracker.autorun(function() {
      var language = Session.get('MPluginSysLang')
      if(language)
        Tracker.nonreactive(function() {
          self.add('query', 'language', language)
        })
    })

    this._dict = {
      addRole: {
        class: MPlugin.Class.AddRole
      },
      addTranslation: {
        class: MPlugin.Class.AddRoleTranslation
      }
    }

  }
} 


Role = class Role extends MPlugin.Class.WiredDocument {
  constructor(id) {
    var collection = MPlugin.Plugins['loredanacirstea:plugin-ontology'].Collection['pluginconcept']._collection
    super(collection, id)

    var self = this
  }
}


Permissions = class Permissions extends MPlugin.Class.WiredDocuments {
  constructor() {

    var collection = MPlugin.Plugins[key].Collection['pluginpermission']._collection
    //var schema = MPlugin.Plugins[key].Collection['pluginpermission']._schema // bad format
    var schema = PermissionSchema

    super(collection, schema)

    var self = this

    this.subscription = 'Permissions'
    this.query = {}

    this._dict = {
      filter: {
        class: MPlugin.Class.PermissionSelect,
        track: 'change',
        actions: {
          change: function(value) {
            console.log(value)
            if(value)
              self.query = JSON.parse(value)
          }
        }
      },
      add: {
        class: MPlugin.Class.AddPermission,
        track: 'change',
        actions: {
          change: function(obj) {
            if(obj)
              Meteor.call('addPermission', JSON.parse(obj), function(err, res) {
                console.log(res)
              })
          }
        }
      }
    }
  }
}


Permission = class Permission extends MPlugin.Class.WiredDocument {
  constructor(id) {
    var collection = MPlugin.Plugins[key].Collection['pluginpermission']._collection
    super(collection, id)

    var self = this

    this._dict = {
      roleLabel: {
        class: MPlugin.Class.RoleLabel,
        track: false
      }
    }

    Tracker.autorun(function() {
      var changed = self.doc && self.rendered
      var doc = self.doc
      if(changed && self.wired('roleLabel') && doc.role) {
        Tracker.nonreactive(function() {
          self.wired('roleLabel').concept = doc.role
        })
      }
    })
  }
}


