MPlugin.Class.Languaged = class Languaged extends MPlugin.Class.Enabled{
  constructor() {
    super()
  }

  languaged(empty, system) {
    var self = this
    var first

    if(!this._language)
      this._language = new ReactiveVar()

    if(!this.language) {
      this.language = Session.get('MPluginSysLang')
      if(system)
        first = true
    }

    self._languagedKey = 'languaged'

    self.action('languageSelect', {
      change: function(value) {
        if(value)
          self.language = value
      }
    })

    self.wire('languageSelect', new MPlugin.Class.WiredSelect({key: 'languageSelect', placeholder: false}))

    if(!system)
      Tracker.autorun(function() {
        var sysl = Session.get('MPluginSysLang') || 'en'
        self.language = sysl

        if(sysl)
          self.wired('languageSelect').destroy()
      })

    Tracker.autorun(function() {
      var l = self.language

      Tracker.nonreactive(function() {
        
        if(!l || (system && first)) {

          self.wired('languageSelect').track(self, 'change')
          first = false

          Meteor.call('getLanguages', function(err, langs) {

            if(langs) {
              if(system || (!system && !Session.get('MPluginSysLang'))) {

                var def = Session.get('MPluginSysLang') || l

                if(!def && langs.indexOf('en'))
                  def = 'en'

                if(def) {
                  self.wired('languageSelect').setOptions(langs, def)
                  self.language = def
                }
                else
                  self.wired('languageSelect').setOptions(langs)
              }
            }
          })
        }
      })
    })

  }

  get language() {
    return this._language.get()
  }

  set language(language) {
    //console.log('setting language: ' + language)
    this._language.set(language)
  }
}


MPlugin.Class.Ontologized = class Ontologized extends MPlugin.Class.Enabled {
  constructor() {
    super()
  }

  ontologized(temporary) {

    var self = this
    if(!this._ontology)
      this._ontology = new ReactiveVar()

    this._ontologizedKey = 'ontologized'

    self.languaged()

    Tracker.autorun(function() {
      var ontology = self.ontology

      if(!ontology) {
        Tracker.nonreactive(function() {
          self.action('ontologySelect', {
            change: function(value) {
              self.ontology = value
            }
          })


          self.wire('ontologySelect', new MPlugin.Class.WiredSelect({key: 'ontologySelect'}).track(self, 'change'))

      
        
          Tracker.autorun(function() {
            var changed = self.language

            if(changed)
              Meteor.call('getOntologies', self.language, function(err, res) {
                if(res && (!temporary || (temporary && !self.language))) {
                  var options = {}
                  for(r of res)
                    options[r.concept] = r.description

                  self.wired('ontologySelect').setOptions(options)
                }
              })
          })
        })
      }
      else if(temporary && self.wired('ontologySelect')) {
        self.unwire('ontologySelect')
      }
    })

  }

  get ontology() {
    return this._ontology.get()
  }

  set ontology(ontology) {
    this._ontology.set(ontology)
  }
}


MPlugin.Class.Concepted = class Concepted extends MPlugin.Class.Enabled{
  constructor() {
    super()
  }

  concepted(temporary) {

    var self = this
    if(!this._concept)
      this._concept = new ReactiveVar()

    this._conceptedKey = 'concepted'
    this._letters = new ReactiveVar()
    this._max = 200

    self.ontologized(temporary)

    Tracker.autorun(function() {
      var concept = self.concept

      if(!concept) {

        Tracker.nonreactive(function() {

          self.action('searchInput', {
            keyup: function(value) {
              self.letters = value
            }
          })
          self.action('conceptSelect', {
            change: function(value) {
              if(value !== '.')
                self.concept = value
              else
                self.concept = null
            }
          })


          self.wire('searchInput', new MPlugin.Class.WiredInput({key: 'searchInput'}).track(self, 'keyup'))
          self.wire('conceptSelect', new MPlugin.Class.WiredSelect({key: 'conceptSelect'}).track(self, 'change'))

          Tracker.autorun(function() {
            var changed = self.language && (self.letters || !self.letters) && (self.ontology || !self.ontology)
            //if(changed)
              Meteor.call('conceptsearch', self.letters || '', self.language || 'en', self.ontology, self._max, function (err, res) {
                console.log(res)
                if(res && (!temporary || (temporary && !self.concept))) {
                  var options = {}

                  if(typeof res === 'number') {
                    options['.'] = res + ' > ' + self._max
                    self.wired('conceptSelect').setOptions(options, '.')
                  }
                  else {
                    options['.'] = res.length

                    for(r of res)
                      options[r[self.fieldvalue] || r.concept] = r.term

                    self.wired('conceptSelect').setOptions(options, '.')
                  }
                }
              })
          })
        })
      }
      else if(temporary) {
        if(self.wired('conceptSelect'))
          self.unwire('conceptSelect')
        if(self.wired('searchInput'))
          self.unwire('searchInput')
      }
    })
  }

  get concept() {
    return this._concept.get()
  }

  set concept(concept) {
    this._concept.set(concept)
  }

  get letters() {
    return this._letters.get()
  }

  set letters(letters) {
    this._letters.set(letters)
  }
}


MPlugin.Class.Labeled = class Labeled extends MPlugin.Class.Enabled{
  constructor() {
    super()
  }

  labeled() {

    var self = this
    this._labeledKey = 'label'

    this.concepted(true)

    if(!this.label || this.label === '') {

      this.wire('label', new MPlugin.Class.WiredLabel({key: 'label'}))

      Tracker.autorun(function() {
        var changed = self.concept && (self.language || 'en')
        //console.log('labeled: ' + self.concept)
        Tracker.nonreactive(function() {
          if(changed)
            Meteor.call('getConcept', self.concept, self.language || 'en' , function(err, res) {
              if(res) {
                self.wired('label').label = res.term
                self.wired('label').render()
              }
            })
          else {
            self.wired('label').label = ''
            self.wired('label').render()
          }
        })
      })
    }
  }
}




//auguments


MPlugin.augument(MPlugin.Class.Ontologized, MPlugin.Class.Languaged)
MPlugin.augument(MPlugin.Class.Concepted, MPlugin.Class.Languaged, MPlugin.Class.Ontologized)
MPlugin.augument(MPlugin.Class.Labeled, MPlugin.Class.Concepted)