key = 'loredanacirstea:plugin-diagram'
DiagramColl = new Mongo.Collection('plugindiagram')

var cache = {
    "key" : key,
    'children': [
      {
        "key": 'options'
      },
      {
        'key': 'route',
        'children': [
          {
            'key': '/diagram',
            'value': {
              'template': 'Diagram'
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