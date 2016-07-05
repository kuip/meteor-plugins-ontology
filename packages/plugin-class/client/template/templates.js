Template.registerHelper('HLog', function(data) {
  console.log(data)
})

Template.registerHelper('HNoData', function(data) {
  console.log(data)
  if(!data || Object.keys(data).length === 0)
    return true
})

Template.registerHelper('HEmpty', function(obj) {
  if(!obj)
    return true
  
  if(obj instanceof Array)
    return obj.length === 0

  if(obj instanceof Object)
    return Object.keys(obj).length === 0
})

Template.registerHelper('HEqual', function(a,b) {
  return a == b
})

Template.registerHelper('HSchemaContains', function(schema, field, attribute) {
  if(schema[field][attribute])
    return true

  return false
})

Template.WiredSelect.helpers({
  value: function(obj, key) {
    return obj[key]
  }
})

Template.WiredTable.helpers({
  template: function() {
    return this.template || 'WiredRecord'
  },
  data: function() {
    var field = this.field
    if(!field)
      if(this && this instanceof String)
        field = this.valueOf()

    var data = {
      record: Template.parentData(),
      field: this.field || field,
      data: this.data
    }
    var magicField = this.magicField || 'wiredrecordvalue'
    data[magicField] = data.record[data.field]

    return data
  }
})

Template.WiredRecord.helpers({
  parse: function(value) {
    if(value instanceof Object)
      return JSON.stringify(value)

    return value
  }
})