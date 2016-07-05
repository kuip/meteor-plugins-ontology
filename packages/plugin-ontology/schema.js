SimpleSchema.extendOptions({
  concepted: Match.Optional(String),
  ontologized: Match.Optional(String),
  svgurl: Match.Optional(String),
  labelConcept: Match.Optional(String)
});


Ontology.OntologySchema = {
  title: {
    type: 'string',
    label: 'Title',
    optional: true
  },
  description: {
    type: 'string',
    label: 'Description'
  },
  language: {
    type: 'string',
    label: 'Language'
  },
  relation_type: {
    type: 'number',
    label: 'Relation Type'
  },
  relation_name: {
    type: 'string',
    label: 'Relation Name',
    optional: true
  },
  concept: {
    type: 'string',
    label: 'Root Concept'
  },
  source: {
    type: 'string',
    label: 'Source URL',
    optional: true
  },
  apiroot: {
    type: 'string',
    label: 'API root URL',
    optional: true
  },
  updatedAt: {
    type: 'date',
    label: 'Updated At',
    autoValue: {'MPFunction': 'TimeAuto'}
  }
}

Ontology.ConceptSchema = {
  concept: {//common Id for all languages available for this concept
    type: 'string',
    label: 'Concept Id'
  },
  term: { //translation of concept in the provided languages
    type: 'string',
    label: 'Term'
  },
  language: { //+ icon, api
    type: 'string',
    label: 'Language'
  },
  ontology: {
    type: 'string',
    label: 'Ontology'
  },
  synonym: {
    type: '[string]',
    label: 'Synonyms',
    optional: true
  }
}

Ontology.RelationSchema = {
  concept1: {
    type: 'string',
    label: 'Concept1'
  },
  concept2: {
    type: 'string',
    label: 'Concept2'
  },
  relation: {
    type: 'number',
    label: 'Relation'
  },
  ordering: {
    type: 'number',
    label: 'Orderig',
    optional: true
  },
  updatedAt: {
    type: 'date',
    label: 'Updated At',
    autoValue: {'MPFunction': 'TimeAuto'}
  },
  ontology: {
    type: 'string',
    label: 'Ontology',
    optional: true
  }
}


/*
OntologyPluginNamespace.schema.OntologySchema = {
  title: {
    type: String,
    label: 'Title',
    optional: true
  },
  description: {
    type: String,
    label: 'Description'
  },
  language: {
    type: String,
    label: 'Language'
  },
  relation_type: {
    type: Number,
    label: 'Relation Type'
  },
  relation_name: {
    type: String,
    label: 'Relation Name'
  },
  concept: {
    type: String,
    label: 'Root Concept'
  },
  source: {
    type: String,
    label: 'Source URL'
  },
  apiroot: {
    type: String,
    label: 'API root URL',
    optional: true
  },
  updatedAt: {
    type: Date,
    label: 'Updated At'
  }
}

OntologyPluginNamespace.schema.ConceptSchema = {
  concept: {//common Id for all languages available for this concept
    type: String,
    label: 'Concept Id'
  },
  term: { //translation of concept in the provided languages
    type: String,
    label: 'Term'
  },
  language: {
    type: String,
    label: 'Language'
  },
  api: {
    type: String,
    label: 'API URL'
  }
}

OntologyPluginNamespace.schema.RelationSchema = {
  concept1: {
    type: String,
    label: 'Concept1'
  },
  concept2: {
    type: String,
    label: 'Concept2'
  },
  relation: {
    type: Number,
    label: 'Relation'
  },
  ordering: {
    type: Number,
    label: 'Orderig'
  },
  updatedAt: {
    type: Date,
    label: 'Updated At'
  }
}
*/