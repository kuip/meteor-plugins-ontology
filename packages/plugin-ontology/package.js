Package.describe({
  name: 'loredanacirstea:plugin-ontology',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');

  api.use([
    'ecmascript', 
    'mongo', 
    'blaze', 
    'templating',
    'jquery',
    'reactive-var',
    'random',
    'aldeed:collection2',
    'underscore',
    'jossoco:svg-pan-zoom',
    'check' //only for extending the schema
    //'udondan:bulk-collection-update'
  ]);
  api.use([
    'loredanacirstea:plugin-class',
    
  ], [], {weak: true});

  api.addFiles([
    //'bulkupdate.js',
    'data/countries.js',
    '_utils.js',
    'schema.js',
    'data.js'
  ], ['client', 'server']);
  api.addFiles([
    'client/class/docs.js',
    'client/class/enabled.js',
    'client/class/wired.js',
    'client/template/plugin-ontology.html',
    'client/template/plugin-ontology.js',
    'client/template/plugin-ontology.css'
  ], 'client');
  api.addFiles([
    'papaparse.min.js',
    'plugin-ontology-server.js'
  ], 'server');

  api.addAssets([
    'data/ontology.csv',
    'data/term.csv',
    'data/termrel.csv',
    'data/countries.csv',
    'data/pluginontology.csv',
    'data/pluginconcept.csv',
    'data/pluginrelation.csv'
  ], 'server')

  api.export('Onto')
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('loredanacirstea:plugin-ontology');
  api.addFiles('plugin-ontology-tests.js');
});
