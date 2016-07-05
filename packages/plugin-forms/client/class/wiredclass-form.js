

MPlugin.Class.FormWired = class FormWired extends MPlugin.Class.ConceptWired {
  constructor({key, label, type, language, login, sharedType}) {

    super({key: key, label: label, language: language, ontology: FormOntology, login: login, sharedType: sharedType})
    
  }
}

MPlugin.Class.LiveSubForm = class LiveSubForm extends MPlugin.Class.FormWired {
  constructor({key, id, label, type, record, language, login, sharedType}) {
    super({key: key, id, label: label, language: language, login: login, sharedType: sharedType})

    this._id = new ReactiveVar(id)
    var self = this
    this._type = type || 'insert'
    this._doc = new ReactiveVar()
    this._dschema = new ReactiveVar()
    this._schema = null
    this._collName = 'subform_' + self.id
    this._liveblaze = null
    this._record = null

    //define collection if not already defined
    if(!PForms.coll.SubForm[self.collName]) {
      defineCollection('SubForm', self.collName)
      Meteor.call('defineCollection', 'SubForm', self.collName)
    }

    this._formCollection = PForms.coll.SubForm[self.collName]

    if(record) {
      this.record = new SubFormRecord(this.formCollection,record)

      Tracker.autorun(function() {
        var doc = self.record.doc
        console.log(doc)
        if(doc)
          Tracker.nonreactive(function() {
            self.doc = self.record.doc
          })
      })
    }


    Tracker.autorun(function() {
      var id = self.id
      if(id)
        Tracker.nonreactive(function() {
          Meteor.call('getSubFormSchema', id, function(err, res) {

            if(res) {
              self._schema = res
              var schema = new SimpleSchema(MPlugin.schemaTransform(res))
              self.formCollection.attachSchema(schema)
              self.dschema = schema
            }
          })
        })
    })

  }

  get id() {
    return this._id.get()
  }

  get collName() {
    return this._collName
  }

  get dschema() {
    return this._dschema.get()
  }

  set dschema(dschema) {
    this._dschema.set(dschema)
  }

  get doc() {
    return this._doc.get()
  }

  set doc(doc) {
    this._doc.set(doc)
  }

  get formCollection() {
    return this._formCollection
  }

  get type() {
    return this._type
  }

  set type(type) {
    this._type = type
  }

  get record() {
    return this._record
  }

  set record(record) {
    this._record = record
  }

  destroy() {
    if(this._liveblaze) {
      Blaze.remove(this._liveblaze)
    }
    this._liveblaze = null
  }

  render() {
    var self = this

    Tracker.autorun(function() {
      var changed = self.dschema && (self.doc || !self.doc)
      var schema = self.dschema
      var doc = self.doc
      
      if(changed) {
        self.destroy()
        self._liveblaze = Blaze.renderWithData(Template.SubFormLive, {collection: self.formCollection, collName: self.collName, dschema: self.dschema, schema: self._schema, type: self.type, doc: doc}, document.getElementById(self.parentdomid))
      }
    })
  }
}

MPlugin.Class.LiveForm = class LiveForm extends MPlugin.Class.FormWired {
  constructor({key, id, label, type, language, login, sharedType}) {
    super({key: key, id, label: label, language: language, login: login, sharedType: sharedType})
  }
}

MPlugin.Class.WiredTableLabeledSubForm = class WiredTableLabeledSubForm extends MPlugin.Class.WiredTableLabeled {
  constructor({key, label, collection, query, options, language, login, sharedType}) {
    super({key: key, label: label, collection: collection, query: query, options: options, language: language, login: login, sharedType: sharedType})
  }

  trackSchema() {
    var self = this
    Tracker.autorun(function() {
      var coll = self.collection
      console.log(coll)
      if(coll)
        Tracker.nonreactive(function() {

          Meteor.call('getFormlikeSchema', coll, function(err, res) {
            console.log(res)
            if(res)
              self.parseSchema(res)
          })
        })
    })
  }

  parseSchema(schema) {
    var self = this
    self._mongo.attachSchema(MPlugin.schemaTransform(schema))

    super.parseSchema(schema)

    var headers = self.headers
    headers.push('Operations')

    var fields = self.fields
    fields.push({template: 'SubFormDataOperations', data: {collection: self.collection}})

    self.fields = fields
    self.headers = headers

  }
}

MPlugin.Class.AddFormGroup = class AddFormGroup extends MPlugin.Class.FormWired {
  constructor({key, label, language, ontology, login, sharedType}) {
    super({key: key, label: label, language: language, ontology: ontology, login: login, sharedType: sharedType})

    this.concepted()
    var self = this

    this.action('addGroup', {
      click: function() {
        if(self.concept)
          self.hidden = self.concept
      }
    })

    this.wire('addGroup', new MPlugin.Class.WiredButton({key: 'addGroup', label: '+'}).track(self, 'click'))

    this.wire('addConcept', new MPlugin.Class.AddConcept({key: 'addConcept', label: 'Concept', ontology: self.ontology}))
  }
}


MPlugin.Class.AddForm = class AddForm extends MPlugin.Class.FormWired {
  constructor({key, label, language, ontology, login, sharedType}) {
    super({key: key, label: label, language: language, ontology: ontology, login: login, sharedType: sharedType})
    this.concepted()

    var self = this

    this.action('ordering', {
      change: function(value) {
        console.log(value)
        self.ordering = value
      }
    })

    this.action('addButton', {
      click: function() {
        if(self.ordering && self.concept)
          self.hidden = JSON.stringify({
            ordering: self.ordering,
            concept: self.concept
          })
      }
    })

    this.wire('ordering', new MPlugin.Class.WiredInput({key: 'ordering', label: 'Order', type: 'number'}).track(self, 'change'))
    this.wire('addButton', new MPlugin.Class.WiredButton({key: 'addButton', label: '+'}).track(self, 'click'))

  }
}

MPlugin.Class.AddSubForm = class AddSubForm extends MPlugin.Class.FormWired {
  constructor({key, label, language, ontology, login, sharedType}) {
    super({key: key, label: label, language: language, ontology: ontology, login: login, sharedType: sharedType})
    this.concepted()

    var self = this


    this.action('ordering', {
      change: function(value) {
        console.log(value)
        self.ordering = value
      }
    })

    this.action('addButton', {
      click: function() {
        if(self.ordering && self.concept)
          self.hidden = JSON.stringify({
            ordering: self.ordering,
            concept: self.concept
          })
      }
    })

    this.wire('ordering', new MPlugin.Class.WiredInput({key: 'ordering', label: 'Order', type: 'number'}).track(self, 'change'))
    this.wire('addButton', new MPlugin.Class.WiredButton({key: 'addButton', label: '+'}).track(self, 'click'))
  }
}

MPlugin.Class.AddSubFormSchema = class AddSubFormSchema extends MPlugin.Class.FormWired {
  constructor({key, label, language, ontology, login, sharedType}) {
    super({key: key, label: label, language: language, ontology: ontology, login: login, sharedType: sharedType})
    this.concepted()

    var self = this
    this.schema = new ReactiveVar()
    this._concept.set('concept')

    this.action('schemaInput', {
      change: function(value) {
        console.log(value)
        if(value) {
          //value = value.replace('\n', '')
          console.log(value)
          self.schema.set(JSON.parse(value))
        }
      }
    })

    this.wire('schemaInput', new MPlugin.Class.WiredTextarea({key: 'schemaInput', label: 'Schema'}).track(self, 'change'))

    Tracker.autorun(function() {
      var changed = self.concept && self.schema.get()

      if(changed)
        self.hidden = JSON.stringify({
          schema: self.schema.get(),
          concept: self.concept
        })

    })
  }
}


MPlugin.Class.WiredFormGroup = class WiredFormGroup extends MPlugin.Class.WiredMixed {
  constructor(key, id, sharedType) {

    super(key, label, sharedType)


  }
}

MPlugin.Class.WiredForm = class WiredForm extends MPlugin.Class.WiredMixed {
  constructor(key, id, sharedType) {

    super(key, label, sharedType)


  }

  addSubForm() {

  }

  removeSubForm() {

  }
}

MPlugin.Class.WiredSubForm = class WiredSubForm extends MPlugin.Class.WiredMixed {
  constructor(key, id, sharedType) {

    super(key, label, sharedType)


  }

  addField() {

  }

  removeField() {

  }
}

MPlugin.Class.WiredFormField = class WiredFormField extends MPlugin.Class.WiredMixed {
  constructor(key, id, sharedType) {

    super(key, label, sharedType)


  }
}



//auguments


MPlugin.augument(MPlugin.Class.AddFormGroup, MPlugin.Class.Concepted)
MPlugin.augument(MPlugin.Class.AddForm, MPlugin.Class.Concepted)
MPlugin.augument(MPlugin.Class.AddSubForm, MPlugin.Class.Concepted)
MPlugin.augument(MPlugin.Class.AddSubFormSchema, MPlugin.Class.Concepted)