MPlugin.Class.Enabled = class Enabled extends MPlugin.Class.Default{
  constructor() {
    super()
  }
}


MPlugin.Class.Logged = class Logged extends MPlugin.Class.Enabled{
  constructor() {
    super()
  }

  augument() {
    var self = this
    this._loggedKey = 'logged'
    if(!this._user)
      this._user = new ReactiveVar()

    Tracker.autorun(function() {
      var user = Meteor.userId()
      if(!user) {
        self._actions.logged = {
          change: function(value) {
            if(value)
              self._user.set(value)
          }
        }

        self.wire('logged', new MPlugin.Class.WiredSelect({key: 'logged'}).track(self, 'change'))

        Meteor.call('getUsers', function(err, res) {
          if(res) {
            var opt = {}
            for(r of res)
              opt[r._id] = r.username || r._id

            self.wired('logged').setOptions(opt)
          }
        })
      }

    })
  }
}
