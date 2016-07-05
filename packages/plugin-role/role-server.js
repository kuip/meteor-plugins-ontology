Meteor.publish('Users', function(query, options) {
  if(!query)
    query = {}

  if(!options)
    options = {}

  return Meteor.users.find(query, options)
})

Meteor.publish('Roles', function(query, options) {

  if(!query)
    query = {}

  if(!options)
    options = {}

  return MPlugin.Plugins['loredanacirstea:plugin-role'].Collection['pluginrole']._collection.find(query, options)
})

Meteor.publish('Role', function(id) {
  var role = MPlugin.Plugins['loredanacirstea:plugin-role'].Collection['pluginrole']._collection.findOne({_id: id})

  var ids = [id]

  if(role.parent)
    ids.push(role.parent)

  return MPlugin.Plugins['loredanacirstea:plugin-role'].Collection['pluginrole']._collection.find({_id: {$in: ids}})

})

Meteor.publish('Permissions', function(query, options) {

    if(!query)
    query = {}

  if(!options)
    options = {}
  console.log('subscribe Permissions')
  console.log(query)
  return MPlugin.Plugins['loredanacirstea:plugin-role'].Collection['pluginpermission']._collection.find(query, options)

})

Meteor.publish('Permission', function(id) {

  var items =  MPlugin.Plugins['loredanacirstea:plugin-role'].Collection['pluginpermission']._collection.find({concept: id})

  return items
})


Meteor.methods({
  'getRoles': function(lang, ids) {
    var roles

    if(ids)
      roles = MPlugin.Plugins['loredanacirstea:plugin-role'].Collection['pluginrole']._collection.find({_id: {$in: ids}})
    else
      roles = MPlugin.Plugins['loredanacirstea:plugin-role'].Collection['pluginrole']._collection.find()

    return roles.map(function(r) {
      var c = MPlugin.Plugins['loredanacirstea:plugin-ontology'].Collection['pluginconcept']._collection.findOne({concept: r.concept, language: lang})
      r.term = c.term
      return r
    })
  },
  setRoles: function(id, roles) {
    Meteor.users.update({_id: id}, {$set: {roles: roles}})
  },
  
  addPermission: function(obj) {
    console.log(obj)
    
    MPlugin.Plugins['loredanacirstea:plugin-role'].Collection['pluginpermission']._collection.insert(obj)
  }
})

Meteor.startup(function() {
  var Role = MPlugin.Plugins['loredanacirstea:plugin-role'].Collection['pluginrole']._collection
  var Perm = MPlugin.Plugins['loredanacirstea:plugin-role'].Collection['pluginpermission']._collection
  var RoleRels = MPlugin.Plugins['loredanacirstea:plugin-role'].Collection['pluginrolerels']._collection

  var id

  /*if(Role.find().count() === 0) {
    for(d in iniData) {
      id = Role.insert(iniData[d].role)

      if(id) {
        for(p in iniData[d].permission) {
          var obj = iniData[d].permission[p]
          obj.role = id
          Perm.insert(obj)
        }
      }
    }
  } */

  //Ontology.iniOntoId(Role, RoleRels, 'zS3MkdoKv54Jt2pj4')
})

Role.getPermission = function(userId, collection, operation) {
  var Perm = MPlugin.Plugins['loredanacirstea:plugin-role'].Collection['pluginpermission']._collection
  console.log('getPermission')
  console.log(userId)
  console.log(collection)
  console.log(operation)

  if(!userId)
    return []

  var roles = Meteor.users.findOne(userId).roles

  var query = {
    collection: collection, role: {$in: roles}
  }

  if(operation)
    query.operation = {$in: [operation, 'all']}

  return Perm.find(query).fetch()
}
/*
Meteor.startup(function() {
  var pp = MPlugin.Plugins
  
  var Col, colls, perms, inserts

  for(p in pp) {
    var Col = pp[p].Collection
    colls = Object.keys(Col)
    for(c of colls) {

      Col[c]._collection.before.insert(function(userId, doc) {
        var collname = this.context.rawCollection().collectionName

        var perms = Role.getPermission(userId, collname, 'insert')
        console.log(perms)

        if(perms.length === 0) {
          return false
        }

      })

    }
  }
})*/

