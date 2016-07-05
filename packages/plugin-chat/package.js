Package.describe({
  name: 'loredanacirstea:plugin-chat',
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
    'jquery'
  ]);
  api.addFiles([
    'schema.js',
    'data.js'
  ]);

  api.addFiles([
    'server.js'
  ], 'server');

  api.addFiles([
    'clientclass.js',
    'chat.html',
    'chat.js',
    'chat.css'
  ], 'client');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('loredanacirstea:plugin-chat');
  //api.addFiles('plugin-chat-tests.js');
});
