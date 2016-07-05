Package.describe({
  name: 'loredanacirstea:plugin-form',
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
    'random',
    'loredanacirstea:plugin-class',
    'loredanacirstea:plugin-ontology',
    'aldeed:autoform@4.0.0 || 5.0.0',
    'aldeed:collection2',
    'check'
  ]);
  api.addFiles([
    'schema.js',
    'data.js'
  ]);

  api.addFiles([
    'server.js'
  ], 'server');

  api.addFiles([
    'client/class/docs-form.js',
    'client/class/wiredclass-form.js',
    'client/template/form.html',
    'client/template/form.js',
    'client/template/form.css'
  ], 'client');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('loredanacirstea:plugin-form');
  //api.addFiles('plugin-form-tests.js');
});
