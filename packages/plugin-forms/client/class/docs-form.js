Meteor.subscribe('Ontologies', {description: 'Form'})

FormGroups = class FormGroups extends MPlugin.Class.WiredDocuments {
  constructor() {
    var collection = MPlugin.Plugins[key].Collection['pluginformgroup']._collection
    var schema = MPlugin.Plugins[key].Collection['pluginformgroup']._schema
    super(collection, schema)

    var self = this
    self.subscription = 'FormGroups'
    //self.query = {}

    this._dict = {
      add: {
        class: MPlugin.Class.AddFormGroup,
        track: 'change',
        actions: {
          change: function(value) {

            if(value)
              Meteor.call('addFormGroup', value, function(err, res) {
                if(err)
                  console.log(err)
              })
          }
        }
      },
      table: {
        class: MPlugin.Class.WiredTabular,
        args: {
          collection: 'pluginformgroup',
          query: {}
        }
      }
    }
  }
}

FormGroup = class FormGroup extends MPlugin.Class.WiredDocument {
  constructor(id) {
    var collection = MPlugin.Plugins[key].Collection['pluginformgroup']._collection
    super(collection, id)

    var self = this

    this._dict = {
      addForm: {
        class: MPlugin.Class.AddForm,
        track: 'change',
        actions: {
          change: function(obj) {
            console.log(obj)
            if(obj) {
              obj = JSON.parse(obj)
              obj.formGroup = self.id
              console.log(obj)
              Meteor.call('addForm', obj, function(err, res) {
                if(err)
                  console.log(err)
              })
            }
          }
        }
      }
    }
  }
}

Forms = class Forms extends MPlugin.Class.WiredDocuments {
  constructor() {
    var collection = MPlugin.Plugins[key].Collection['pluginform']._collection
    var schema = MPlugin.Plugins[key].Collection['pluginform']._schema
    super(collection, schema)
    var self = this

    self.subscription = 'Forms'
    //self.query = {}

    this._dict = {
      table: {
        class: MPlugin.Class.WiredTabular,
        args: {
          collection: 'pluginform',
          query: {}
        }
      }
    }
  }
}

PForm = class PForm extends MPlugin.Class.WiredDocument {
  constructor(id) {
    var collection = MPlugin.Plugins[key].Collection['pluginform']._collection
    var subscription = Meteor.subscribe('Form', id)
    super(collection, id)

    var self = this

    this.items = new SubForm()

    this._dict = {
      addSubForm: {
        class: MPlugin.Class.AddSubForm,
        track: 'change',
        actions: {
          change: function(obj) {
            console.log(obj)
            if(obj) {
              obj = JSON.parse(obj)
              obj.form = self.id
              console.log(obj)
              Meteor.call('addSubForm', obj, function(err, res) {
                if(err)
                  console.log(err)
              })
            }
          }
        }
      },
      addSubFormSchema: {
        class: MPlugin.Class.AddSubFormSchema,
        track: 'change',
        actions: {
          change: function(value) {
            if(value) {
              console.log(value)
              value = JSON.parse(value)
              self.parseSchema(value.schema, value.concept)
            }
          }
        }
      },
      liveForm: {
        class: MPlugin.Class.LiveForm,
        args: {id: self.id}
      }
    }
  }

  parseSchema(schema, concept) {
    this.items.parseSchema(schema, concept, this.id)
  }
}

SubForm = class SubForm extends MPlugin.Class.WiredDocument {
  constructor(id) {
    var collection = MPlugin.Plugins[key].Collection['pluginsubform']._collection
    super(collection, id, 'SubForm')

    var self = this
    
    this._dict = {
      liveSubForm: {
        class: MPlugin.Class.LiveSubForm,
        args: {id: self.id}
      },
      livetable: {
        class: MPlugin.Class.WiredTabular,
        args: {
          query: {},
          tableClass: MPlugin.Class.WiredTableLabeledSubForm,
          collection: 'subform_' + self.id
        }
      }
    }
    
  }

  parseSchema(schema, concept, form) {
    var self = this

    this.collection.insert({
        concept: concept,
        form: form
      }, function(err, res) {
        if(res) {
          console.log(res)
          for(f in schema) {
            var field = schema[f]
            field.subform = res
            console.log(field)
            self.items.parseField(f, field)
          }
        }
      })

    
  }

}

SubFormRecord = class SubFormRecord extends MPlugin.Class.WiredDocument {
  constructor(subform, id) {

    var subformid, collection
console.log(subform)
    if(subform instanceof String) {
      subformid = 'subform_' + subformid
      collection = defineCollection('SubForm', subformid)
      Meteor.call('defineCollection', 'SubForm', subformid)
    }
    else {
      collection = subform
      subformid = collection._name
    }

    super(collection, id, subformid)

    var self = this

  }
}

SubForms = class SubForms extends MPlugin.Class.WiredDocuments {
  constructor() {
    var collection = MPlugin.Plugins[key].Collection['pluginsubform']._collection
    var schema = MPlugin.Plugins[key].Collection['pluginsubform']._schema
    super(collection)

    var self = this
    self.subscription = 'SubForms'

    this._dict = {
      table: {
        class: MPlugin.Class.WiredTabular,
        args: {
          collection: 'pluginsubform',
          query: {}
        }
      }
    }
  }

}

FormFields = class FormFields extends MPlugin.Class.WiredDocuments {
  constructor() {
    var collection = MPlugin.Plugins[key].Collection['pluginformfield']._collection
    var schema = MPlugin.Plugins[key].Collection['pluginformfield']._schema
    super(collection, schema)

    var self = this
    self.subscription = 'Fields'

    this._dict = {
      table: {
        class: MPlugin.Class.WiredTabular,
        args: {
          collection: 'pluginformfield',
          query: {},
          options: {
            fields: {name: 1, type: 1, label: 1, subform: 1, ordering: 1}
          }
        }
      }
    }
  }

  parseField(name, field) {
    field.name = name
    console.log(field)
    this.collection.insert(field)
  }
}

FormField = class FormField extends MPlugin.Class.WiredDocument {
  constructor(id) {
    var collection = MPlugin.Plugins[key].Collection['pluginformfield']._collection
    super(collection, id)

    var self = this
  }
}
