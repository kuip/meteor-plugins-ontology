MPlugin.Class.Roled = class Roled extends MPlugin.Class.Concepted {
  constructor() {
    super()
  }

  roled(label1, label2) {
    this.ontology = RoleOntology
    super.concepted(label1, label2)
  }
}






//augument

MPlugin.augument(MPlugin.Class.Roled, MPlugin.Class.Languaged, MPlugin.Class.Ontologized)