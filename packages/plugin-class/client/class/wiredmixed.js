

MPlugin.Class.WiredMixed = class WiredMixed extends MPlugin.Class.WiredClass{
  constructor({key, label, language, login, sharedType, hidden}) {
    super({key: key, label: label, language: language, login: login, sharedType: sharedType})

    this._wired = {}
    //this._wired = new ReactiveVar({})
    this._actions = {}
    this._hid = true

    if(!hidden && typeof hidden === 'boolean')
      this._hid = false

    if(this._hid)
      this.wire('hiddenInput', new MPlugin.Class.WiredInput({key: this.key, type: 'hidden'}))
    this.wire('label', new MPlugin.Class.WiredLabel({key: 'label', label: this.label}))
  }

  get hidden() {
    return $('#' + this.wired('hiddenInput').domid).val()
  }

  set hidden(value) {
    $('#' + this.wired('hiddenInput').domid).val(value).change() 
  }

  addHidden(value) {
    var hid = this.hidden

    if(hid)
      hid += ','
    hid += value

    this.hidden = hid
  }

  delHidden(value) {
    var hid = this.hidden

    if(hid) {
      hid = hid.split(',')
      hid.splice(hid.indexOf(value),1)
      hid = hid.join(',')
    }

    this.hidden = hid
  }

  track(subscriber, events) {
    if(this._hid)
      this.wired('hiddenInput').track(subscriber, events)
    return this
  }

  //has to be repeated, because we overwrite the setter
  get parentdomid() {
    return this._parentdomid
  }

  set parentdomid(id) {

    //set its own parentdomid
    //super.parentdomid = id - not working

    this._parentdomid = id + '_' + this.domid
    $('#' + id).append('<div id="' + this._parentdomid + '" class="WiredMixedDiv ' + this.key +  '"></div>')

    //set the parentdomid for each WiredClass
    for(w in this.wireds)
      this.wired(w).parentdomid = this.parentdomid
  }

  render(keys) { 
    this.renderWired(keys)
    if(this._hid) {
      this.wired('hiddenInput').render()
      $('#' + this.wired('hiddenInput').domid).css('background-color', 'whitesmoke')
    }
    this.wired('label').render()
  }

  clearUI(callb) {
    for(w in this.wireds)
      this.wired(w).clearUI()

    self.hidden = ''
  }
}


MPlugin.Class.WiredTags = class WiredTags extends MPlugin.Class.WiredMixed {
  constructor({key, label, language, login, sharedType}) {
    super({key: key, label: label, language: language, login: login, sharedType: sharedType})

    var self = this

    this._tags = new ReactiveVar([])

    Tracker.autorun(function() {
      var tags = self.tags
      var values = []
      self.destroy()

      for(t of tags) {
        values.push(t.value)

        var id = 'tag_' + t.value

        self._actions[id] = {
          click: function(value) {
            if(value) {
              self.removeTag(value)
              self.unwire('tag_' + value)
            }
          }
        }

        self.wire(id, new MPlugin.Class.WiredTag2({key: id, label: t.label, value: t.value}).track(self, 'click'))
        self.wired(id).parentdomid = self.parentdomid
        self.wired(id).render()

      }

      self.hidden = values.join(',')
    })
  }

  get tags() {
    return this._tags.get()
  }

  set tags(tags) {
    this._tags.set(tags)
  }

  addTag(tag) {
    var tags = this.tags
    tags.push(tag)
    this.tags = tags
  }

  removeTag(tag) {
    var tags = this.tags
    tags.splice(tags.indexOf(tag),1)
    this.tags = tags
  }

  destroy() {
    for(w in this.wireds)
      if(w.indexOf('tag_') !== -1)
        this.unwire(w)
  }

}

MPlugin.Class.WiredTabular = class WiredTabular extends MPlugin.Class.WiredMixed {
  constructor({key, label, collection, query, language, login, sharedType, formCollection, tableClass}) {

    super({key: key, label: label, language: language, login: login, sharedType: sharedType, hidden: false, formCollection: formCollection})

    var self = this
    self._collection = new ReactiveVar(collection)
    self._query = new ReactiveVar(query || {})
    self._count = new ReactiveVar()
    self._recordsPerPage = new ReactiveVar(10)
    self._page = 0
    self._options = new ReactiveVar({
      skip: self._page * self.recordsPerPage,
      limit: self.recordsPerPage
    })
    self._tableClass = tableClass || MPlugin.Class.WiredTableLabeled

    Tracker.autorun(function() {
      var changed = self.count && self.options

      Tracker.nonreactive(function() {
        if(changed) {
          var count = self.count
          var rpp = self.recordsPerPage
          //if(count > self.recordsPerPage) {
            var total = (self._page + 1) * rpp
            var existent

            if(total < count) {
              if(!self.wired('next')) {
                self.wire('next', new MPlugin.Class.WiredButton({
                  key: 'next',
                  label: '>'
                }).track(self, 'click'))
              }
              self.wired('next').parentdomid = self.parentdomid
              self.wired('next').render()

              existent = total
            }
            else {
              if(self.wired('next'))
                self.unwire('next')

              existent = count
            }

            if(self._page > 0) {
              if(!self.wired('prev')) {
                self.wire('prev', new MPlugin.Class.WiredButton({
                  key: 'prev',
                  label: '<'
                }).track(self, 'click'))
              }
              self.wired('prev').parentdomid = self.parentdomid
              self.wired('prev').render()
            }
            else {
              if(self.wired('prev'))
                self.unwire('prev')
            }

            //set label
            //self.wired('label').label = existent +  ' / ' + count
            self.wired('label').label = (self._page + 1) +  ' / ' + Math.ceil(count / self.recordsPerPage)
            self.wired('label').render()
          //}
        }
      })
    })

    Tracker.autorun(function() {
      var changed = self.collection && self.query

      var coll = self.collection
      var query = self.query

      Tracker.nonreactive(function() {
        if(coll && self.wired('table'))
          self.wired('table').collection = coll

        if(query) {
          if(self.wired('table'))
            self.wired('table').query = query

          if(self.collection)
            Meteor.call('count', self.collection, query, function(err, res) {

              if(res)
                self.count = res
            })
        }
      })
    })

    Tracker.autorun(function() {
      var options = self.options
      if(options && self.wired('table'))
        self.wired('table').options = options
    })

    this.action('prev', {
      click: function(ev, templ) {
        if(ev) {
          var options = self.options
          options.skip -= self.recordsPerPage
          self._page --
          self.options = options
        }
      }
    })
    this.action('next', {
      click: function(ev, templ) {
        if(ev) {
          var options = self.options
          options.skip += self.recordsPerPage
          self._page ++
          self.options = options
        }
      }
    })
    /*this.action('pprev', {
      click: function(ev, templ) {
        if(ev) {
          var options = self.options
          options.skip = 0
          self._page = 0
          self.options = options
        }
      }
    })
    this.action('nnext', {
      click: function(ev, templ) {
        if(ev) {
          var options = self.options
          var noofpg = Math.ceil(self.count / self.recordsPerPage)-1
          options.skip = self.recordsPerPage * (noofpg-1)
          self._page = noofpg-1
          self.options = options
        }
      }
    })*/
    this.action('recno', {
      change: function(val) {
        if(val) {
          val = parseInt(val, 10)

          self.recordsPerPage = val
          self._page = 0

          var options = self.options
          options.limit = val
          options.skip = 0
          self.options = options
        }
      }
    })

    this.wire('label', new MPlugin.Class.WiredLabel({key: 'label'}))
    this.wire('recno', new MPlugin.Class.WiredSelect({
      key: 'recno', 
      options: [5, 10, 15, 20, 30, 40, 50, 60, 70, 80, 90, 100, 150],
      active: self.recordsPerPage
    }).track(self, 'change'))

    this.wire('table', new self._tableClass({
      key: 'table',
      collection: self.collection,
      query: self.query,
      options: self.options
    }))

    
    
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

  get count() {
    return this._count.get()
  }

  set count(count) {
    this._count.set(count)
  }

  get recordsPerPage() {
    return this._recordsPerPage.get()
  }

  set recordsPerPage(no) {
    this._recordsPerPage.set(no)
  }

}

//auguments

augument(MPlugin.Class.WiredMixed, MPlugin.Class.WiredMixin)
