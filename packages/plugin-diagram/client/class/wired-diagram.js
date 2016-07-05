MPlugin.Class.OntoDiagram = class OntoDiagram extends MPlugin.Class.WiredMixed {
   constructor({key, label, language, ontology, login, sharedType, hidden}) {
    super({key: key, label: label, language: language, login: login, sharedType: sharedType, hidden: hidden})

    var self = this

    this.action('searchPhrase', {
      change: function(value) {
        console.log(value)
      }
    })

    this.wire('searchPhrase', new MPlugin.Class.ConceptSearchPhrase({key: 'searchPhrase'}).track(self, 'change'))

    this.wire('diagram', new MPlugin.Class.WiredDiagram({key: 'diagram'}))
  }
}

MPlugin.Class.WiredDiagram = class WiredDiagram extends MPlugin.Class.WiredClass {
  constructor({key, label, type, language, login, sharedType}) {

    super({key: key, label: label, language: language, login: login, sharedType: sharedType})

    this._template = 'WiredDiagram'
  }
}