Package.describe({
  name: 'loredanacirstea:plugin-wrapper',
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
    'session', 
    'reactive-var', 
    'blaze', 
    'templating'
  ]);

  api.addFiles([
    'lib/_namespace.js',
    'lib/schemas.js'
  ], ['client', 'server']);

  api.addFiles([
    'server/plugins.js'
  ], 'server');

  api.addFiles([
    'client/plugins.html',
    'client/plugins.js',
    'client/plugins.css'
  ], 'client');

  api.export('Plugins')
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('loredanacirstea:plugin-wrapper');
  api.addFiles('plugin-wrapper-tests.js');
});
