key = 'loredanacirstea:plugin-form'
FormOntology = 'SXQM8s6THY8StPPkx'

PForms = {}
PForms.coll = {}
PForms.coll.FormGroup = {}
PForms.coll.Form = {}
PForms.coll.SubForm = {}


var cache = {
    "key" : key,
    'children': [
      {
        "key": 'options'
      },
      {
        'key': 'collection',
        'value': 'pluginformfield',
        'children': [
          {
            'key': 'schema',
            'value': FieldSchema,
          },
          {
            'key': 'PluginItem',
            'value': 'Field',
          },
          {
            'key': 'PluginItems',
            'value': 'Fields',
          },
          {
            'key': 'label',
            'value': ['type', 'label']
          }
        ]
      },
      {
        'key': 'collection',
        'value': 'pluginform',
        'children': [
          {
            'key': 'schema',
            'value': FormSchema,
          },
          {
            'key': 'PluginItem',
            'value': 'Form',
          },
          {
            'key': 'PluginItems',
            'value': 'Forms',
          },
          {
            'key': 'label',
            'value': ['type', 'label']
          }
        ]
      },
      {
        'key': 'collection',
        'value': 'pluginsubform',
        'children': [
          {
            'key': 'schema',
            'value': SubFormSchema,
          },
          {
            'key': 'PluginItem',
            'value': 'SubForm',
          },
          {
            'key': 'PluginItems',
            'value': 'SubForms',
          },
          {
            'key': 'label',
            'value': ['type', 'label']
          }
        ]
      },
      {
        'key': 'collection',
        'value': 'pluginformgroup',
        'children': [
          {
            'key': 'schema',
            'value': FormGroupSchema,
          },
          {
            'key': 'PluginItem',
            'value': 'FormGroup',
          },
          {
            'key': 'PluginItems',
            'value': 'FormGroups',
          },
          {
            'key': 'label',
            'value': ['type', 'label']
          }
        ]
      },
      {
        'key': 'route',
        'children': [
          {
            'key': '/formgroups',
            'value': {
              'template': 'FormGroups'
            }
          },
          {
            'key': '/formgroup/:id',
            'value': {
              'template': 'FormGroup'
            }
          },
          {
            'key': '/forms',
            'value': {
              'template': 'Forms'
            }
          },
          {
            'key': '/form/:id',
            'value': {
              'template': 'Form'
            }
          },
          {
            'key': '/subforms',
            'value': {
              'template': 'SubForms'
            }
          },
          {
            'key': '/subform/:id/:type/:record?',
            'value': {
              'template': 'SubForm'
            }
          },
          {
            'key': '/subform/:id',
            'value': {
              'template': 'SubFormData'
            }
          },
          {
            'key': '/fields',
            'value': {
              'template': 'Fields'
            }
          },
          {
            'key': '/field/:id',
            'value': {
              'template': 'Field'
            }
          }
        ]
      },
      {
        'key': 'subscription',
        'children': [
          {
            'key': 'Forms',
            'value': {
              'query': {}, 
              'options': {}
            }
          },
          {
            'key': 'SubForms',
            'value': {
              'query': {}, 
              'options': {}
            }
          },
          {
            'key': 'FormFields',
            'value': {
              'query': {}, 
              'options': {}
            }
          },
          {
            'key': 'FormGroups',
            'value': {
              'query': {}, 
              'options': {}
            }
          },
        ]
      },
      {
        'key': 'template',
        'children': [
          {
            'key': 'Forms',
            'value': {
              'collection': ['pluginform'],
              'subscription': [
                {
                  'key': 'Forms',
                  'value': []
                }
              ]
            }
          },
          {
            'key': 'Form',
            'value': {
              'collection': ['pluginform'],
              'subscription': [
                {
                  'key': 'Forms',
                  'value': []
                }
              ]
            }
          },
          {
            'key': 'SubForm',
            'value': {
              'collection': ['pluginsubform'],
              'subscription': [
                {
                  'key': 'SubForms',
                  'value': []
                }
              ]
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

defineCollection = function(type, id) {

  if(!MPlugin.getCollection(id)) {
    PForms.coll[type][id] = new Mongo.Collection(id)
  }
  else
    PForms.coll[type][id] = MPlugin.getCollection(id)

    if(Meteor.isServer) {

      Meteor.publish(id, function(query, options) {
        console.log('publish ' + this._name)
        if(!query)
          return []

        if(!options)
          options = {}

         var Collection = MPlugin.getCollection(this._name)

        if(query instanceof String)
          query = {_id: query}
console.log('query: ' + JSON.stringify(query))
        return Collection.find(query, options)
      })
    }
  
  

  return PForms.coll[type][id]
}

defineCollections = function(names) {
  for(n of names)
    if(n.indexOf('subform_') !== -1)
      defineCollection('SubForm', n)
    else if(n.indexOf('form_') !== -1)
      defineCollection('Form', n)
    else if(n.indexOf('formgroup_') !== -1)
      defineCollection('FormGroup', n)
}