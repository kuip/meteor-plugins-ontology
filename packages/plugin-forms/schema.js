FieldSchema = {
  name: {
    type: 'string',
    label: 'Name'
  },
  type: {
    type: 'string',
    label: 'Type',
    allowedValues: ['string', 'number', 'boolean', 'object', 'data', 'regex', '[string]', '[number]', '[boolean]', '[object]','[data]']
  },
  label: {
    type: 'string',
    label: 'Label',
    optional: true
  },
  labelConcept: {
    type: 'string',
    label: 'Label Concept',
    optional: true
  },
  optional: {
    type: 'boolean',
    label: 'Optional',
    optional: true,
    //allowedValues: [true, false]
  },
  concepted: {
    type: 'string',
    label: 'Concepted',
    optional: true,
    allowedValues: Object.keys(Onto.concepted)
  },
  ontologized: {
    type: 'string',
    label: 'Ontologized',
    optional: true
  },
  svgurl: {
    type: 'string',
    label: 'Svg Url',
    optional: true
  },
  min: {
    type: 'number',
    label: 'Min',
    optional: true
  },
  max: {
    type: 'number',
    label: 'Max',
    optional: true
  },
  exclusiveMin: {
    type: 'boolean',
    label: 'Exclusive Min',
    optional: true,
    //allowedValues: [true, false]
  },
  exclusiveMax: {
    type: 'boolean',
    label: 'Exclusive Max',
    optional: true,
    //allowedValues: [true, false]
  },
  defaultValue: {
    type: 'number',
    label: 'defaultValue',
    optional: true
  },
  autoValue: {
    type: 'function',
    label: 'Auto Value',
    optional: true
  },
  allowedValues: { 
    type: '[string]',
    label: 'Allowed Values',
    optional: true
  },
  allowedConcepts: {
    type: '[string]',
    label: 'Allowed Concepts',
    optional: true
  },
  decimal: {
    type: 'boolean',
    label: 'Decimal',
    optional: true,
    //allowedValues: [true, false]
  },
  minCount: {
    type: 'number',
    label: 'Min Count',
    optional: true
  },
  maxCount: {
    type: 'number',
    label: 'Max Count',
    optional: true
  },
  regex: {
    type: 'regex',
    label: 'RegExp',
    optional: true
  },
  blackbox: {
    type: 'boolean',
    label: 'Blackbox',
    optional: true,
    //allowedValues: [true, false]
  },
  trim: {
    type: 'boolean',
    label: 'Trim',
    optional: true,
    //allowedValues: [true, false]
  },
  subform: {
    type: 'string',
    label: 'SubForm'
  },
  ordering: {
    type: 'number',
    label: 'Ordering',
    optional: true,
    defaultValue: 1
  }
}


SubFormSchema = {
  concept: {
    type: 'string',
    label: 'Concept',
    optional: true
  },
  form: {
    type: 'string',
    label: 'Form'
  },
  ordering: {
    type: 'number',
    label: 'Ordering',
    optional: true,
    defaultValue: 1
  }
}


FormSchema = {
  concept: {
    type: 'string',
    label: 'Concept',
    optional: true
  },
  formGroup: {
    type: 'string',
    label: 'Form Group',
    optional: true
  },
  ordering: {
    type: 'number',
    label: 'Ordering',
    optional: true,
    defaultValue: 1
  }
}

FormGroupSchema = {
  concept: {
    type: 'string',
    label: 'Concept',
    optional: true
  }
}