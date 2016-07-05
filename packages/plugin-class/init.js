MPlugin.getCollection = Mongo.Collection.get
MPlugin.getCollections = Mongo.Collection.getAll


MPlugin.init = function() {
  var packages = MPlugin.Collection.Namespace.find({parent: {$exists: 0}}).fetch()
  var NS = MPlugin.Collection.Namespace
  for(p in packages) {
    var plugin = MPlugin.Plugins[packages[p].key]
    if(plugin && !plugin.Collection) {

      plugin.Facade = new MPlugin.Class.PluginFacade()
      plugin.Collection = {}
      plugin.Shared = {}
      plugin.Sub = {}
      plugin.Template = {}
      //plugin.Route = {}
      var cache = plugin.cachedb = NS.findOne({parent: packages[p]._id, key: 'cache'}).value
      
      var child = cache.children

      for(var c in child) {

        if(child[c].key === 'collection') {

          plugin.Collection[child[c].value] = new MPlugin.Class.CollectionComponent(child[c])

        }
        else if(child[c].key === 'subscription') {
          var ss = child[c].children

          for(s in ss)
            plugin.Sub[ss[s].key] = new MPlugin.Class.SubscriptionComponent(ss[s])
        }
        else if(child[c].key === 'template') {
          var ss = child[c].children

          for(s in ss)
            plugin.Template[ss[s].key] = new MPlugin.Class.TemplateComponent(ss[s], packages[p].key)
        }
        else if(child[c].key === 'shared') {
          var sh = child[c].children

          for(var s in sh) {

            /*if(Meteor.isServer) {
              MPlugin.Collection.Shared.upsert(
              {
                "plugin": packages[p].key,
                "key": sh[s].value
              },
              {$set: {
                "plugin": packages[p].key,
                "output": true,
                "key": sh[s].value,
                "value": {'value': ''}
              }}, function(err, res) {

                var ss = MPlugin.Collection.Shared.findOne({
                  "plugin": packages[p].key,
                "key": sh[s].value
                })

                plugin.Shared[sh[s].value] = new MPlugin.Class.SharedDataComponent(ss)
              })
            }*/
          }
        }
        /*else if(child[c].key === 'route') {
          var rr = child[c].children
          for(r in rr)
            plugin.Route[rr[r].key] = new MPlugin.Class.WebRouteComponent(rr[r])
        }*/

      }
    }
  }

}

MPlugin.initRoutes = function() {
  var pp = MPlugin.Plugins

  for(p in pp) {
    MPlugin.Plugins[p].Route = {}

    var kk = pp[p].cache.children

    for(k in kk)
      if(kk[k].key === 'route') {

        var rr = kk[k].children
        for(r in rr)
          MPlugin.Plugins[p].Route[rr[r].key] = new MPlugin.Class.WebRouteComponent(rr[r])
      }
  }
}

MPlugin.initPackage = function(key, cache) {
   MPlugin.Plugins[key].cache = cache

  if(Meteor.isServer) {

    var p = MPlugin.Collection.Namespace.findOne({key: key})

    if(!p) {

      var id = MPlugin.Collection.Namespace.insert({
        key: key
      })

      for(var c in cache.children)
        MPlugin.initCache(MPlugin.Collection.Namespace, cache.children[c], id)

      console.log(key)
      MPlugin.Collection.Namespace.insert({
        key: 'cache',
        value: cache,
        parent: id
      })

    }

  }

}


MPlugin.initCache = function(Col, json, parentId) {

  var obj = JSON.parse(JSON.stringify(json))
  var newparentId

  delete obj.children

  if(parentId)
    obj.parent = parentId

  newparentId = Col.insert(obj)

  if(json.children)
    for(var c in json.children)
      MPlugin.initCache(Col, json.children[c], newparentId)

}

MPlugin.schemaTransform = function(schema) {
  for(v in schema) {
    schema[v].type  = MPlugin.schemaObj[schema[v].type]
    if(schema[v].ordering)
      delete schema[v].ordering
    schema[v] = MPlugin.schemaLookup(schema[v])
  }

  return schema
  
}


MPlugin.schemaLookup = function(obj) {

  if(obj && obj.MPFunction)
    obj = MPlugin.PF[obj.MPFunction]

  if(obj instanceof Object) {
    var keys = Object.keys(obj)
    for(k in keys)
      obj[keys[k]] = MPlugin.schemaLookup(obj[keys[k]])
  }

  return obj
}




