Template.Chats.onCreated(function() {
  console.log('Chats onCreated')
  var self = this
  this.subscribe('Chats')

  var collection = MPlugin.Plugins[key].Collection['pluginchat']._collection
  this.component = new Chats(collection)

  this.data = Template.currentData()
})

Template.Chats.onRendered(function() {
  var self = this

  this.autorun(function() {
    if(!self.data || Object.keys(self.data).length === 0)
      self.component.wired('participantInput').render('selectChats')
  })
})

Template.Chats.helpers({
  chat: function() {
      return Template.instance().component.findall()
  },
  data: function() {
    return {
      doc: this,
      template: 'ChatSummary'
    }
  }
})



Template.Chat.onCreated(function() {
  console.log('Chat onCreated')
  var self = this

  var collection = MPlugin.Plugins[key].Collection['pluginchat']._collection
  this.component = new Chat(collection)

  var data = Template.currentData()

  if(data.doc)
    this.component.load(data.doc._id)

  this.autorun(function() {
    self.subscribe('Chats', {_id: self.component.id})
  })

  this.autorun(function() {
    self.component.load(self.component.id)
  })

})

Template.Chat.helpers({
  data: function() {
    var data = this || {doc: Template.instance().component.doc}
    data.component = Template.instance().component
    return data
  },
  template: function() {
    return this.template || 'ChatFull'
  }
})

Template.ChatFull.onCreated(function() {
  var self = this
  this.component = Template.currentData().component
  this.render = new ReactiveVar(false)

  this.autorun(function() {
    if(self.render.get()) {
      self.component.wired('messageInput').render('ChatInput_' + self.component.id)
      self.component.wired('user').render('selectUser_' + self.component.id)
    }
  })
})


Template.ChatFull.helpers({
  doc: function() {
    var doc = Template.instance().component.doc
    if(doc) {
      var templ = Template.instance()
      Meteor.setTimeout(() => {
        templ.render.set(true)
      }, 500)
    }
      
    return doc
  },
  data: function() {
    return {
      query: {chat: this._id},
      options: {sort: {time: 1}}
    }
  }
})


Template.ChatSummary.helpers({
  data: function() {
    return {
      query: {chat: this._id},
      options: {sort: {time: -1},limit: 4}
    }
  }
})

/*Template.messages.onRendered(function() {
  //go to last message
  this.autorun(function() {
    if(FlowRouter.subsReady("chat"))
      $('#scrolldownid')[0].scrollIntoView()
  })
})*/
Template.Messages.onCreated(function() {
  console.log('Messages onCreated')
  var self = this

  var collection = MPlugin.Plugins[key].Collection['pluginmessage']._collection
  this.component = new MPlugin.Class.Documents(collection)
  
  this.autorun(function() {
    var data = Template.currentData()

    if(data) {
      self.component.query = data.query || {}
      self.component.options = data.options
      console.log(data)
      console.log(self)
      self.subscribe('Messages', self.component.query)
    }

  })
})

Template.Messages.helpers({
  message: function() {
    return Template.instance().component.findall()
  }
 
})

Template.ChatInput.events({
  'click #submitmessage, submit #submitmessageinput': function(ev, templ) {
    ev.preventDefault()
    ev.stopPropagation()
    var message = templ.$('#messageinput').val()
    if(message && message !== '')
      Meteor.call('sendMessage', this._id, message, function(err, res) {
        if(err)
          console.log(err)
        else {
          templ.$('#messageinput').val('')
          $('#scrolldownid')[0].scrollIntoView()
        }
      })
  }
})