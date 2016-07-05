Package.describe({
  name: 'loredanacirstea:plugin-devi',
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
    'session',
    'tracker',
    'check',
    //'loredanacirstea:plugin-class',
    //'loredanacirstea:plugin-ontology',

    'perak:markdown',
    'perak:codemirror',
    'aldeed:simple-schema',
    'aldeed:collection2',
    'mizzao:sharejs-codemirror',
    'coffeescript',
    'stylus',
    'kadira:flow-router',
    'kadira:blaze-layout',
    'reywood:publish-composite'

    //raix:eventddp
    //accounts-password
    //accounts-ui
    //jabbslad:basic-auth
  ]);

  api.addFiles([
    'lib/_firstToLoad/_namespace.js',
    'lib/collections/documents.js',
    'lib/routes/routes.js',
    'common/methods/documents.js'
  ], ['server', 'client']);

  api.addFiles([
    'server/publications/documents.js'
  ], 'server');

  api.addFiles([
    'client/lib/1.raphael-min.js',
    'client/lib/2.svg.min.js',
    'client/lib/3.sequence-diagram-min.js',
    'client/lib/commonHelpers.js',
    'client/lib/marked.js',
    'client/templates/applicationLayout.html',
    'client/templates/main.css',
    'client/templates/main.html',
    'client/templates/main.js',
    'client/templates/preview/preview.html',
    'client/templates/preview/preview.js',
    'client/templates/raw/raw.html',
    'client/templates/raw/raw.js',
    'client/startup.js'
  ], 'client');

  api.addAssets([
    'client/templates/main.styl.txt'
  ], 'client')
  
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('loredanacirstea:plugin-devi');
  api.addFiles('plugin-devi-tests.js');
});
