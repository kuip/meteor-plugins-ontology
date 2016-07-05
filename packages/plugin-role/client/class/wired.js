MPlugin.Class.RoleWired = class RoleWired extends MPlugin.Class.ConceptWired {
  constructor({key, label, language, ontology, concept, login, sharedType, ontology}) {
    super({key: key, label: label, language: language, ontology: RoleOntology, login: login, sharedType: sharedType})
  }
}

MPlugin.Class.RoleLabel = class RoleLabel extends MPlugin.Class.ConceptLabel {
  constructor({key, label, language, concept, login, sharedType}) {
    super({key: key, label: label, language: language, ontology: RoleOntology, concept: concept, login: login, sharedType: sharedType})
  }
}

MPlugin.Class.AddRole = class AddRole extends MPlugin.Class.AddConcept{
  constructor({key, label, language, ontology, concept, login, sharedType}) {
    super({key: key, label: label, language: language, ontology: RoleOntology, concept: concept, login: login, sharedType: sharedType})
  }
}

MPlugin.Class.AddRoleTranslation = class AddRole extends MPlugin.Class.AddTranslation{
  constructor({key, label, language, ontology, concept, login, sharedType}) {
    super({key: key, label: label, language: language, ontology: RoleOntology, concept: concept, login: login, sharedType: sharedType})

    this._ontology = new ReactiveVar(RoleOntology)
  }
}


MPlugin.Class.RoleTags = class RoleTags extends MPlugin.Class.ConceptTags {
  constructor({key, label, language, ontology, concept, login, sharedType, ontology}) {
    super({key: key, label: label, language: language, ontology: RoleOntology, login: login, sharedType: sharedType})
  }
}

MPlugin.Class.PermissionSelect = class PermissionSelect extends MPlugin.Class.RoleWired{
  constructor({key, schema, label, language, ontology, concept, login, sharedType, ontology}) {
    super({key: key, label: label, language: language, ontology: RoleOntology, login: login, sharedType: sharedType})
    this.roled()

    var self = this
    this._schema = PermissionSchema //schema

    this._result = new ReactiveVar({})

    this.action('selectByOperation', {
      change: function(value) {
        if(value)
          self.add('operation', value)
        else
          self.remove('operation')
      }
    })
    this.action('selectByCollection', {
      change: function(value) {
        if(value) {
          self.add('collection', value)
        }
        else {
          self.remove('collection')
        }

        if(value === 'pluginconcept') {
          self.wire('selectByOntology', new MPlugin.Class.SelectOntology({key: 'selectByOntology', label: 'Ontology'}).track(self, 'change'))
          self.wired('selectByOntology').parentdomid = self.parentdomid
          self.wired('selectByOntology').render()
        }
        else
          if(self.wired('selectByOntology')) {
            console.log('destroy onto')
            self.unwire('selectByOntology')
            self.remove('ontology')
          }
      }
    })

    this.action('selectByOntology', {
      change: function(value) {
        if(value)
          self.add('ontology', value)
        else
          self.remove('ontology')
      }
    })

    this.wire('selectByOperation', new MPlugin.Class.WiredFilter({key: 'selectByOperation', schema: this._schema, field: 'operation', label: 'Operation'}).track(self, 'change'))

    this.wire('selectByCollection', new MPlugin.Class.WiredSelect({key: 'selectByCollection', label: 'Collection'}).track(self, 'change'))


    Meteor.call('getCollections', function(err, res) {

      if(res) {
        var options = []
        for(r of res)
          options.push(r.value)

        self.wired('selectByCollection').setOptions(options)
      }
    })

    Tracker.autorun(function() {
      var role = self.concept
      
      Tracker.nonreactive(function () {
        if(role)
          self.add('role', role)
        else
          self.remove('role')
      })

    })

    Tracker.autorun(function() {
      var query = self.result
      self.hidden = JSON.stringify(query)
    })
  }

  get result() {
    return this._result.get()
  }

  set result(result) {
    this._result.set(result)
  }

  add(field, value) {
    var result = this.result
    result[field] = value
    this.result = result
  }

  remove(field) {
    var result = this.result
    delete result[field]
    this.result = result
  }
}


MPlugin.Class.AddPermission = class AddPermission extends MPlugin.Class.WiredMixed {
  constructor({key, label, language, login, sharedType}) {
    super({key: key, label: label, language: language, login: login, sharedType: sharedType})

    var self = this
    this._set = new ReactiveVar()

    this.action('add', {
      change: function(value) {
        if(value)
          self._set.set(value)
      }
    })
    this.action('addButton', {
      click: function() {
        self.hidden = self._set.get()
      }
    })

    this.wire('add', new MPlugin.Class.PermissionSelect({key: 'add'}).track(self, 'change'))
    this.wire('addButton', new MPlugin.Class.WiredButton({key: 'addButton', label: '+'}).track(self, 'click'))
  }
}


//augument

MPlugin.augument(MPlugin.Class.PermissionSelect, MPlugin.Class.Roled)