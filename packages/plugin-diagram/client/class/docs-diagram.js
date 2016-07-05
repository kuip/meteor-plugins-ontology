Diagram = class Ontology extends MPlugin.Class.WiredDocument {
  constructor(id) {
    var collection = DiagramColl
    super(collection, id)

    var self = this

    this._dict = {
      OntoDiagram: {
        class: MPlugin.Class.OntoDiagram
      }
    }
  }
}