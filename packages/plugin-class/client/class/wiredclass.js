
MPlugin.Class.WiredClass = class WiredClass extends MPlugin.Class.Default {
  constructor({key, label, language, login, sharedType}) {
    super()
    var self = this

    this._key = key
    this._domid = key + '_' + Random.id()
    this._label = new ReactiveVar(label || '')


    this._template = null
    this._blaze = null
    this._shared = {}
    this._subscribers = new Map()
    this._events = []
    this._event_model = 'default'
    this._eventcallback = {}
    this._sharedType = 'ReactiveVar'
    this._parentdomid = null
    this._fieldvalue = null

    if(sharedType)
      if(MPlugin.Class['Shared' + sharedType])
        this._sharedType = sharedType
      else
        console.log('The type of SharedData is invalid')

    this._eventcallback['default'] = function(event, templ) {
      var val = $(event.currentTarget).val()
      self._shared[event.type].update(val)
    }
    this._eventcallback['classic'] = function(event, templ) {
      self._shared[event.type].update([event, templ])
    }
  }

  get key() {
    return this._key
  }

  get label() {
    return this._label.get()
  }

  set label(label) {
    this._label.set(label)
  }

  get domid() {
    return this._domid
  }

  get subscribers() {
    return this._subscribers
  }

  get template() {
    return this._template
  }

  get events() {
    return this._events
  }

  get shared() {
    return this._shared
  }

  shared(eventtype) {
    return this._shared[eventtype]
  }

  get parentdomid() {
    return this._parentdomid
  }

  set parentdomid(id) {
    this._parentdomid = id + '_' + this.domid
    $('#' + id).append('<div id="' + this._parentdomid + '" class="WiredClassDiv ' + 'key_' + this.key + '"></div>')
  }

  get eventcallback() {
    return this._eventcallback
  }

  set eventcallback(eventcallback) {
    this._eventcallback = eventcallback
  }

  eventHandle(eventtype, callb) {
    this.eventcallback[eventtype] = callb
  }

  get fieldvalue() {
    return this._fieldvalue
  }

  set fieldvalue(field) {
    this._fieldvalue = field
  }

  get blaze() {
    return this._blaze
  }

  set blaze(blaze) {
    this._blaze = blaze
  }

  templateData() {
    return {label: this.label, domid: this.domid, key: this.key}
  }

  render(callback) {

    if(!this._blaze)
      this.setEvents()

    if(this.template && this.parentdomid) {
      this.destroy()
      this.blaze = Blaze.renderWithData(Template[this.template], this.templateData(), document.getElementById(this.parentdomid))
      if(callback)
        callback(this.blaze)
    }

    return this
  }

  destroy() {
    if(this._blaze) {
      Blaze.remove(this._blaze)
    }
    this._blaze = null
    return this
  }

  wipe() {
    this.destroy()
    $('#' + this.parentdomid).remove()
  }

  setShared(ev) {
    this._shared[ev] = new MPlugin.Class['Shared' + this._sharedType](this, ev)
    this._shared[ev].track()
  }

  setEvent(ev) {
    var self = this
    var tempEv = {}

    //check if event = eventtype || event = eventtype + dom
    //if event = eventtype check for default/classic data transmitting (value/ev+templ)

    if(ev.indexOf(' ') === -1)
      if(this._event_model === 'default')
        tempEv[ev + ' #' + this._domid] = this.eventcallback['default']
      else
        tempEv[ev + ' #' + this._domid] = this.eventcallback['classic']
    else {
      tempEv[ev] = this.eventcallback[ev] || function(event, templ) {
        self._shared[ev].update([event, templ])
      }
    }

    Template[this._template].events(tempEv)
  }

  setEvents() {
    for(ev of this.events)
      this.setEvent(ev)
  }

  track(subscriber, events, type) {

    if(!(events instanceof Array))
      events = [events]

    if(type)
      this._event_model = type

    //add subscriber and its events 
    this._subscribers.set(subscriber, events)
    
    var self = this, ev

    for(ev of events) {
      //if the event is not already tracked 
      if(this._events.indexOf(ev) === -1) {

        //add it to tracked events
        this._events.push(ev)

        //create shared data for the event
        this.setShared(ev)

        //set event; defaults to adding an event to the template
        this.setEvent(ev)

      }
      
    }

    return this
  
  }

  detach(subscribers) {
    if(!(subscribers instanceof Array))
      subscribers = [subscribers]

    for(p in subscribers) {
      this._subscribers.delete(subscribers[p])
    }
  }

  update(data, eventtype) {
    //notify subscribers
    for(i of this._subscribers) {
      i[0].act(this._key, eventtype, data)
    }
  }

  clearUI(callb) {
    for(ev in this._shared)
      this._shared[ev].clear(callb)
      
  }

  //TODO: untrack event for a subscriber

}


MPlugin.Class.WiredLabel = class WiredLabel extends  MPlugin.Class.WiredClass{
  constructor({key, label, language, login, sharedType}) {
    super({key: key, label: label, language: language, login: login, sharedType: sharedType})

    this._template = 'WiredLabel'
  }

  clearUI() {
    super( () => $('#' + this._domid).text('') )

  }
}


MPlugin.Class.WiredInput = class WiredInput extends  MPlugin.Class.WiredClass{
  constructor({key, label, type, language, login, sharedType}) {

    super({key: key, label: label, language: language, login: login, sharedType: sharedType})

    this._template = 'WiredInput'
    this._type = type || 'text'
  }

  get type() {
    return this._type
  }

  templateData() {
    var data = super.templateData()
    data.type = this.type
    return data
  }

  clearUI() {
    super( () => $('#' + this._domid).val('') )

  }
}

MPlugin.Class.WiredTextarea = class WiredTextarea extends  MPlugin.Class.WiredInput {
  constructor({key, label, language, login, sharedType}) {
    super({key: key, label: label, language: language, login: login, sharedType: sharedType})

    this._template = 'WiredTextarea'
  }
}


MPlugin.Class.WiredSelect = class WiredSelect extends  MPlugin.Class.WiredClass{
  constructor({key, label, placeholder, placeholdervalue, options, active, language, login, sharedType}) {
    super({key: key, label: label, language: language, login: login, sharedType: sharedType})

    this._template = 'WiredSelect'
    this._active = active

    this._options = new ReactiveVar(this.parseOptions(options))
    this._placeholder = '...'
    this._placeholdervalue = ''

    if(placeholder || (!placeholder && typeof placeholder === 'boolean'))
      this._placeholder = placeholder

    if(placeholdervalue)
      this._placeholdervalue = placeholdervalue
  }

  get options() {
    return this._options.get()
  }

  set options(options) {
    this._options.set(this.parseOptions(options))
  }

  setOptions(options, active) {
    this._active = active
    this.options = options
    this.render()
  }

  parseOptions(options) {
    var newopt = {}

    if(options instanceof Function)
      newopt = options()
    else if(options instanceof Array) {
      for(o of options) {
        newopt[o] = o
      }
    }
    else
      newopt = options

    return newopt
  }

  templateData() {
    var keys = []
    var options = this.options

    if(options)
        keys = Object.keys(options)

    return {
          label: this.label, 
          domid: this.domid,
          option: options,
          key: this.key,
          keys: keys,
          active: this._active,
          placeholder: this._placeholder,
          placeholdervalue: this._placeholdervalue
        }
  }

  clearUI() {
    super( () => $('#' + this._domid).val('') )

  }
}

MPlugin.Class.WiredFilter = class WiredTags extends MPlugin.Class.WiredSelect {
  constructor({key, label, language, login, sharedType, schema, field}) {

    var options = schema[field].allowedValues
    var opts = {}
    if(options) {
      for(o of options)
        opts[o] = o
    }

    super({key: key, label: label, language: language, login: login, sharedType: sharedType, options: opts})

    this._schema = schema
    this._field = field

  }
}

MPlugin.Class.WiredURL = class WiredURL extends  MPlugin.Class.WiredClass{
  constructor({key, label, language, login, sharedType}) {
    super({key: key, label: label, language: language, login: login, sharedType: sharedType})

    this._template = null
  }

  setEvent(ev) {
    var self = this

    if(FlowRouter) {
      Tracker.autorun(function() {
        FlowRouter.watchPathChange()
        var data = FlowRouter.current()

        var params = data.params
        Object.assign(params, data.queryParams)

        self._shared[ev].update(params)
      })
    }
  }

  go(url) {
    if(FlowRouter) {
      FlowRouter.go(url)
    }
  }
}


MPlugin.Class.WiredButton = class WiredButton extends MPlugin.Class.WiredClass{
  constructor({key, label, language, login, sharedType}) {
    super({key: key, label: label, language: language, login: login, sharedType: sharedType})

    this._template = 'WiredButton'
  }

  setEvent(ev) {
    var self = this
    var tempEv = {}

    tempEv[ev + ' #' + this._domid] = function(event, templ) {
      self._shared[event.type].update(event)
    }
    
    Template[this._template].events(tempEv)
  }
}


MPlugin.Class.WiredDiv = class WiredDiv extends MPlugin.Class.WiredClass{
  constructor({key, label, language, login, sharedType}) {
    super({key: key, label: label, language: language, login: login, sharedType: sharedType})

    var self = this
    this._template = 'WiredDiv'
    this._content = new ReactiveVar('')
  }

  get content() {
    return this._content.get()
  }

  set content(content) {
    this._content.set(content)
  }


  templateData() {
    return {label: this.label, domid: this.domid, key: this.key, content: this.content}
  }
}

MPlugin.Class.WiredDivEditable = class WiredDivEditable extends MPlugin.Class.WiredClass{
  constructor({key, label, language, login, sharedType}) {
    super({key: key, label: label, language: language, login: login, sharedType: sharedType})
    this._template = 'WiredDivEditable'
  }

  templateData() {
    var data = super.templateData()
    data.editable = true
    return data
  }
}


MPlugin.Class.WiredTag = class WiredTag extends MPlugin.Class.WiredSelect{
  constructor({key, label, language, login, sharedType}) {
    super({key: key, label: label, language: language, login: login, sharedType: sharedType})

    this._template = 'WiredTag'
  }
}

//this is used
MPlugin.Class.WiredTag2 = class WiredTag2 extends MPlugin.Class.WiredClass{
  constructor({key, label, language, login, sharedType, value}) {
    super({key: key, label: label, language: language, login: login, sharedType: sharedType})

    var self = this
    this._value = value
    this._template = 'WiredTag2'

    this._eventcallback = function(ev, templ) {
      self._shared[event.type].update(self.value)
    }
  }

  get value() {
    return this._value
  }

  set value(value) {
    this._value = value
  }
}

MPlugin.Class.WiredCollection = class WiredCollection extends MPlugin.Class.WiredSelect {
  constructor({key, label, placeholder, placeholdervalue, active, language, login, sharedType}) {
    

    var cols = MPlugin.getCollections()
    var names = []

    for(c of cols)
      names.push(c.name)

    super({key: key, label: label, placeholder: placeholder, placeholdervalue: placeholdervalue, options: names, active: active, language: language, login: login, sharedType: sharedType})


  }
}

MPlugin.Class.WiredField = class WiredField extends MPlugin.Class.WiredSelect {
  constructor({key, label, collection, placeholder, placeholdervalue, active, language, login, sharedType}) {

    super({key: key, label: label, placeholder: placeholder, placeholdervalue: placeholdervalue, active: active, language: language, login: login, sharedType: sharedType})

    var self = this

    self._coll = new ReactiveVar(collection)

    Tracker.autorun(function() {
      var coll = self.collection

      if(coll)
        Tracker.nonreactive(function() {
          Meteor.call('getSchema', coll, function(err, res) {
            if(res) {
              var fields = Object.keys(res)
              console.log(fields)
              self.setOptions(fields)
            }
          })
        })
    })
  }

  get collection() {
    return this._coll.get()
  }

  set collection(coll) {
    this._coll.set(coll)
  }
}

MPlugin.Class.WiredTable = class WiredTable extends MPlugin.Class.WiredClass {
  constructor({key, label, collection, query, options, language, login, sharedType, formCollection}) {
    super({key: key, label: label, language: language, login: login, sharedType: sharedType})

    var self = this
    this._template = 'WiredTable'

    
    this._collection = new ReactiveVar(collection || 'wiredtabletemp')
    this._mongo = null

    this._query = new ReactiveVar(query || {})
    this._options = new ReactiveVar(options || {})
    this._headers = new ReactiveVar([])
    this._fields = new ReactiveVar([])
    this._items = new ReactiveVar([])
    this._subhandle = null
    this._formCollection = formCollection

    Tracker.autorun(function() {
      var coll = self.collection

      if(coll) {
        self._mongo = MPlugin.getCollection(self.collection)
        if(!self._mongo)
          self._mongo = new Mongo.Collection(self.collection)
      }
    })

    Tracker.autorun(function() {
      var changed = self.collection && self.query && (self.options || !self.options)

      Tracker.nonreactive(function() {
        if(changed) {
          var options = self.options
          delete options.sort
          self._subhandle = Meteor.subscribe('general', self.collection, self.query, options)
          
          if(self._itemtrack)
            self._itemtrack.stop()

          Tracker.autorun(function() {
            var items = self._mongo.find(self.query, self.options).fetch()
            Tracker.nonreactive(function() {
              if(items)
                self.items = items
            })
          })
        }
      })
    })

    Tracker.autorun(function() {
      var ch = self.items && self.fields && self.headers

      Tracker.nonreactive(function() {
        if(ch)
          self.render()
      })
    })

    self.trackSchema()

    
  }

  get collection() {
    return this._collection.get()
  }

  set collection(collection) {
    this._collection.set(collection)
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

  get headers() {
    return this._headers.get()
  }

  set headers(headers) {
    this._headers.set(headers)
  }

  get fields() {
    return this._fields.get()
  }

  set fields(fields) {
    this._fields.set(fields)
  }

  get items() {
    return this._items.get()
  }

  set items(items) {
    this._items.set(items)
  }

  trackSchema() {
    var self = this
    Tracker.autorun(function() {
      var coll = self.collection

      if(coll)
        Tracker.nonreactive(function() {

          Meteor.call('getSchema', coll, function(err, res) {
            if(res)
              self.parseSchema(res)
          })
        })
    })
  }

  templateData() {
    var self = this

    var data = {label: this.label, domid: this.domid, key: this.key,
      header: self.headers,
      item: self.items,
      field: self.fields
    }

    return data
  }

  parseSchema(schema) {
    var self = this

    var fields = Object.keys(schema)
    self.fields = fields
    var headers = []
    for(f of fields)
      headers.push(schema[f].label)

    self.headers = headers
  }
}

