Template.Forms.onRendered(function() {
  $('head').prepend('<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">')
  $('head').append('<script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>')
})

Template.FormGroupTab.onCreated(function() {
  this.component = new FormGroups()
  this.component.ini('add')
})

Template.FormGroupTab.onRendered(function() {
  this.component.render('addFormGroup')
})

Template.FormGroupTab.helpers({
  item: function() {
    var items = Template.instance().component.docs
    return items
  },
  addFormS: function() {
    return Session.get('addForm')
  },
  data: function() {
    return {
      formGroup: Session.get('addForm'),
      //collection: MPlugin.Plugins[key].Collection['pluginform']._collection
    }
  }
})

Template.FormGroupTab.events({
  'click .addFormButton': function(ev, templ) {
    Session.set('addForm', $(ev.currentTarget).data('id'))
  }
})

Template.addForm.onCreated(function() {
  console.log('addForm created')
  this.component = new FormGroup(Template.currentData().formGroup)
  this.component.ini('addForm')
  console.log(this.component)
})

Template.addForm.onRendered(function() {
  this.component.render('addForm')
})

Template.FormTab.onCreated(function() {
  this.component = new Forms()
})

Template.FormTab.helpers({
  item: function() {
    return Template.instance().component.docs
  },
  addSubFormS: function() {
    return Session.get('addSubForm')
  },
  addSubFormSchemaS: function() {
    return Session.get('addSubFormSchema')
  },
  data1: function() {
    return {
      form: Session.get('addSubForm')
    }
  },
  data2: function() {
    return {
      form: Session.get('addSubFormSchema')
    }
  }
})

Template.FormTab.events({
  'click .addSubFormButton': function(ev, templ) {
    Session.set('addSubForm', $(ev.currentTarget).data('id'))
  },
  'click .addSubFormSchemaButton': function(ev, templ) {
    Session.set('addSubFormSchema', $(ev.currentTarget).data('id'))
  }
})

Template.addSubFormSchema.onCreated(function() {
  console.log('addSubFormSchema created')
  this.component = new PForm(Template.currentData().form)
  console.log(Template.currentData().form)
  this.component.ini('addSubFormSchema')
})

Template.addSubFormSchema.onRendered(function() {
  this.component.render('addSubFormSchema')
})

Template.addSubForm.onCreated(function() {
  console.log('addSubForm created')
  this.component = new PForm(Template.currentData().form)
  console.log(Template.currentData().form)
  this.component.ini('addSubForm')
})

Template.addSubForm.onRendered(function() {
  this.component.render('addSubForm')
})


Template.SubFormTab.onCreated(function() {
  this.component = new SubForms()
  this.subscribe('SubForms')
})

Template.SubFormTab.helpers({
  item: function() {
    return Template.instance().component.docs
  },
  addFieldS: function() {
    return Session.get('addField')
  },
  data: function() {
    return {
      subform: Session.get('addField'),
      collection: MPlugin.Plugins[key].Collection['pluginformfield']._collection
    }
  }
})

Template.SubFormTable.onCreated(function() {
  this.component = new SubForm(Template.currentData()._id)
  this.component.ini('livetable')
  this.component.ini('liveSubForm', {type: 'insert'})
})

Template.SubFormTable.helpers({
  schema: function() {
    var schema = Template.instance().component.schema
    return JSON.stringify(schema)
  }
})

Template.SubFormTable.events({
  'click .addField': function(ev, templ) {
    Session.set('addField', $(ev.currentTarget).data('id'))
  },
  'click .showSubFormData' :function(ev, templ) {
    var self = this

    var t = Template.instance()

    t.component.wired('livetable').collection = 'subform_'+this._id
    $('#showSubFormDataTable').html('')
    $('#editSubFormData').html('')
    $('#showSubFormDataTable').append('<button id="insertRecordButton">insert</button>')

    t.component.wired('livetable').parentdomid = 'showSubFormDataTable'
    t.component.wired('livetable').render()

    $('#insertRecordButton').on('click', function() {
      $('#editSubFormData').html('')
      t.component.wired('liveSubForm').parentdomid = 'editSubFormData'
      t.component.wired('liveSubForm').render('editSubFormData')
    })
  },
  'click .showSubFormFields': function(ev, templ) {
    var self = this

    var t = Template.instance()

  }
})

Template.addField.onCreated(function() {
  var self = this

  this.svgurloptions = new ReactiveVar()
  this.ontologizedoptions = new ReactiveVar()

  Meteor.call('getSVGs', function(err, res) {
    if(res) {
      var opts = []
      for(r of res)
        opts.push({label: r, value: r})

      self.svgurloptions.set(opts)
    }
  })

  Meteor.call('getOntologies', Session.get('MPluginSysLang'), function(err, res) {
    if(res) {
      var opts = []
      for(r of res)
        opts.push({label: r.title, value: r.concept})

      self.ontologizedoptions.set(opts)
    }
  })

})

Template.addField.helpers({
  id: function() {
    return this.id || "insertField"
  },
  type: function() {
    return this.type || 'insert'
  },
  svgurloptions: function() {
    var opts = Template.instance().svgurloptions.get()
    console.log(opts)
    return opts
  },
  ontologizedoptions: function() {
    var opts = Template.instance().ontologizedoptions.get()
    console.log(opts)
    return opts
  }
})

Template.FieldTab.onCreated(function() {
  this.component = new FormFields()
  this.subscribe('Fields')
})

Template.FieldTab.onRendered(function() {
  //this.component.wired('addField').render('addField')
})

Template.FieldTab.helpers({
  item: function() {
    return Template.instance().component.docs
  },
  collection: function() {
    return Template.instance().component.collection
  },
  editFieldS: function() {
    return Session.get('editField')
  },
  data: function() {
    return {
      doc: Session.get('editField'),
      collection: MPlugin.Plugins[key].Collection['pluginformfield']._collection
    }
  }
})


Template.Form.onCreated(function() {
  this.component = new PForm()
})

Template.Form.onRendered(function() {
  //this.component.wired('form').render('showForm')
})

Template.FieldTable.events({
  'click .editField': function(ev, templ) {
    Session.set('editField', templ.data)
  }
})


Template.SubForm.onCreated(function() {
  var self = this
  this.component = new SubForm(FlowRouter.getParam('id'))

  if(FlowRouter.getParam('record'))
    var type = 'update'
  else
    var type = 'insert'
 
  this.component.ini('liveSubForm', {type: type, record: FlowRouter.getParam('record')})

})

Template.SubForm.onRendered(function() {
  //$('head').prepend('<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">')
  //$('head').append('<script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>')
  this.component.render('showSubForm')
})

Template.SubFormDataOperations.onCreated(function() {
  var collection = Template.currentData().data.collection
  var subform = collection.substring(collection.lastIndexOf('_')+1)
  this.subform = subform
  //this.component = new SubForm(subform)
  //this.component.ini('liveSubForm', {type: 'update'})
})

Template.SubFormDataOperations.events({
  'click .editRecord': function(ev, templ) {
    /*var self = this
    $('#editSubFormData').html('')

    Template.instance().component.wired('liveSubForm').doc = self.record
    Template.instance().component.render('editSubFormData')*/
    console.log(this)
    window.open('/subform/' + Template.instance().subform + '/update/' + this.record._id)
  },
  'click .delRecord': function(ev, templ) {

  }
})

Template.SubFormLive.onCreated(function() {
  var self = this
  this.onto = new Onto.Ontology()

  var schema = Template.currentData().schema
  var subform = Template.currentData().collName
  subform = subform.substring(subform.lastIndexOf('_')+1)

  this.concepted = {}
  this.onto.actions = {}

  //self.onto.ini('conceptLabel', {concept: subform})

  for(f in schema)
    if(schema[f].concepted) {
      this.concepted[f] = {type: schema[f].concepted, label: schema[f].label, svgurl: schema[f].svgurl}
    }

  this.setC = function(f) {
    self.onto.actions[f] = {
        change: function(value) {
          console.log(value)
          self.concepted[f].value = value
          self.concepted[f].svgurl = self.onto.wired(f).wired('svgDiv').svgname
        }
      }

    self.onto.ini(self.concepted[f].type, {key: f, statictype: true, label: self.concepted[f].label, svgurl: self.concepted[f].svgurl})
  }

  for(f in this.concepted) {
    this.setC(f)
  }

})

Template.SubFormLive.onRendered(function() {
  var self = this

  $('head').prepend('<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">')
  $('head').append('<script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>')
  $('body').css({'margin-left': '10px'})

  this.onto.render('ontoConcepted')
  //this.onto.wired('conceptLabel').parentdomid = 'SubFormTitle'
  //this.onto.wired('conceptLabel').render()

  var doc = Template.currentData().doc
  var svgurl

  if(doc)
    for(f in this.concepted) {
      if(doc[f]) {
        svgurl = null
        if(doc.meta && doc.meta[f])
          svgurl = doc.meta[f].svgurl

        if(!svgurl)
          svgurl = self.concepted[f].svgurl
        
        self.onto.wired(f).ini(doc[f].split(','), svgurl)
      }
    }
})

Template.SubFormData.onCreated(function() {
  this.component = new SubForm(FlowRouter.getParam('id'))
  this.component.ini('livetable')
})

Template.SubFormData.onRendered(function() {
  this.component.render('SubFormData')
})

Template.SubFormData.events({
  'click .insertRecord': function() {
    window.open('/subform/' + FlowRouter.getParam('id') + '/insert')
  }
})

AutoForm.hooks({
  insertField: {
    before: {
      insert: function(doc) {
        doc.subform = Session.get('addField')
        for(key of Object.keys(doc))
          if(doc[key] == 'true')
            doc[key] = true
          else if(doc[key] == 'false')
            doc[key] = false
        return doc
      }
    }
  },
  subFormLiveInsert: {
    before: {
      insert: function(doc) {
        var templ = this.template.view.parentView.parentView.templateInstance()
        var concepted = templ.concepted
        console.log(concepted)
        if(concepted) {
          doc.meta = {}

          for(f in concepted) {
            doc[f] = concepted[f].value
            doc.meta[f] = {
              svgurl: concepted[f].svgurl
            }
          }

          console.log(doc)
          return doc
        }
      },
      update: function(docid, doc) {
        var templ = this.template.view.parentView.parentView.templateInstance()
        var concepted = templ.concepted
        console.log(concepted)
        if(concepted) {
          for(f in concepted) {
            doc['$set'][f] = concepted[f].value
            doc['$set']['meta.' + f + '.svgurl'] = concepted[f].svgurl
          }
          console.log(doc)
          return doc
        }

      }
    },
    after: {
      insert: function(err, res) {
        var templ = this.template.view.parentView.parentView.templateInstance()
        var wireds = templ.onto.wireds

        for(w in wireds) {
          wireds[w].clear()
        }
      }
    }
  }
});