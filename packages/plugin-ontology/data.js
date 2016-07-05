key = 'loredanacirstea:plugin-ontology'
Onto = {}
Onto.concepted = {
  singleSearch: {dict: 'conceptSearch', type: 'single'},
  multiSearch: {dict: 'conceptSearch', type: 'multiple'},
  singleSvg: {dict: 'svgConcept', type: 'single'},
  multiSvg: {dict: 'svgConcept', type: 'multiple'}
}
SimpleSchema.extendOptions({
  concepted: Match.Optional(String)
})
var cache = {
    "key" : key,
    'children': [
      {
        "key": 'options'
      },
      {
        'key': 'collection',
        'value': 'pluginontology',
        'children': [
          {
            'key': 'schema',
            'value': Ontology.OntologySchema,
          },
          {
            'key': 'PluginItem',
            'value': 'Ontology',
          },
          {
            'key': 'PluginItems',
            'value': 'Ontologies',
          },
          {
            'key': 'label',
            'value': ['description']
          }
        ]
      },
      {
        'key': 'collection',
        'value': 'pluginconcept',
        'children': [
          {
            'key': 'schema',
            'value': Ontology.ConceptSchema,
          },
          {
            'key': 'PluginItem',
            'value': 'Concept',
          },
          {
            'key': 'PluginItems',
            'value': 'Concepts',
          },
          {
            'key': 'label',
            'value': ['term']
          }
        ]
      },
      {
        'key': 'collection',
        'value': 'pluginrelation',
        'children': [
          {
            'key': 'schema',
            'value': Ontology.RelationSchema,
          },
          {
            'key': 'PluginItem',
            'value': 'Relation',
          },
          {
            'key': 'PluginItems',
            'value': 'Relations',
          }
        ]
      },
      {
        'key': 'collection',
        'value': 'testchloropleth',
        'children': [
          {
            'key': 'schema',
            'value': {
              concept: {
                type: 'string',
                label: 'Concept Id'
              },
              field2: {
                type: 'string',
                label: 'Field 2'
              }
            }
          }
        ]
      },
      {
        'key': 'collection',
        'value': 'subform_WP9HaCdGCPRiWRQPi',
        'children': [
          {
            'key': 'schema',
            'value': {
              firstname: {
                type: 'string',
                label: 'First Name'
              },
              lastname: {
                type: 'string',
                label: 'Last Name'
              },
              country: {
                type: 'string',
                label: 'Country',
                concepted: 'singleSvg'
              },
              fractured: {
                type: 'string',
                label: 'Fractured Bones',
                concepted: 'singleSvg'
              }
            }
          }
        ]
      },
      {
        'key': 'route',
        'children': [
          {
            'key': '/ontologies',
            'value': {
              'template': 'Ontologies',
              'params': ['no']
            }
          },
          {
            'key': '/ontology',
            'value': {
              'template': 'Ontology'
            }
          },
          {
            'key': '/ontology/:id',
            'value': {
              'template': 'Ontology'
            }
          },
          {
            'key': '/svgconcept',
            'value': {
              'template': 'svgconcept'
            }
          },
          {
            'key': '/svgannotate',
            'value': {
              'template': 'svgannotate'
            }
          },
          {
            'key': '/chloropleth',
            
            'value': {
              'template': 'chloropleth'
            }
          },
          {
            'key': '/concept',
            'value': {
              'template': 'Concept'
            }
          },
          {
            'key': '/conceptall',
            'value': {
              'template': 'OntologyBrowseAll'
            }
          },
          {
            'key': '/conceptall/:id',
            'value': {
              'template': 'OntologyBrowseAll'
            }
          },
          {
            'key': '/conceptkids',
            'value': {
              'template': 'OntologyBrowseChildren'
            }
          },
          {
            'key': '/conceptkids/:id',
            'value': {
              'template': 'OntologyBrowseChildren'
            }
          },
          {
            'key': '/concept/:id',
            'value': {
              'template': 'Concept'
            }
          },
          {
            'key': '/tree',
            'value': {
              'template': 'ConceptTree'
            }
          },
          {
            'key': '/tree/:id',
            'value': {
              'template': 'ConceptTree'
            }
          }
        ]
      },
      {
        'key': 'subscription',
        'children': [
          {
            'key': 'Ontologies',
            'value': {
              'query': {}, 
              'options': {}
            }
          },
          {
            'key': 'Ontology',
            'value': {
              'query': {}, 
              'options': {}
            }
          },
          {
            'key': 'Concepts',
            'value': {
              'query': {}, 
              'options': {}
            }
          },
          {
            'key': 'Concept',
            'value': {
              'query': {}, 
              'options': {}
            }
          },
          {
            'key': 'Relations',
            'value': {
              'query': {}, 
              'options': {}
            }
          },
          {
            'key': 'Relation',
            'value': {
              'query': {}, 
              'options': {}
            }
          }
        ]
      },
      {
        'key': 'template',
        'children': [
          {
            'key': 'Ontologies',
            'value': {
              'collection': ['pluginontology'],
              'subscription': [
                {
                  'key': 'Ontologies',
                  'value': []
                }
              ]
            }
          },
          {
            'key': 'Ontology',
            'value': {
              'collection': ['pluginontology'],
              'subscription': [
                {
                  'key': 'Ontology',
                  'value': []
                }
              ]
            }
          },
          {
            'key': 'Concepts',
            'value': {
              'collection': ['pluginconcept'],
              'subscription': [
                {
                  'key': 'Concepts',
                  'value': []
                }
              ]
            }
          },
          {
            'key': 'Concept',
            'value': {
              'collection': ['pluginconcept'],
              'subscription': [
                {
                  'key': 'Concepts',
                  'value': []
                }
              ]
            }
          },
          {
            'key': 'ConceptTree',
            'value': {
              'collection': ['pluginconcept', 'pluginrelation'],
              'subscription': [
                {
                  'key': 'Concepts',
                  'value': []
                },
                {
                  'key': 'Relation',
                  'value': []
                }
              ]
            }
          },
          {
            'key': 'ConceptSearch',
            'value': {
              'collection': ['pluginconcept']
            }
          },
          {
            'key': 'OntologyBrowseAll',
            'value': {
              'collection': ['pluginconcept']
            }
          },
          {
            'key': 'OntologyBrowseChildren',
            'value': {
              'collection': ['pluginconcept']
            }
          }
        ]
      }
    ]
  }

if(Package['loredanacirstea:plugin-class']) {

  MPlugin = Package['loredanacirstea:plugin-class'].MPlugin

  MPlugin.Plugins[key] = {}

  MPlugin.initPackage(key, cache)


}


chloros = [
  { concept: '182046008', field2: 'somefield1'},
  { concept: '244656007', field2: 'somefield2'},
  { concept: '244658008', field2: 'somefield2'},
  { concept: '244659000', field2: 'somefield1'},
  { concept: '244660005', field2: 'somefield3'},
  { concept: '302517007', field2: 'somefield3'},
  { concept: '181923006', field2: 'somefield1'},
  { concept: '244662002', field2: 'somefield2'},
  { concept: '244663007', field2: 'somefield3'},
  { concept: '181794000', field2: 'somefield3'},
  { concept: '181796003', field2: 'somefield2'},
  { concept: '181795004', field2: 'somefield1'},
  { concept: '181812008', field2: 'somefield'},
  { concept: '181910004', field2: 'somefield2'},
  { concept: '182046008', field2: 'somefield2'},
  { concept: '244656007', field2: 'somefield2'},
  { concept: '244658008', field2: 'somefield1'},
  { concept: '182046008', field2: 'somefield'},
  { concept: '244656007', field2: 'somefield'},
  { concept: '244658008', field2: 'somefield2'},
  { concept: '182046008', field2: 'somefield1'},
  { concept: '244656007', field2: 'somefield3'},
  { concept: '244658008', field2: 'somefield3'},
  { concept: '244662002', field2: 'somefield2'},
  { concept: '244663007', field2: 'somefield3'},
  { concept: '181794000', field2: 'somefield1'},
  { concept: '244662002', field2: 'somefield'},
  { concept: '244663007', field2: 'somefield2'},
  { concept: '181794000', field2: 'somefield3'},
  { concept: '244662002', field2: 'somefield3'},
  { concept: '244663007', field2: 'somefield1'},
  { concept: '181794000', field2: 'somefield'},
  { concept: '244662002', field2: 'somefield2'},
  { concept: '244663007', field2: 'somefield2'},
  { concept: '181794000', field2: 'somefield1'},
  { concept: '181794000', field2: 'somefield'},
  { concept: '181796003', field2: 'somefield3'},
  { concept: '181795004', field2: 'somefield1'},
  { concept: '181794000', field2: 'somefield1'},
  { concept: '181796003', field2: 'somefield1'},
  { concept: '181795004', field2: 'somefield1'},
  { concept: '181794000', field2: 'somefield'},
  { concept: '181796003', field2: 'somefield3'},
  { concept: '181795004', field2: 'somefield3'},
  { concept: '181794000', field2: 'somefield3'},
  { concept: '181796003', field2: 'somefield3'},
  { concept: '181795004', field2: 'somefield1'},
  { concept: '181794000', field2: 'somefield1'},
  { concept: '181796003', field2: 'somefield1'},
  { concept: '181795004', field2: 'somefield'},
  { concept: '181794000', field2: 'somefield'},
  { concept: '181796003', field2: 'somefield1'},
  { concept: '181795004', field2: 'somefield'}
]

