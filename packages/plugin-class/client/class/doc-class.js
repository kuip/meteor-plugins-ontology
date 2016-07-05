augument = MPlugin.augument = (target, ...sources) => {

  sources.forEach(source => {
    source = source.prototype

    Object.defineProperties(target.prototype, Object.getOwnPropertyNames(source).reduce((descriptors, key) => {
      if(key !== 'constructor')
        descriptors[key] = Object.getOwnPropertyDescriptor(source, key);
      return descriptors;
    }, {}));
  });

  return target;
}


MPlugin.Class.Default = class Default {
  constructor() {

  }

  add(key, field, value) {
    var rv = this[key]
    rv[field] = value
    this[key] = rv
  }

  del(key, field) {
    rv = this[key]
    delete rv[field]
    this[key] = rv
  }
}

MPlugin.Class.DocumentDefault = class DocumentDefault extends MPlugin.Class.Default {
  constructor(collection, subscription) {
    super()

    var self = this

    self._collection = collection
    self._subscription = new ReactiveVar(subscription)
    self._subscriptionHandle = null
  }

  get collection() {
    return this._collection
  }

  get subscription() {
    return this._subscription.get()
  }

  set subscription(subscription) {
    this._subscription.set(subscription)
  }

  get subscriptionHandle() {
    return this._subscriptionHandle
  }

  set subscriptionHandle(handle) {
    this._subscriptionHandle = handle
  }
}


MPlugin.Class.Document = class Document extends MPlugin.Class.DocumentDefault {
  constructor(collection, id, subscription) {

    super(collection, subscription)

    var self = this
    
    self._id = new ReactiveVar(id)
    self._doc = new ReactiveVar()
    self._name = new ReactiveVar()

    self._components = new ReactiveVar()

    //set subscription
    self.subscribe()

    //set doc details
    self.trackDoc()

    self.setChildren()

    self.setComponents()
  }

  subscribe() {
    var self = this

    Tracker.autorun(function() {
      var id = self.id

      if(id && self.subscription)
        self.subscriptionHandle = Meteor.subscribe(self.subscription, id)
    })
  }

  trackDoc() {
    var self = this
    Tracker.autorun(function() {
      var doc = self.collection.findOne(self.id)

      if(doc) {
        Tracker.nonreactive(function() {
          self.doc = doc
        })
      }
    })
  }

  setChildren() {
    this._children = new MPlugin.Class.Documents(this.collection)
    this._children.query = {parent: this.id}
  }

  setComponents() {

  }

  get id() {
    return this._id.get()
  }

  set id(id) {
    this._id.set(id)
  }

  get doc() {
    return this._doc.get()
  }

  set doc(doc) {
    this._doc.set(doc)
  }

  get children() {
    return this._children
  }

  save() {
    collection.update({_id: this.id}, {$set: this.doc})
  }
}


MPlugin.Class.Documents = class Documents extends MPlugin.Class.DocumentDefault {
  constructor(collection, schema, subscription) {
    super(collection, subscription)

    var self = this

    self._schema = schema
    
    self._query = new ReactiveVar({})
    self._options = new ReactiveVar({})

    //collection docs
    self._docs = new ReactiveVar([])

    //cache of ontology {concept: term}
    self._cacheonto = {}

    self.subscribe()
    self.trackDocs()
  }

  trackDocs() {
    var self = this

    Tracker.autorun(function() {
      var docs = self.collection.find(self.query).fetch()

      //if(docs.length > 0) {
        Tracker.nonreactive(function() {
          self.docs = docs
        })
      //}
    })
  }

  get query() {
    return this._query.get()
  }

  set query(query) {
    this._query.set(query)
  }

  get options() {
    return this._options.get()
  }

  set options(options) {
    this._options.set(options)
  }

  get docs() {
    return this._docs.get()
  }

  set docs(docs) {
    this._docs.set(docs)
  }

  get schema() {
    return this._schema
  }

  set schema(schema) {
    this._schema = schema
  }

  subscribe() {
    var self = this

    Tracker.autorun(function() {
      var changed = self.query && self.subscription

      if(changed)
        self.subscriptionHandle = Meteor.subscribe(self.subscription, self.query)
    })
  }

  find(query, options) {
    this._items = this.collection.find(query || this.query, options || this.options ).fetch()
    return this._items
  }

}

//WiredMixin extends WiredDocument(s) && WiredMixed:

MPlugin.Class.WiredMixin = class WiredMixin {
  constructor() {
  }

  get wireds() {
    return this._wired
    //return this._wired.get()
  }

  set wireds(wireds) {
    this._wired = wireds
    //this._wired.set(wireds)
  }

  wired(key) {
    return this.wireds[key]
  }

  setWired(key, value) {
    this._wired[key] = value
    /*var wireds = this.wireds
    wireds[key] = value
    this.wireds = wireds*/
  }

  wire(key, value, actions) {
    if(actions)
      this.action(key, actions)

    this.setWired(key, value)
    
  }

  unwire(key) {
    this.wired(key).wipe()
    delete this.wired[key]
  }

  get actions() {
    return this._actions
  }

  set actions(actions) {
    this._actions = actions
  }

  actioned(key, eventtype) {
    var action = this._actions[key]
    if(eventtype)
      action = action[eventtype]

    return action
  }

  action(key, value, events) {
    if(!events)
      this._actions[key] = value
    else {
      if(!(events instanceof Array))
        events = [events]

      if(!this._actions[key])
        this._actions[key] = {}

      for(ev of events)
        this._actions[key][ev] = value
    }
  }

  unaction(key) {
    delete this._actions[key]
  }

  act(key, eventtype, data) {
    //console.log('Doc action: key - ' + key + ', event: ' + eventtype + ', data: ' + data)
    if(data instanceof Array)
      this.actioned(key, eventtype)(...data)
    else
      this.actioned(key, eventtype)(data)
  }

  renderWired(keys) {
    if(!keys)
      keys = Object.keys(this.wireds)

    if(keys && !(keys instanceof Array))
      keys = [keys]

    for(key of keys)
      this.wired(key).render()

  }
}


MPlugin.Class.WiredMixinDoc = class WiredMixinDoc extends MPlugin.Class.WiredMixin {

  augumentMixed() {
    this._wired = {}
    //this._wired = new ReactiveVar({})
    this._actions = {}

    this._dict = {}

    this._rendered = new ReactiveVar()
  }

  augument() {

  }

  get dict() {
    return this._dict
  }

  get rendered() {
    return this._rendered.get()
  }

  set rendered(bool) {
    this._rendered.set(bool)
  }

  ini(key, userArgs, subscriber) {
    //set the subscriber
    subscriber = subscriber || this

    if(!userArgs)
      userArgs = {}

    var componentkey = userArgs.key || key
    //check for default args; initialize first, so they can be overwritten by user
    var args = this.dict[key].args || {}
    args.key = key

    for(a in userArgs)
      args[a] = userArgs[a]

    //augument subscriber with methods and attributes
    if(!subscriber.wireds)
      subscriber.wireds = {}

    if(!subscriber.actions)
      subscriber.actions = {}

    if(!subscriber._actions[componentkey])
      subscriber.action(componentkey, this.dict[key].actions)

    //create wired
    subscriber.wire(componentkey, new this.dict[key].class(args))

    //set tracked events
    var events
    if(typeof args.events !== 'boolean')
      events = args.events || this.dict[key].track
    

    if(events)
      subscriber.wired(componentkey).track(subscriber, events)
  }

  render(parentdomid, keys) {
    this.rendered = true

    if(keys && !(keys instanceof Array))
      keys = [keys]

    for(key in this.wireds) {
      //do not overwrite parentdomids - they have probably been rendered
      if(!this.wired(key).parentdomid)
        this.wired(key).parentdomid = parentdomid
      
      //render all if no keys provided or render only the keys provided
      if(!keys || keys.indexOf(key) !== -1)
        this.wired(key).render()
    }
  }
}


MPlugin.Class.WiredDocument = class WiredDocument extends MPlugin.Class.Document{
  constructor(collection, id, subscription) {
    super(collection, id, subscription)

    var self = this

    self.augumentMixed()
    self.augument()
  }
}


MPlugin.Class.WiredDocuments = class WiredDocuments extends MPlugin.Class.Documents{
  constructor(collection, schema, subscription) {
    super(collection, schema, subscription)

    var self = this

    self.augumentMixed()
    self.augument()
  }

}

//auguments

augument(MPlugin.Class.WiredDocument, MPlugin.Class.WiredMixin, MPlugin.Class.WiredMixinDoc)
augument(MPlugin.Class.WiredDocuments, MPlugin.Class.WiredMixin, MPlugin.Class.WiredMixinDoc)



