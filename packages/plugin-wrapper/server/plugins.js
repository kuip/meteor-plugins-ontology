fs = Npm.require("fs")
base = process.env.PWD
console.log('base')
console.log(base)
Future = Npm.require('fibers/future')

Plugins.app = {}

Plugins.parsePackages = function(keys) {
  var myFuture = new Future()

  fs.readFile(base+'/.meteor/packages', 'utf8', function (err, data) {
    if (err)
        myFuture.throw(error)

    var dat = parseplugins(data, keys)
     myFuture.return(dat)
  });

  return myFuture.wait()
}

Plugins.setPackages = function() {
  var data = Plugins.parsePackages()
  var dat = []
  for(d in data)
    if(data[d].indexOf('#') === -1)
      dat.push(data[d])

  //set plugin as active
  Plugins.persist.Plugins.update(
    {key: {$in: dat}},
    {$set: {isActive: true}},
    {multi: true}
  )

  //set plugin as inactive
  Plugins.persist.Plugins.update(
    {key: {$nin: dat}},
    {$set: {isActive: false}},
    {multi: true}
  )

  //delete plugin data from namespace

  var app = {}

  //if(PluginNamespace.collection.find({key: {$in: dat}}).count() !== dat.length)
  //  PluginNamespace.collection.remove({})

  for(var i = 0; i < dat.length; i++)
    if(dat[i].indexOf('#') === -1) {

      //insert new plugin details
      if(!Plugins.persist.Plugins.findOne({key: dat[i]}))
        Plugins.persist.Plugins.insert({
          key: dat[i],
          title: dat[i].charAt(0).toUpperCase() + dat[i].slice(1),
          description: '',
          isRemovable: true,
          isActive: true
        })
      
      /*
      //set app and plugin data
      let doc = PluginNamespace.collection.findOne({key: dat[i]})

      if(!doc && PluginNamespace.pluginClass[dat[i]]) {
        app[dat[i]] = {}

        var plug = new PluginNamespace.pluginClass[dat[i]]()
        

        //insert main plugin
        var id = PluginNamespace.collection.insert({
          key: plug.key
        })

        //insert collection data
        var cols = Object.keys(plug.collections)
        app[dat[i]].collection = cols

        if(cols.length > 0)
          var collId = PluginNamespace.collection.insert({
            key: 'collection',
            parentId: id
          })
        
        for(c in cols)
          PluginNamespace.collection.insert({
            key: cols[c],
            parentId: collId
          })

        //insert template data
        app[dat[i]].template = plug.templates

        if(plug.templates.length > 0)
          var tId = PluginNamespace.collection.insert({
            key: 'template',
            parentId: id
          })
        
        for(t in plug.templates)
          PluginNamespace.collection.insert({
            key: plug.templates[t],
            parentId: tId
          })

        console.log(app[dat[i]])

      }

      console.log(app)
      if(Object.keys(app).length > 0) {
        PluginNamespace.collection.upsert({key: 'app'},
          {$set: {
            key: 'app',
            value: app
          }}
        )
        Plugins.app = app
      }
      else
        Plugins.app = PluginNamespace.collection.findOne({key: 'app'})
      */
    }
}

Plugins.updatePackages = function(keys) {
  var dat = Plugins.parsePackages(keys)
  var plugins = Plugins.persist.Plugins.find({key: {$in: keys}}).map(function(p) {
    if(!p.isRemovable && dat.indexOf(p.key) === -1)
      dat.push(p.key)
  })

  dat = dat.join("\n")
  
  fs.writeFile(base+'/.meteor/packages', dat, function (err) {
    if (err) throw err;
  })
}

parseplugins = function(data, keys){
	var datap = data.split("\n")
	var lines=[]
	var temp, add = []
  if(keys)
    add = JSON.parse(JSON.stringify(keys))

	for(line in datap){
		if (datap[line].indexOf('#') > 0) {
			temp = datap[line].substring(0, datap[line].indexOf('#'));
		} else {
      if(keys && keys.length > 0 && keys.indexOf(datap[line]) !== -1)
        add.splice(add.indexOf(datap[line]), 1)
			else
        temp = datap[line]
		}
		temp = temp.trim()
		if (temp != "" && temp !== lines[lines.length-1])
      lines.push(temp)
	}

  for(i in add)
    lines.push(add[i])

  return lines
}

Meteor.methods({
  updatePackage: function(keys) {
      Plugins.updatePackages(keys)
  },
  updatePlugins: function(plugins) {
    //check(plugins, Object)
    var p

    for(var i = 0; i < plugins.length; i++) {
      delete plugins[i]._id

      p = Plugins.persist.Plugins.findOne({key: plugins[i].key})
      if(!p) {
        plugins[i].isActive = false
        plugins[i].isRemovable = true
        Plugins.persist.Plugins.insert(plugins[i])
      }
      else {
        plugins[i].isActive = p.isActive
        plugins[i].isRemovable = p.isRemovable
        Plugins.persist.Plugins.update({_id: p._id}, {$set: plugins[i]})
      }
    }
  },
  getApp: function() {
    return Plugins.app
  }
})

Meteor.startup(function() {
  if(!Plugins.persist.Plugins.findOne()) {
    var keys = Object.keys(Plugins.choices)
    for(k in keys) {
      Plugins.persist.Plugins.insert(Plugins.choices[keys[k]])
    }
  }

  Plugins.setPackages()
})

Meteor.publish('plugins', function() {
  return Plugins.persist.Plugins.find()
})