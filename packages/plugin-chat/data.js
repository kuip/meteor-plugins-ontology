key = 'loredanacirstea:plugin-chat'

var cache = {
    "key" : key,
    'children': [
      {
        "key": 'options'
      },
      {
        'key': 'collection',
        'value': 'pluginchat',
        'children': [
          {
            'key': 'schema',
            'value': ChatS,
          },
          {
            'key': 'PluginItem',
            'value': 'Chat',
          },
          {
            'key': 'PluginItems',
            'value': 'Chats',
          },
          {
            'key': 'label',
            'value': ['topic', 'participants', 'patient']
          }
        ]
      },
      {
        'key': 'collection',
        'value': 'pluginmessage',
        'children': [
          {
            'key': 'schema',
            'value': MessageS,
          },
          {
            'key': 'PluginItem',
            'value': 'Message',
          },
          {
            'key': 'PluginItems',
            'value': 'Messages',
          },
          {
            'key': 'label',
            'value': ['user', 'time']
          }
        ]
      },
      {
        'key': 'route',
        'children': [
          {
            'key': '/chats',
            'value': {
              'template': 'Chats',
              'params': ['no']
            }
          },
          {
            'key': '/chat/:id',
            'value': {
              'template': 'Chat',
              'params': ['id', 'no']
            }
          }
        ]
      },
      {
        'key': 'subscription',
        'children': [
          {
            'key': 'Chats',
            'value': {
              'query': {}, 
              'options': {}
            }
          },
          {
            'key': 'Chat',
            'value': {
              'query': {}, 
              'options': {}
            }
          },
          {
            'key': 'Messages',
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
            'key': 'Chats',
            'value': {
              'type': 'PluginItems',
              'collection': ['pluginchat'],
              'subscription': [
                {
                  'key': 'Chats',
                  'value': []
                }
              ]
            }
          },
          {
            'key': 'Chat',
            'value': {
              'type': 'PluginItem',
              'collection': ['pluginchat'],
              'subscription': [
                {
                  'key': 'Chat',
                  'value': []
                }
              ]
            }
          },
          {
            'key': 'Messages',
            'value': {
              'type': 'PluginItems',
              'collection': ['pluginmessage'],
              'subscription': [
                {
                  'key': 'Messages',
                  'value': []
                }
              ]
            }
          },
          {
            'key': 'Message',
            'value': {
              'type': 'PluginItem',
              'collection': ['pluginmessage'],
              'subscription': [
                {
                  'key': 'Message',
                  'value': []
                }
              ]
            }
          }
        ]
      },
      {
        'key': 'shared',
        'children': [
          {
            'key': 'key',
            'value': 'ChatInput'
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