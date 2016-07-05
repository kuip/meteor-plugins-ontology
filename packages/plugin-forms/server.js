Future = Npm.require('fibers/future')

Meteor.startup(function() {
  var ontology = MPlugin.Plugins['loredanacirstea:plugin-ontology'].Collection['pluginontology']._collection
  var concepts = MPlugin.Plugins['loredanacirstea:plugin-ontology'].Collection['pluginconcept']._collection
  var f = ontology.findOne({description: 'Form'})
  var id
  if(!f) {
    var obj = {
      concept: Random.id(),
      title: 'Form',
      description: 'Form',
      language: 'en',
      relation_type: '1',
      relation_name: 'structural'
    }

    id = ontology.insert(obj)

    concepts.insert({
      concept: obj.concept,
      term: obj.title,
      language: obj.language,
      ontology: obj.concept
    })
  }

  MPlugin.Plugins[key].Collection['pluginformgroup']._collection.deny({
    insert: function(userId, doc) {
      return false
    },
    update: function(userId, doc, fieldNames, modifier) {
      return false
    },
    remove: function(userId, doc) {
      return false
    }
  })

  MPlugin.Plugins[key].Collection['pluginform']._collection.deny({
    insert: function(userId, doc) {
      return false
    },
    update: function(userId, doc, fieldNames, modifier) {
      return false
    },
    remove: function(userId, doc) {
      return false
    }
  })

  MPlugin.Plugins[key].Collection['pluginsubform']._collection.deny({
    insert: function(userId, doc) {
      return false
    },
    update: function(userId, doc, fieldNames, modifier) {
      return false
    },
    remove: function(userId, doc) {
      return false
    }
  })

  MPlugin.Plugins[key].Collection['pluginformfield']._collection.deny({
    insert: function(userId, doc) {
      return false
    },
    update: function(userId, doc, fieldNames, modifier) {
      return false
    },
    remove: function(userId, doc) {
      return false
    }
  })

  //read all Form-like collections

  /*var db = MPlugin.Collection.Namespace.rawDatabase()

  db.collectionNames(function(error, results) {

    if(results) {
      var res = []

      for(n of results)
        res.push(n.name)

      defineCollections(res)
    }
  })*/


})

Meteor.publish('FormGroups', function(query, options) {
  var FormColl = MPlugin.Plugins[key].Collection['pluginformgroup']._collection

  if(!query)
    query = {}

  if(!options)
    options = {}

  return FormColl.find(query, options)
})

Meteor.publish('Forms', function(query, options) {
  var FormColl = MPlugin.Plugins[key].Collection['pluginform']._collection

  if(!query)
    query = {}

  if(!options)
    options = {}

  return FormColl.find(query, options)
})

Meteor.publish('SubForms', function(query, options) {
  var FormColl = MPlugin.Plugins[key].Collection['pluginsubform']._collection

  if(!query)
    query = {}

  if(!options)
    options = {}

  return FormColl.find(query, options)
})


Meteor.publish('Fields', function(query, options) {
  var FormColl = MPlugin.Plugins[key].Collection['pluginformfield']._collection

  if(!query)
    query = {}

  if(!options)
    options = {}

  return FormColl.find(query, options)
})


Meteor.publish('Form', function(id) {
  var FormColl = MPlugin.Plugins[key].Collection['pluginform']._collection
  return FormColl.find({_id: id})
})

Meteor.publish('SubForm', function(id) {
  var SubColl = MPlugin.Plugins[key].Collection['pluginsubform']._collection
  return SubColl.find({_id: id})
})

Meteor.publish('Field', function(id) {
  var Field = MPlugin.Plugins[key].Collection['pluginformfield']._collection
  return Field.find({_id: id})
})



Meteor.methods({
  getFormSchema: function(id) {
    var FormColl = MPlugin.Plugins[key].Collection['pluginform']._collection
    var SubColl = MPlugin.Plugins[key].Collection['pluginsubform']._collection
    var Field = MPlugin.Plugins[key].Collection['pluginformfield']._collection

    return getFormSchema(FormColl, SubColl, Field, id)
  },
  getSubFormSchema: function(id) {
    var FormColl = MPlugin.Plugins[key].Collection['pluginform']._collection
    var SubColl = MPlugin.Plugins[key].Collection['pluginsubform']._collection
    var Field = MPlugin.Plugins[key].Collection['pluginformfield']._collection

    return getSubFormSchema(SubColl, Field, id, {})
  },
  addFormGroup: function(concept) {
    var GroupColl = MPlugin.Plugins[key].Collection['pluginformgroup']._collection

    GroupColl.insert({
      concept: concept
    })
  },
  addForm: function(obj) {
    var FormColl = MPlugin.Plugins[key].Collection['pluginform']._collection

    FormColl.insert(obj)
  },
  addSubForm: function(obj) {
    var SubFormColl = MPlugin.Plugins[key].Collection['pluginsubform']._collection

    SubFormColl.insert(obj)
  },
  defineCollection: function(type, id) {
    defineCollection(type, id)
  },
  getFormlikeSchema: function(coll) {
    var id = coll.substring(coll.lastIndexOf('_')+1)

    var FormColl = MPlugin.Plugins[key].Collection['pluginform']._collection
    var SubColl = MPlugin.Plugins[key].Collection['pluginsubform']._collection
    var Field = MPlugin.Plugins[key].Collection['pluginformfield']._collection

    if(FormColl.findOne({_id: id}))
      return getFormSchema(FormColl, SubColl, Field, id)

    if(SubColl.findOne({_id: id}))
      return getSubFormSchema(SubColl, Field, id, {})
  }
})

getFormSchema = function(Forms, SubForms, Fields, doc) {
  if(typeof doc === 'string')
    doc = Forms.findOne(doc)

  var schema = {}

  var sub = SubForms.find({form: doc._id}).fetch()
  for(s of sub)
    schema = getSubFormSchema(SubForms, Fields, s, schema)

  return schema
}

getSubFormSchema = function(SubForms, Fields, doc, schema) {
  if(typeof doc === 'string')
    doc = SubForms.findOne(doc)
  var name

  var fields = Fields.find({subform: doc._id}).fetch()

  for(f of fields) {
    name = f.name
    delete f._id
    delete f.name
    delete f.subform
    schema[name] = f
  }

  return schema
}


