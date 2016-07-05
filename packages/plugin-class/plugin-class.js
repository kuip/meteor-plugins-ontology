MPlugin = {}
MPlugin.Class = {}
MPlugin.Plugins = {}
MPlugin.PF = {}
MPlugin.sys = {}


MPlugin.Collection = {}
MPlugin.Collection.Namespace = new Mongo.Collection('pluginnamespace')
MPlugin.Collection.Shared = new Mongo.Collection('shareddata')

if(Meteor.isClient) {
  MPlugin.Subscription = Meteor.subscribe('allPluginClass')

  Meteor.startup(function() {
    Tracker.autorun(function() {
      MPlugin.sys.lang = Session.get('MPluginSysLang')
    })
  })
}

if(Meteor.isServer) {
  FastRender.onAllRoutes(function(path) {
    this.subscribe('allPluginClass');
  })
}

MPlugin.Schema = {}
MPlugin.Schema.Shared = new SimpleSchema(SharedDataSchema)
MPlugin.Collection.Shared.attachSchema(MPlugin.Schema.Shared)


MPlugin.schemaObj = {
  'string': String,
  'number': Number,
  'boolean': Boolean,
  'object': Object,
  'data': Date,
  'regex': RegExp,
  '[string]': [String],
  '[number]': [Number],
  '[boolean]': [Boolean],
  '[object]': [Object],
  '[data]': [Date]
}



MPlugin.Class.PluginSelect = class PluginSelect {
  constructor(Col) {

    this._collection = Col
  }
  
}


MPlugin.Class.PluginItem = class PluginItem extends MPlugin.Class.PluginSelect {
  constructor(Col, id) {
    super(Col)

    if(id)
      if(typeof id === 'string') {
        this._id = id
        this._doc = Col.findOne(id)
      }
      else {
        this._doc = id
        this._id = this._doc._id
      }
  }


  set id(id) {
    this._id = id
    this._doc = Col.findOne(id)
  }
  
}

MPlugin.Class.PublishItem = class PublishItem extends MPlugin.Class.PluginSelect {
  constructor(Col, id) {
    super(Col)

    this._id = id
    this._item = Col.find({_id: id})
  }

  get item() {
    return this._item
  }
}

MPlugin.Class.SharedItem = class SharedItem extends MPlugin.Class.PluginItem {

}


MPlugin.Class.PublishItems = class PublishItems extends MPlugin.Class.PluginSelect {
  constructor(Col, query, options) {
    super(Col)

    this._query = query || {}
    this._options = options || {}

    this._items = Col.find(query)
  }

  get items() {
    return this._item
  }
}

MPlugin.Class.PluginItems = class PluginItems extends MPlugin.Class.PluginSelect {
  constructor(Col, query, options) {
    super(Col)

    this._query = query
    this._options = options || {}

    this._items = []

    if(this._query)
      this._items = Col.find(this._query, this._options).map(function(i) {
        return new MPlugin.Class.PluginItem(this._collection, i)
      })
  }

  set query(q) {
    this._query = q
  }

  set options(o) {
    this._options = o
  }
  
}

MPlugin.Class.PluginTree = class PluginTree extends MPlugin.Class.PluginItem {
  constructor(Col, id) {
    super(Col, id)

    this._children = new MPlugin.Class.PluginItems(Col, {parent: id})
  }
}


MPlugin.Class.PluginForest = class PluginForest extends MPlugin.Class.PluginItems {
  constructor(Col, query, options) {
    super(Col, query, options)

    for(i in this._items)
      this._items[i] = new MPlugin.Class.PluginTree(Col, {parent: this._items[i]._id})
  }
}


MPlugin.Class.PluginComponent = class PluginComponent {
  constructor() {
  }
  
}

MPlugin.Class.TemplateComponent = class TemplateComponent extends MPlugin.Class.PluginComponent {
  constructor(obj, pluginkey) {
    super()
    this._key = obj.key
    this._cols = {}
    this._subs = {}


    for(c in obj.value.collection)
      this._cols[obj.value.collection[c]] = MPlugin.Plugins[pluginkey].Collection[obj.value.collection[c]]

    for(c in obj.value.subscription)
      this._subs[obj.value.subscription[c].key] = MPlugin.Plugins[pluginkey].Sub[obj.value.subscription[c].key]
  }

  subscribe(template, query, options) {
    for(s in this._subs)
      this._subs[s].subscribe(template, query, options)
  }

  setup() {
    this._shared = new MPlugin.Class.SharedDataComponent(9)
  }

  collection(key) {
    return this._cols[key]
  }
  
}


MPlugin.Class.CollectionComponent = class CollectionComponent extends MPlugin.Class.PluginComponent {
  constructor(cachecol) {
    super()

    this._collection = new Mongo.Collection(cachecol.value)

    var kids = cachecol.children

    for(k in kids) {

      if(kids[k].key === 'schema')
        var schema = kids[k].value
      else if(kids[k].key === 'PluginItem')
        this[kids[k].value] = new MPlugin.Class.PluginItem(this._collection)
      else if(kids[k].key === 'PluginItems')
        this[kids[k].value] = new MPlugin.Class.PluginItems(this._collection)
      else if(kids[k].key === 'label')
        this._label = kids[k].value

    }


    if(schema) {
      schema = MPlugin.schemaTransform(schema)

      this._schema = new SimpleSchema(schema)

      this._collection.attachSchema(this._schema)
    }
  }

  labeled(query, extra) {
    var items = this._collection.find().fetch()
    var labeled = []
    for(i in items) {
      var label = ''
      for(l in this._label) {
        label += items[i][this._label[l]] + (extra || '-')
      }
      labeled.push({value: items[i]._id, label: label})
    }
      
    return labeled
  }
  
}


MPlugin.Class.WebRouteComponent = class WebRouteComponent extends MPlugin.Class.PluginComponent {
  constructor(obj) {
    super()

    var subs = obj.value.subscriptions, sub
    this._params = null
    var self = this

    if(FlowRouter) {
      FlowRouter.route(obj.key, {
        action: function(params, queryParams) {

          self._params = params
          var keys = Object.keys(queryParams), temp

          for(k in keys) {
            self._params[keys[k]] = queryParams[keys[k]]
            temp = parseInt(self._params[keys[k]], 10)
            if(temp)
              self._params[keys[k]] = temp
          }

          BlazeLayout.render(obj.value.template);
        }
      });

    }
  }
  
}


MPlugin.Class.APIRouteComponent = class APIRouteComponent extends MPlugin.Class.PluginComponent {
  constructor() {
    super()
  }
  
}

MPlugin.Class.SubscriptionComponent = class SubscriptionComponent extends MPlugin.Class.PluginComponent {
  constructor(obj) {
    super()

    this._key = obj.key
    this._params = obj.value
  }

  subscribe(template, query, options) {
    template.subscribe(query, options)
  }
  
}

MPlugin.Class.SharedDataComponent = class SharedDataComponent extends MPlugin.Class.PluginComponent {
  constructor(id, active_choice) {
    super()

    this._item = new MPlugin.Class.SharedItem(MPlugin.Collection.Shared, id)
  }
}

MPlugin.Class.PluginFactory = class PluginFactory {
  constructor() {
  }


}


//this contains all exported information pertinent to each Plugin
MPlugin.Class.PluginFacade = class PluginFacade {
  constructor() {
    
    this._key = null
    this._namespace = null
    this._components = {}
  }

}









MPlugin.PF.TimeAuto = function() {
  return new Date()
}
