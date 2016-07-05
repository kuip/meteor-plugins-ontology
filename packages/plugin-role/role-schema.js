UserSchema = {
  _id: {
    type: 'string',
    label: 'Id'
  },
  createdAt: {
    type: 'date',
    label: 'Created At'
  },
  username: {
    type: 'string',
    label: 'Username'
  },
  emails: {
    type: '[object]',
    label: 'Emails',
    blackbox: true
  },
  services: {
    type: 'object',
    label: 'Services',
    blackbox: true
  },
  profile: {
    type: 'object',
    optional: true,
    label: 'Profile'
  },
  'profile.firstname': {
    type: 'string',
    label: 'First Name'
  },
  'profile.lastname': {
    type: 'string',
    label: 'Last Name'
  },
  roles: {
    type: '[string]',
    label: 'Roles'
  }
}


PermissionSchema = {
  _id: {
    type: 'string',
    label: 'Id',
    optional: true //just because meteor adds it after validation
  },
  role: {
    type: 'string',
    label: 'Role Id'
  },
  operation: {
    type: 'string',
    label: 'Operation',
    allowedValues: ['read', 'search', 'insert', 'update', 'delete', 'all']
  },
  collection: {
    type: 'string',
    label: 'Collection'
  },
  ontology: {
    type: 'string',
    label: 'Ontology',
    optional: true
  },
  field: {
    type: 'string',
    label: 'Field',
    optional: true
  },
  id: {
    type: 'string',
    label: 'Id',
    optional: true
  }
}


RoleSchema = ConceptSchema = {
  concept: {//common Id for all languages available for this concept
    type: 'string',
    label: 'Concept Id'
  },
  term: { //translation of concept in the provided languages
    type: 'string',
    label: 'Term'
  },
  language: {
    type: 'string',
    label: 'Language'
  },
  icon: {
    type: 'string',
    label: 'Icon Id'
  },
  api: {
    type: 'string',
    label: 'API URL'
  }
}

RelationSchema = {
  concept1: {
    type: 'string',
    label: 'Concept1'
  },
  concept2: {
    type: 'string',
    label: 'Concept2'
  },
  relation: {
    type: 'number',
    label: 'Relation'
  },
  ordering: {
    type: 'number',
    label: 'Orderig'
  },
  updatedAt: {
    type: 'date',
    label: 'Updated At'
  }
}


iniData = [
  {
    role: {
      concept: 'God'
    },
    permission: [
      {
        operation: 'all',
        collection: 'pluginrole'
      },
      {
        operation: 'all',
        collection: 'pluginpermission'
      },
      {
        operation: 'all',
        collection: 'users',
        field: 'roles'
      }
    ]
  },
  {
    role: {
      concept: 'Admin'
    },
    permission: [
      {
        operation: 'read',
        collection: 'pluginrole'
      },
      {
        operation: 'search',
        collection: 'pluginrole'
      },
      {
        operation: 'insert',
        collection: 'pluginrole'
      },
      {
        operation: 'update',
        collection: 'pluginrole'
      },
      {
        operation: 'read',
        collection: 'pluginpermission'
      },
      {
        operation: 'search',
        collection: 'pluginpermission'
      },
      {
        operation: 'insert',
        collection: 'pluginpermission'
      },
      {
        operation: 'update',
        collection: 'pluginpermission'
      },
      {
        operation: 'all',
        collection: 'users',
        field: 'roles'
      }
    ]
  }
]

reduceSchema = function(schema, fields) {
  var newschema = {}

  for(f of fields)
    newschema[f] = schema[f]

  return newschema
}

parseField = function(doc, field) {
  if(field.indexOf('.') === -1)
    return doc[field]
  else {
    var fields = field.split('.')
    for(f of fields)
      doc = doc[f]

    return doc
  }
}


/*
getLabels = function(schema, fields) {
  var labels = []

  if(!fields)
    fields = ['_id'].concat(Object.keys(schema))

  for(f of fields) {
    if(f !== '_id')
      labels.push(schema[f].label || f)
    else
      labels.push('Id')
  }

  return labels
}*/