Package.describe({
  name: 'loredanacirstea:plugin-class',
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
    'blaze',
    'templating',
    'mongo', 
    'reactive-var',
    'random',
    'aldeed:collection2',
    'meteorhacks:fast-render',
    'dburles:mongo-collection-instances'
  ]);

  api.addFiles([
    'schema.js',
    'plugin-class.js',
    'init.js'
  ], ['server', 'client']);

  api.addFiles([
    'server.js'
  ], 'server');

  api.addFiles([
    'client/template/templates.css',
    'client/template/templates.html',
    'client/template/templates.js',
    'client/class/doc-class.js',
    'client/class/shared-class.js',
    'client/class/enabled-class.js',
    'client/class/wiredclass.js',
    'client/class/wiredmixed.js'
  ], 'client');

  api.export(['MPlugin'])
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('loredanacirstea:plugin-class');
  api.addFiles('plugin-class-tests.js');
});
