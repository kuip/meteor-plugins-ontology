

MPlugin.Class.SharedData = class SharedData {
  constructor(wired, eventtype) {

    this._data = null
    this._wired = wired
    this._event = eventtype
    this._tracker = null

  }

  get data() {
    return this._data
  }

  set data(data) {
    this._data = data
  }

  untrack() {
    if(this._tracker)
      this._tracker.stop()
  }

  track() {
    //stop existing computations
    this.untrack()

    var self = this

    this._tracker = Tracker.autorun(function() {  
      var data = self.data

      Tracker.nonreactive(function () {
        self._wired.update(data, self._event)
      })
    })
  }

  update(value) {
    this.data = value
  }

  clear(callb) {
    this.untrack()
    this.data = null
    if(callb)
      callb()
    this.track()
  }
}

MPlugin.Class.SharedReactiveVar = class SharedReactiveVar extends MPlugin.Class.SharedData {
  constructor(wired, eventtype) {
    super(wired, eventtype)

    this._data = new ReactiveVar()

  }

  get data() {
    return this._data.get()
  }

  set data(data) {
    this._data.set(data)
  }
}


MPlugin.Class.SharedSession = class SharedSession extends MPlugin.Class.SharedData {
  constructor(wired, eventtype) {
    super(wired, eventtype)

    this._key = this._wired.domid + '_' + this._event
  }

  get key() {
    return this._key
  }

  get data() {
    return Session.get(this.key)
  }

  set data(data) {
    Session.update(this.key, data)
  }
}

MPlugin.Class.SharedTempSession = class SharedMeteorSession extends MPlugin.Class.SharedSession {

  set data(data) {
    Session.set(this.key, data)
  }

}


MPlugin.Class.SharedPersistentSession = class SharedSession extends MPlugin.Class.SharedData {

  set data(data) {
    Session.setPersistent(this.key, data)
  }

}

MPlugin.Class.SharedAuthSession = class SharedSession extends MPlugin.Class.SharedData {

  set data(data) {
    Session.setAuth(this.key, data)
  }
}


