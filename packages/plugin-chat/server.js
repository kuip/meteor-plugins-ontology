Meteor.publish('Chats', function(query) {
  console.log('publish chats')
  if(!query)
    query = {}

  return MPlugin.Plugins['loredanacirstea:plugin-chat'].Collection['pluginchat']._collection.find(query)
})

Meteor.publish('Chat', function() {
  console.log('publish chats')
  if(!query)
    query = {}

  return MPlugin.Plugins['loredanacirstea:plugin-chat'].Collection['pluginchat']._collection.find(query)
})

Meteor.publish('Messages', function(query) {
  console.log('publish messages')
  if(!query)
    query = {}

  return MPlugin.Plugins['loredanacirstea:plugin-chat'].Collection['pluginmessage']._collection.find(query)
})

Meteor.methods({
  createMessage: function(obj) {
    MPlugin.Plugins['loredanacirstea:plugin-chat'].Collection['pluginmessage']._collection.insert(obj)
  }
})