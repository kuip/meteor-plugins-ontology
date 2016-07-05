Package.describe({
  name: 'loredanacirstea:plugin-role',
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
    'matb33:collection-hooks',
    'loredanacirstea:meteor-tabular-filter'
  ]);
  api.use([
    'loredanacirstea:plugin-class',
    'loredanacirstea:plugin-ontology'
  ], [], {weak: true});

  api.addFiles([
    'role-schema.js',
    'role-data.js',
    
  ], ['client', 'server']);

  api.addFiles([
    'role-server.js'
  ], 'server');

  api.addFiles([
    
    'client/class/docs.js',
    'client/class/enabled.js',
    'client/class/wired.js',
    'client/template/role.css',
    'client/template/role.html',
    'client/template/role.js',
  ], 'client');


});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('loredanacirstea:plugin-role');
  api.addFiles('plugin-role-tests.js');
});
