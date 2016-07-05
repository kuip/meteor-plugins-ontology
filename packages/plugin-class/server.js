Future = Npm.require('fibers/future')

Meteor.publish('allPluginClass', function() {

  return [
    MPlugin.Collection.Namespace.find(),
    MPlugin.Collection.Shared.find()
  ]
})

Meteor.publish('general', function(collection, query, options) {

  if(!collection)
    return

  if(!query)
    query = {}

  var Coll = MPlugin.getCollection(collection)
  if(!Coll)
    Coll = new Mongo.Collection(collection)

  if(!options)
    options = {}

  return Coll.find(query, options)

})


Meteor.methods({
  getUsers: function() {
    return Meteor.users.find().fetch()
  },
  getCollections: function() {
    return MPlugin.Collection.Namespace.find({key: 'collection'}).fetch()
  },
  getServerCollections: function() {
    var db = MPlugin.Collection.Namespace.rawDatabase()

    var myFuture = new Future();

    db.collectionNames(function(error, results) {
      if(error)
        myFuture.throw(error)
      else
        myFuture.return(results)
    })

    var names = myFuture.wait()
    var res = []

    if(names)
      for(n of names)
        res.push(n.name)

    return res
  },
  getSchema: function(coll) {
    var c = MPlugin.Collection.Namespace._collection.findOne({value: coll})
    if(c) {
      var schema = MPlugin.Collection.Namespace._collection.findOne({key: 'schema', parent: c._id})

      return schema.value
    }
  },
  query: function(collectionName, query, options) {
    if(!options)
      options = {}

    return Mongo.Collection.get(collectionName).find(query, options).fetch()
  },
  count: function(collectionName, query) {
    if(!options)
      options = {}
    
    return Mongo.Collection.get(collectionName).find(query, options).count()
  },
  publicize: function(name) {
    console.log('publicize: ' + name)
    Meteor.publish(name, function(query, options) {
      if(!query)
        return []

      if(!options)
        options = {}
      console.log('publicize')
      console.log('query')
      var Collection = MPlugin.getCollection(this._name)

      if(query instanceof String)
        query = {_id: query}

      return Collection.find(query, options)
    })
  }
})