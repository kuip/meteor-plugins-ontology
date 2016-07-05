
Template.Ontology.onCreated(function() {
  var self = this

  this.component = new Ontology()

  this.subscribe('Ontologies')

  this.defaultFunction = {
    change: function(value) {
      if(value) {
        self.activeConcept.set(value)
      }
    }
  }

  this.activeConcept = new ReactiveVar()
  this.conceptLabels = new ReactiveVar([])

  self.component.actions = {
    selectLanguage: {
      change: function(value) {
        if(value)
          self._language.set(value)
      }
    },
    conceptSearch: self.defaultFunction,
    conceptSelectKids: self.defaultFunction,
    conceptSelectAll: self.defaultFunction,
    conceptSearchPhrase: self.defaultFunction,
    conceptTagging: self.defaultFunction,
    conceptTags: self.defaultFunction,
    label: self.defaultFunction,
    translateConcept: {
      change: function(value) {
        //console.log(value)
      }
    },
    svgConcept: {
    change: function(value) {
      if(value) {
        value = value.split(',')
        self.activeConcept.set(value[value.length-1])
        self.conceptLabels.set(value)
      }
    }
  }
  }

  this.component.ini('selectLanguage', {label: 'Select Language', system: true})
  this.component.ini('conceptSearch', {label: 'Search Concept'})
  this.component.ini('translateConcept', {label: 'Translate Concept'})
  this.component.ini('conceptLabel')
  this.component.ini('addConcept', {label: 'Add Concept'})
  this.component.ini('addTranslation', {label: 'Add Translation'})
  this.component.ini('conceptSelectKids', {label: 'Concept Children'})
  this.component.ini('conceptSelectAll', {label: 'Concept Browse'})
  this.component.ini('conceptSearchPhrase', {label: 'Compose Phrase'})
  this.component.ini('conceptTags', {label: 'Concept Tags'})
  //this.component.ini('annotateSvg', {label: 'Annotate SVG'})
  //this.component.ini('svgConcept', {label: 'SVG Concept Select'})
  //this.component.ini('svgChloropleth', {label: 'SVG Chloropleth'})

})


Template.Ontology.onRendered(function() {
  var self = this

  this.component.render('wiredComponents')

})

Template.Ontology.helpers({
  activeConcept: function() {
    var concept = Template.instance().activeConcept.get()
    console.log('activeConcept: ' + concept)
    return concept
  },
  conceptLabels: function() {
    var labels = Template.instance().conceptLabels.get()
    console.log('labels: ' + JSON.stringify(labels))
    return labels
  }
})

Template.Concept.onCreated(function() {
  console.log('Concept onCreated')
  var self = this
  self.component = new Concept(Template.currentData().concept)

  this.autorun(function() {
    var data = Template.currentData()

    if(data)
      if(data.concept) {
        Tracker.nonreactive(function() {
          //self.component = new Concept(data.concept)
          self.component.concept = data.concept
        })
      }
  })
})

Template.Concept.helpers({
  items: function() {
    var items = Template.instance().component.docs
    return items
  }
})


Template.ConceptLabel.onCreated(function() {
  var self = this
  self.randomconceptlabelid = Random.id()
  self.components = {}
  var comp

  this.load = function(concepts) {
    if(concepts) {
      concepts = concepts.split(',')
      for(c of concepts) {
        if(!self.components[c]) {
          self.components[c] = new Concept(c)
          self.components[c].ini('conceptLabel')
        }
      }
    }
  }

  var concepts = Template.currentData().concept
  this.load(concepts)
  

  //self.component = new Concept(Template.currentData().concept)
  //self.component.ini('conceptLabel')

  this.autorun(function() {
    var data = Template.currentData()

    if(data && data.concept)
      Tracker.nonreactive(function() {
        self.load(data.concept)
        //self.component.concept = data.concept
      })
  })
})

Template.ConceptLabel.helpers({
  randomconceptlabelid: function() {
    return Template.instance().randomconceptlabelid
  }
})

Template.ConceptLabel.onRendered(function() {
  /*if(this.component.query.concept)
    this.component.render('conceptLabel_' + this.component.query.concept + '_' + this.randomconceptlabelid)*/
    var dom = 'conceptLabel_' + this.randomconceptlabelid
  for(c in this.components)
      this.components[c].render(dom)
})

Template.svgconcept.onCreated(function() {
  var self = this

  this.component = new Ontology()

  this.subscribe('Ontologies')

  self.component.actions = {
    svgConcept: {
      change: function(value) {
        console.log(value)
      }
    }
  }

  this.component.ini('svgConcept', {label: 'SVG Concept Select'})
})

Template.svgconcept.onRendered(function() {
  this.component.render('svgconcept')
})

Template.svgannotate.onCreated(function() {
  var self = this
  
  this.component = new Ontology()

  this.subscribe('Ontologies')

  self.component.actions = {
    svgAnnotate: {
      change: function(value) {
        console.log(value)
      }
    }
  }

  this.component.ini('svgAnnotate')
})

Template.svgannotate.onRendered(function() {
  //$('head').prepend('<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">')
  //$('head').append('<script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>')
  this.component.render('svgannotate')
})

Template.chloropleth.onCreated(function() {
  var self = this
  
  this.component = new Ontology()

  this.subscribe('Ontologies')

  self.component.actions = {
    svgChloropleth: {
      change: function(value) {
        console.log(value)
      }
    }
  }

  this.component.ini('svgChloropleth')
})

Template.chloropleth.onRendered(function() {
  $('head').prepend('<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">')
  $('head').append('<script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>')
  this.component.render('chloropleth')
})