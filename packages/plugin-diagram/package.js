Package.describe({
  name: 'loredanacirstea:plugin-diagram',
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
    'jquery',
    'underscore',
    'reactive-var',
    'loredanacirstea:plugin-class',
    'loredanacirstea:plugin-ontology',

    'perak:markdown'
  ]);

  api.addFiles([
    'data.js'
  ], ['client', 'server']);

  api.addFiles([
    'client/class/docs-diagram.js',
    'client/class/wired-diagram.js',

    //'client/lib/lodash.js',
    //'client/lib/nomnoml.js',
    //'client/lib/require.min.js',

    //'client/lib/1.raphael-min.js',
    //'client/lib/2.svg.min.js',
    //'client/lib/3.sequence-diagram-min.js',
    
    'client/lib/marked.js',

    'client/template/plugin-diagram.css',
    'client/template/plugin-diagram.html',
    'client/template/plugin-diagram.js'
  ], 'client');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('loredanacirstea:plugin-diagram');
  api.addFiles('plugin-diagram-tests.js');
});
