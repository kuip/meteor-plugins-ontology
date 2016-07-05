key = 'loredanacirstea:plugin-role'
RoleOntology = 'zS3MkdoKv54Jt2pj4'

Role = {}

var cache = {
    "key" : key,
    'children': [
      {
        "key": 'options'
      },
      {
        'key': 'collection',
        'value': 'pluginrole',
        'children': [
          {
            'key': 'schema',
            'value': ConceptSchema,
          },
          {
            'key': 'PluginItem',
            'value': 'Role',
          },
          {
            'key': 'PluginItems',
            'value': 'Roles',
          },
          {
            'key': 'label',
            'value': ['concept']
          }
        ]
      },
      {
        'key': 'collection',
        'value': 'pluginpermission',
        'children': [
          {
            'key': 'schema',
            'value': PermissionSchema,
          },
          {
            'key': 'PluginItem',
            'value': 'Permission',
          },
          {
            'key': 'PluginItems',
            'value': 'Permissions',
          },
          {
            'key': 'label',
            'value': ['operation']
          }
        ]
      },
      {
        'key': 'collection',
        'value': 'pluginrolerels',
        'children': [
          {
            'key': 'schema',
            'value': RelationSchema,
          },
          {
            'key': 'PluginItem',
            'value': 'Relation',
          },
          {
            'key': 'PluginItems',
            'value': 'Relations',
          },
          {
            'key': 'label',
            'value': ['operation']
          }
        ]
      },
      {
        'key': 'route',
        'children': [
          {
            'key': '/roles',
            'value': {
              'template': 'Roles',
              'params': ['no']
            }
          },
          {
            'key': '/role',
            'value': {
              'template': 'Role'
            }
          },
          {
            'key': '/role/:id',
            'value': {
              'template': 'Role'
            }
          },
          {
            'key': '/permission',
            'value': {
              'template': 'Permission'
            }
          },
          {
            'key': '/permission/:id',
            'value': {
              'template': 'Permission'
            }
          }
        ]
      },
      {
        'key': 'subscription',
        'children': [
          {
            'key': 'Roles',
            'value': {
              'query': {}, 
              'options': {}
            }
          },
          {
            'key': 'Role',
            'value': {
              'query': {}, 
              'options': {}
            }
          },
          {
            'key': 'Permissions',
            'value': {
              'query': {}, 
              'options': {}
            }
          },
          {
            'key': 'Permission',
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
            'key': 'Roles',
            'value': {
              'collection': ['pluginrole'],
              'subscription': [
                {
                  'key': 'Roles',
                  'value': []
                }
              ]
            }
          },
          {
            'key': 'Role',
            'value': {
              'collection': ['pluginrole'],
              'subscription': [
                {
                  'key': 'Role',
                  'value': []
                }
              ]
            }
          },
          {
            'key': 'Permissions',
            'value': {
              'collection': ['pluginpermission'],
              'subscription': [
                {
                  'key': 'Permissions',
                  'value': []
                }
              ]
            }
          },
          {
            'key': 'Permission',
            'value': {
              'collection': ['pluginpermission'],
              'subscription': [
                {
                  'key': 'Permission',
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







