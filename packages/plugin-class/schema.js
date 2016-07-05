//should we attach a schema?

PluginCollectionSchema = {
  parent: {
    type: String,
    label: "Parent Id",
    optional: true
  },
  key: {
    type: String,
    label: 'Key'
  },
  value: {
    type: String,
    label: 'Value',
    optional: true
  }
}

SharedDataSchema = {
  plugin: {
    type: String,
    label: "Plugin Key"
  },
  output: {
    type: Boolean,
    label: 'Input/Output'
  },
  key: {
    type: String,
    label: "Exact Key"
  },
  value: {
    type: Object,
    label: 'Value'
  },
  session: {
    type: String,
    label: 'Session',
    optional: true
  }
}



/*
PluginCollectionSchema = {
  parent: {
    type: 'string',
    label: "Parent Id",
    optional: true
  },
  key: {
    type: 'string',
    label: 'Key'
  },
  value: {
    type: 'string',
    label: 'Value',
    optional: true
  }
}

SharedDataSchema = {
  plugin: {
    type: 'string',
    label: "Plugin Key"
  },
  output: {
    type: 'boolean',
    label: 'Input/Output'
  },
  key: {
    type: 'string',
    label: "Exact Key"
  },
  value: {
    type: 'object',
    label: 'Value'
  },
  session: {
    type: 'string',
    label: 'Session',
    optional: true
  }
}
*/


