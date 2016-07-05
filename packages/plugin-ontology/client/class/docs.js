Onto.Ontologies = Ontologies = class Ontologies extends MPlugin.Class.WiredDocuments {
  constructor() {
    var collection = MPlugin.Plugins[key].Collection['pluginontology']._collection
    super(collection)

    var self = this
    this.subscription = 'Ontologies'
  }
}

Onto.Ontology = Ontology = class Ontology extends MPlugin.Class.WiredDocument {
  constructor(id) {
    var collection = MPlugin.Plugins[key].Collection['pluginontology']._collection
    super(collection, id)

    var self = this
    this.subscription = 'Ontology'

    this._language = new ReactiveVar()

    this._dict = {
      selectLanguage: {
        class: MPlugin.Class.SelectLanguage,
        track: 'change'
      },
      conceptSearch: {
        class: MPlugin.Class.ConceptSearch,
        track: 'change'
      },
      conceptSelectKids: {
        class: MPlugin.Class.ConceptSelectKids,
        track: 'change'
      },
      conceptSelectAll: {
        class: MPlugin.Class.ConceptSelectAll,
        track: 'change'
      },
      conceptSearchPhrase: {
        class: MPlugin.Class.ConceptSearchPhrase,
        track: 'change'
      },
      conceptTagging: {
        class: MPlugin.Class.ConceptTagging,
        track: 'change'
      },
      conceptTags: {
        class: MPlugin.Class.ConceptTags,
        track: 'change'
      },
      conceptLabel: {
        class: MPlugin.Class.ConceptLabel
      },
      translateConcept: {
        class: MPlugin.Class.TranslateConcept,
        track: 'change'
      },
      addConcept: {
        class: MPlugin.Class.AddConcept
      },
      addTranslation: {
        class: MPlugin.Class.AddTranslation
      },
      svgAnnotate: {
        class: MPlugin.Class.AnnotateSvg
      },
      svgConcept: {
        class: MPlugin.Class.SvgConcept,
        track: 'change'
      },
      svgChloropleth: {
        class: MPlugin.Class.SvgChloropleth
      }
    }

  }

  get language() {
    return this._language.get()
  }

  get activeConcept() {
    return this._activeConcept.get()
  }

  set activeConcept(concept) {
    this._activeConcept.set(concept)
  }

  ini(key, userArgs, subscriber) {
    if(!this.dict[key]) {
      var c = Onto.concepted[key]

      if(c) {
        key = c.dict
        userArgs.type = c.type
      }
    }
    super(key, userArgs, subscriber)
  }
}


Onto.Concept = Concept = class Concept extends MPlugin.Class.WiredDocuments {
  constructor(concept, language) {
     var collection = MPlugin.Plugins[key].Collection['pluginconcept']._collection
    super(collection)

    var self = this
    this._concept = new ReactiveVar(concept)
    this._language = new ReactiveVar(language)

    Tracker.autorun(function() {
      var concept = self.concept

      Tracker.nonreactive(function() {
        if(concept) {
          self.query = {concept: concept}
          self.subscription = 'Concepts'
        }
      })
    })

    Tracker.autorun(function() {
      var changed = self.concept && self.rendered

      if(changed) {
        Tracker.nonreactive(function() {
          if(self.wired('conceptLabel')) {
            self.wired('conceptLabel').concept = concept
          }
        })
      }
    })


    this._dict = {
      conceptLabel: {
        class: MPlugin.Class.ConceptLabel
      },
      translateConcept: {
        class: MPlugin.Class.TranslateConcept,
        track: 'change'
      }
    }
  }

  get concept() {
    return this._concept.get()
  }

  set concept(concept) {
    this._concept.set(concept)
  }

}


Onto.Term = Term = class Term extends MPlugin.Class.WiredDocument {
  constructor(id) {
    var collection = MPlugin.Plugins[key].Collection['pluginconcept']._collection
    super(collection, id)

  }
}


/*
MPlugin.Class.ConceptedWiredDoc = class ConceptedWiredDoc {
  constructor() {
  }


}


//auguments

MPlugin.augument(MPlugin.Class.WiredDocuments, MPlugin.Class.ConceptedWiredDoc)
*/