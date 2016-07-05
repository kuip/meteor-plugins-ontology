Chats = class Chats extends MPlugin.Class.WiredDocuments {
  constructor(collection) {
    super(collection)

    var self = this

    this._actions['participantInput'] = {
      change: function(value) {
        self.query = {'participants': value}
        console.log(self.query)
      }
    }

    this._wired['participantInput'] = new MPlugin.Class.WiredInput('participantInput', 'Choose Participant', )
      .track(self, 'change')

  }
}

Chat = class Chat extends MPlugin.Class.WiredDocument {
  constructor(collection, id) {
    super(collection, id)

    this._user = 'lore'

    var self = this

    this._actions = {
      messageInput: {
        keyup: function(value) {
          console.log(value)
        },
        change: function(value) {
          if(value && value !== '') {
            var user
            if(Meteor.user())
              user = Meteor.user().username
            else
              user = self._user

            var obj = {
              message : value,
              user : user,
              chat : self.id,
              time: new Date()
            }
            console.log(obj)
            Meteor.call('createMessage', obj, function(err, res) {
              if(err)
                console.log(err)
              else
                self._wired['messageInput'].clearUI()
              console.log(res)
            })
          }
        }
      },
      url: {
        change: function(params) {
          console.log('url updated')
          console.log(params)
          if(params && params.id) {
            self.id = params.id
          }
        }
      },
      user: {
        change: function(value) {
          console.log('user updated')
          console.log(value)
          self._user = value
        }
      }
    }

    this._wired = {

      messageInput: new MPlugin.Class.WiredInput('messageInput')
        .track(self, ['change', 'keyup']),

      url: new MPlugin.Class.WiredURL('url').track(self, ['change']),

      user: new MPlugin.Class.WiredSelect('user', 'Select User', function() {
        var opt = new ReactiveVar([])

        Tracker.autorun(function() {
          if(self.doc) {
            var users = self.doc.participants
            var options = []
            for(u of users)
              options.push({
                label: u,
                value: u
              })

            opt.set(options)
          }
        })

        return opt
      }).track(self, ['change'])

    }


  }
}