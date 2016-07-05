MPlugin.Class.ConceptWired = ConceptWired = class ConceptWired extends MPlugin.Class.WiredMixed {
  constructor({key, label, language, ontology, concept, login, sharedType, hidden}) {
    super({key: key, label: label, language: language, login: login, sharedType: sharedType, hidden: hidden})

    this._language = new ReactiveVar(language)
    this._concept = new ReactiveVar(concept)
    this._ontology = new ReactiveVar(ontology)
    
  }

  get language() {
    return this._language.get()
  }

  set language(language) {
    console.log('setting language: ' + language)
    this._language.set(language)
  }

  get concept() {
    return this._concept.get()
  }

  set concept(concept) {
    this._concept.set(concept)
  }

  get ontology() {
    return this._ontology.get()
  }

  set ontology(ontology) {
    this._ontology.set(ontology)
  }
}

MPlugin.Class.SelectLanguage = class SelectLanguage extends ConceptWired {
  constructor({key, label, language, login, sharedType, system}) {
    super({key: key, label: label, language: language, login: login, sharedType: sharedType, hidden: false})
    
    this.languaged(null, true)
    var self = this

    if(system)
      Tracker.autorun(function() {
        var language = self.language
        if(language) {
          Session.setPersistent('MPluginSysLang', language)
        }
      })
  }
}


MPlugin.Class.ConceptSearch = class ConceptSearch extends ConceptWired {
  constructor({key, label, language, ontology, concept, login, sharedType}) {
    super({key: key, label: label, language: language, ontology: ontology, concept: concept, login: login, sharedType: sharedType})
    this.concepted()
  }
}


MPlugin.Class.ConceptLabel = class ConceptLabel extends ConceptWired {
  constructor({key, label, language, ontology, concept, login, sharedType}) {
    super({key: key, label: label, language: language, ontology: ontology, concept: concept, login: login, sharedType: sharedType, hidden: false})
    this.labeled()
  }
}


MPlugin.Class.ConceptSelectKids = class ConceptSelectKids extends ConceptWired {
  constructor({key, label, language, ontology, concept, login, sharedType}) {
    super({key: key, label: label, language: language, ontology: ontology, concept: concept, login: login, sharedType: sharedType})

    this.concepted()
    var self = this

    this.action('selectConcept', {
      change: function(value) {
        self.hidden = value
        self.concept = value

        if(value)
          Meteor.call('getConcept', value, self.language, function(err, res) {

            if(res) {
              self.label = res.term
              $('#' + self.domid + '_label').text(res.term)
            }
          })
      }
    })

    this.wire('selectConcept', new MPlugin.Class.WiredSelect({key: 'selectConcept'}).track(self, 'change'))

    Tracker.autorun(function() {
      var changed = self.concept && self.language
      //console.log('conceptKids changed')
      if(changed) {
        Meteor.call('conceptscompute', 'children', self.concept, self.language, function(err, res) {
          if(res) {
            var options = {}
            for(r of res)
                options[r.concept] = r.term

            self.wired('selectConcept').setOptions(options)
            
          }
        })
      }
    })

    Tracker.autorun(function() {
      var concept = self.concept
      $('#' + self.domid + '_label').text('')
    })
  }
}


MPlugin.Class.ConceptSelectAll = class ConceptSelectAll extends ConceptWired {
  constructor({key, label, language, ontology, concept, login, sharedType}) {
    super({key: key, label: label, language: language, ontology: ontology, concept: concept, login: login, sharedType: sharedType})

    this.concepted()
    var self = this

    this._type = new ReactiveVar()

    this.action('selectType', {
      change: function(value) {
        if(value)
          self.type = value
      }
    })

    this.action('selectConcept', {
      change: function(value) {
        self.hidden = value
        self.concept = value
        if(value)
          Meteor.call('getConcept', value, self.language, function(err, res) {

            if(res) {
              self.label = res.term
              $('#' + self.domid + '_label').text(res.term)
            }
          })
      }
    })

    this.wire('selectType', new MPlugin.Class.WiredSelect({
      key: 'selectType',
      options: ['children', 'brothers', 'path']
    }).track(self, 'change'))

    this.wire('selectConcept', new MPlugin.Class.WiredSelect({key: 'selectConcept'}).track(self, 'change'))


    Tracker.autorun(function() {
      var changed = self.concept && self.language

      if(changed) {
        Meteor.call('conceptscompute', self.type, self.concept, self.language, function(err, res) {
          if(res) {
            var options = {}
            for(r of res)
                options[r.concept] = r.term

            self.wired('selectConcept').setOptions(options)
          }
        })
      }
    })

    Tracker.autorun(function() {
      var concept = self.concept
      $('#' + self.domid + '_label').text('')
    })
  }

  get type() {
    return this._type.get()
  }

  set type(type) {
    this._type.set(type)
  }
}


MPlugin.Class.ConceptSearchPhrase = class ConceptSearchPhrase extends ConceptWired {
  constructor({key, label, language, ontology, concept, login, sharedType}) {
    super({key: key, label: label, language: language, ontology: ontology, concept: concept, login: login, sharedType: sharedType})

    this.languaged()

    var self = this
    this._phrase = null
    this._letters = new ReactiveVar()
    this._start = null
    this._end = null
    this._max = 200

    this._symbol = {
      '[': function() {
        console.log(self.letters)
        Meteor.call('conceptsearch', self.letters, self.language, self.ontology, self._max, function (err, res) {

          if(res) {

            var options = []

            if(typeof res === 'number') {
              options = {'.': res + ' > ' + self._max }
              self.wired('conceptSelect').setOptions(options, '.')
            }
            else {
              options = {'.': res.length}

              for(r of res)
                options[r.concept] = r.term

              self.wired('conceptSelect').setOptions(options, '.')
            }
          }
        })
      }
    }

    this.action('searchInput', {
      keyup: function(ev) {
        if(ev) {
          var selection =  window.getSelection()
          self.phrase = $(ev.currentTarget).text()
          var cursor = selection.anchorOffset

          var inwork = self.phrase.substring(0, cursor)
          
          var ind, index, ss = self.symbol, symbol
          for(s in ss) {
            index = inwork.lastIndexOf(s)

            if(index !== -1 && (!ind || index > ind)) {
              ind = index
              symbol = s
            }
          }

          if(ind || ind === 0) {
            self.letters = inwork.substring(ind+1)
            self._start = ind
            self._end = cursor

            console.log(self.letters)
            console.log(self._start)
            console.log(self._end)
            console.log(symbol)
            self.getSymbol(symbol)()
          }
        }
      }
    })

    this.action('conceptSelect', {
      change: function(value) {
        if(value) {
          self.addHidden(value)

          if(!self._start) {
            var selection =  window.getSelection()
            self._start = self._end = selection.anchorOffset
          }
          var tobereplaced = self.phrase.substring(self._start, self._end)

          if(value)
            Meteor.call('getConcept', value, self.language, function(err, res) {
              if(res) {
                if(tobereplaced !== '')
                  newphrase = self.phrase.replace(tobereplaced, res.term)
                else
                  newphrase = self.phrase.substring(0, self._start) + res.term + self.phrase.substring(self._start)

                self.phrase = newphrase
                $('#' + self.wired('searchInput').domid).text(newphrase)
                var cursor = self._start + res.term.length

                var range = document.createRange();
                var sel = window.getSelection();
                var el = $('#' + self.wired('searchInput').domid)[0]

                range.setStart(el.childNodes[0], cursor);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
                el.focus();

                self._end = null
                self._start = null
                self.letters = null


              }
            })
        }
      }
    })


    this.wire('searchInput', new MPlugin.Class.WiredDivEditable({key: 'searchInput'}).track(self, 'keyup', 'classic'))
    /*this.wired('searchInput').eventcallback = function(event, templ) {
      self.wired('searchInput')._shared[event.type].update(event)
    }*/
    //this.wired('searchInput').track(self, 'keyup')

    this.wire('conceptSelect', new MPlugin.Class.WiredSelect({key: 'conceptSelect'}).track(self, 'change'))

  }

  get symbol() {
    return this._symbol
  }

  set symbol(symbol) {
    this._symbol = symbol
  }

  setSymbol(key, func) {
    this._symbol[key] = func
  }

  getSymbol(key) {
    return this._symbol[key]
  }

  get phrase() {
    //return this._phrase.get()
    return this._phrase
  }

  set phrase(phrase) {
    //this._phrase.set(phrase)
    this._phrase = phrase
  }

  get letters() {
    return this._letters.get()
  }

  set letters(letters) {
    this._letters.set(letters)
  }
}


MPlugin.Class.ConceptTagging = class ConceptTagging extends ConceptWired {
  constructor({key, label, language, login, sharedType}) {
    super({key: key, label: label, language: language, login: login, sharedType: sharedType})
    this.concepted()

    var self = this
    this._ids = new ReactiveVar(['be679d26-7759-11e4-adb6-57ce06b062da', 'be6dc156-7759-11e4-adb6-57ce06b062da'])
    

    this.wire('tag', new MPlugin.Class.WiredTag({key: 'tag'}))

    Tracker.autorun(function() {
      var value = self.concept

      if(value) {
        self.addHidden(value)

        self.concept = null
        self.setId(value)
      }
    })

    Tracker.autorun(function() {
      var changed = self.ids && self.language

      if(changed)
        Meteor.call('getConcept', self.ids, self.language, function(err, res) {
          if(res) {
            var options = []

            for(r of res)
              options.push({value: r.concept, label: r.term})

            self.wired('tag').setOptions(options)
          }
          
        })

      
    })
  }

  get ids() {
    return this._ids.get()
  }

  set ids(ids) {
    this._ids.set(ids)
  }

  setId(id) {
    var ids = this.ids
    ids.push(id)
    this.ids = ids
  }

  removeId(id) {
    var ids = this.ids
    ids.splice(ids.indexOf(id))
    this.ids = ids
  }

  render(parentdomid) {
    super.render(parentdomid, 'tag')
    //this.wired('tag').parentdomid = parentdomid
    this.hidden = this.ids.join(',')
  }
}


MPlugin.Class.ConceptTags = class ConceptTags extends ConceptWired {
  constructor({key, label, language, ontology, concept, login, sharedType}) {
    super({key: key, label: label, language: language, ontology: ontology, login: login, sharedType: sharedType})

    this.concepted()
    var self = this
    
    this.action('tags', {
      change: function(value) {
        self.hidden = value
      }
    })

    this.wire('tags', new MPlugin.Class.WiredTags({key: 'tags'}).track(self, 'change'))

    Tracker.autorun(function() {
      var value = self.concept

      if(value)
        Tracker.nonreactive(function() {
          Meteor.call('getConcept', value, self.language, function(err, res) {
            if(res) {
              self.wired('tags').addTag({value: res.concept, label: res.term})
            }
          })
        })
    })
  }

  set tags(tags) {
    if(typeof tags[0] === 'string') {
      var self = this

      Meteor.call('getConcept', tags, self.language, function(err, res) {
        if(res) {
          var tags = []

          for(r of res)
            tags.push({value: r.concept, label: r.term})

          self.wired('tags').tags = tags
        }
      })
    }
    else
      this.wired('tags').tags = tags
  }
}


MPlugin.Class.AddConcept = class AddConcept extends ConceptWired {
  constructor({key, label, language, ontology, concept, login, sharedType}) {
    super({key: key, label: label, language: language, ontology: ontology, concept: concept, login: login, sharedType: sharedType})

    this.concepted()

    var self = this
    self._term = new ReactiveVar()

    this.action('input', {
      change: function(value) {
        if(value)
          self.term = value
      }
    })

    this.action('button', {
      click: function() {
        var changed = self.term && self.language && self.ontology && (self.concept || !self.concept)

        if(changed) {
          var doc = {
            term: self.term,
            language: self.language,
            ontology: self.ontology,
            parent: self.concept
          }
          Meteor.call('addConcept', doc, function(err, res) {
            if(!err)
              self.clearUI()
          })
        }
      }
    })

    this.wire('input', new MPlugin.Class.WiredInput({key: 'input', label: 'Enter Concept'}).track(self, 'change'))
    this.wire('button', new MPlugin.Class.WiredButton({key: 'button', label: '+'}).track(self, 'click'))
  }

  get term() {
    return this._term.get()
  }

  set term(term) {
    this._term.set(term)
  }

  clearUI() {
    this.hidden = ''
    this.wired('input').clearUI()
  }
}


MPlugin.Class.AddTranslation = class AddTranslation extends ConceptWired {
  constructor({key, label, language, ontology, concept, login, sharedType}) {
    super({key: key, label: label, language: language, ontology: ontology, concept: concept, login: login, sharedType: sharedType})

    this.concepted()
    var self = this

    self._term = new ReactiveVar()
    self._toLanguage = new ReactiveVar()

    this.action('input', {
      change: function(value) {
        if(value)
          self.term = value
      }
    })

    this.action('languageSelect2', {
      change: function(value) {
        if(value)
          self.toLanguage = value
      }
    })

    this.action('button', {
      click: function() {
        var changed = self.term && self.toLanguage && self.ontology && (self.concept || !self.concept)

        if(changed) {
          var doc = {
            term: self.term,
            language: self.toLanguage,
            ontology: self.ontology,
            concept: self.concept
          }

          Meteor.call('addConcept', doc, function(err, res) {
            if(!err)
              self.clearUI()
          })
        }
      }
    })
    
    this.wire('languageSelect2', new MPlugin.Class.WiredSelect({key: 'languageSelect2'}).track(self, 'change'))
    this.wire('input', new MPlugin.Class.WiredInput({key: 'input', label: 'Enter Translation'}).track(self, 'change'))
    this.wire('button', new MPlugin.Class.WiredButton({key: 'button', label: '+'}).track(self, 'click'))

    Meteor.call('getLanguages', function(err, langs) {
      if(langs) {

        self.wired('languageSelect2').setOptions(langs)
      }
    })
  }

  get term() {
    return this._term.get()
  }

  set term(term) {
    this._term.set(term)
  }

  get toLanguage() {
    return this._toLanguage.get()
  }

  set toLanguage(lang) {
    this._toLanguage.set(lang)
  }

  clearUI() {
    this.hidden = ''
    this.wired('input').clearUI()
  }
}


MPlugin.Class.TranslateConcept = class TranslateConcept extends ConceptWired {
  constructor({key, label, language, ontology, concept, login, sharedType}) {
    super({key: key, label: label, language: language, ontology: ontology, concept: concept, login: login, sharedType: sharedType})

    this.concepted()

    var self = this
    this._fieldvalue = 'term'
    this.language = 'en'
    this._toLanguage = new ReactiveVar()

    this.action('languageSelect2', {
      change: function(value) {
        if(value)
          self.toLanguage = value
      }
    })

    this.wire('languageSelect2', new MPlugin.Class.WiredSelect({key: 'languageSelect2'}).track(self, 'change'))
    this.wire('translation', new MPlugin.Class.WiredLabel({key: 'translation'}))

    Meteor.call('getLanguages', function(err, langs) {
      if(langs) {

        if(langs.indexOf('en')) {
          self.wired('languageSelect2').setOptions(langs, 'en')
          self.toLanguage = 'en'
        }
        else
          self.wired('languageSelect2').setOptions(langs)
      }
    })


    Tracker.autorun(function() {
      var changed = self.concept && self.toLanguage

      if(changed)
        Meteor.call('translateConcept', self.concept, self.language, self.toLanguage, function(err, res) {

          if(res) {
            self.wired('translation').label = res.term
            self.wired('translation').render(self.parentdomid)
          }
        })
    })
  }

  get toLanguage() {
    return this._toLanguage.get()
  }

  set toLanguage(lang) {
    this._toLanguage.set(lang)
  }
}


MPlugin.Class.SelectOntology = class SelectOntology extends ConceptWired {
  constructor({key, label, language, login, sharedType}) {
    super({key: key, label: label, language: language, login: login, sharedType: sharedType})
    this.ontologized()

    var self = this

    Tracker.autorun(function() {
      var ontology = self.ontology

      if(ontology)
        self.hidden = ontology
    })
  }
}

MPlugin.Class.WiredTableLabeled = class WiredTableLabeled extends MPlugin.Class.WiredTable {
  constructor({key, label, collection, query, options, language, login, sharedType}) {
    super({key: key, label: label, collection: collection, query: query, options: options, language: language, login: login, sharedType: sharedType})


  }

  parseSchema(schema) {
    var self = this

    var fields = Object.keys(schema)
    var newfields = []

    var headers = []
    for(f of fields) {
      headers.push(schema[f].label)
      if(f.indexOf('concept') !== -1 || schema[f].concepted)
        newfields.push({template: 'ConceptLabel', field: f, magicField: 'concept'})
      else
        newfields.push(f)
    }

    self.fields = newfields
    self.headers = headers
  }
}

MPlugin.Class.SvgDiv = class SvgDiv extends ConceptWired {
  constructor({key, label, language, ontology, concept, login, sharedType, hiddenValue, selectType, selectElement, defaultvalues, svgurl}) {
    super({key: key, label: label, language: language, ontology: ontology, login: login, sharedType: sharedType})

    this.languaged()

    var self = this

    self._svg = null
    self._svgname = new ReactiveVar(svgurl)
    self._defaultvalues = defaultvalues
    self._active = new ReactiveVar({})
    self._temp = null
    self._color = '#9A3D4F'
    self._mouseovercolor = '#57D9F0'
    self._hiddenValue = hiddenValue || 'id'
    self._selectType = selectType || 'single'
    self._selectElement = selectElement || 'path'
    self.panZoom = null

    Tracker.autorun(function() {
      var actives = self.active()
      var hidden = []

      for(a in actives)
        if(self._hiddenValue === 'id')
          hidden.push(a)
        else
          hidden.push(actives[a].concept)

      self.hidden = hidden.join(',')

      //falsely solves issue:
      if(self.wired('hiddenInput').shared.change)
        self.wired('hiddenInput').shared.change.data = hidden.join(',')

      if(self._selectElement == 'g' && hidden && hidden.length > 0)
        Meteor.call('getConcept', hidden, self.language, function(err, res) {
          if(res) {
            var terms = []
            for(r of res)
              terms.push(r.term)

            self.wired('hiddenlabel').label = "Selected: " + terms.join(', ')
            self.wired('hiddenlabel').render()
          }
        })
      else if(self.wired('hiddenlabel')){
        self.wired('hiddenlabel').label = ""
        self.wired('hiddenlabel').render()
      }
    })

    Tracker.autorun(function() {
      var url = self.svgname
      //console.log(url)
      if(url) {
        Tracker.nonreactive(function() {
          Meteor.call('getSVG', url, function(err, res) {
              if(res) {
                self.wired('svgContainer').content = res
                self.wired('svgContainer').render(function(blaze) {

                  //apply some css
                  var div = $(document.getElementById(self.wired('svgContainer').domid))
                  var size = {
                    w: 1200,
                    h: 800
                  }
                  div.css({ height: size.h+'px',
                    overflow: 'hidden',
                    width: size.w+'px',
                    float: 'left',
                    'margin-bottom': '20px',
                    'border': '#ccc',
                    'border-width': '1px',
                    'border-style': 'dashed',
                    'background-color': 'lightgrey'
                  })

                  $(document.getElementById(self.wired('svgContainer').parentdomid)).css('height', size.h + 'px')

                  var svg = div.children().first()
                  var svgid = svg.attr('id') + '_' + Random.id()
                  svg.attr('id', svgid)
                  self.svg = svg
                  self.svg.css('width', size.w)

                  self.panZoom = svgPanZoom(svg[0], {
                    zoomScaleSensitivity: 0.1,
                    minZoom: 0.05,
                    dblClickZoomEnabled: false,
                    fit: false,
                    contain: false
                  })
                  self.panZoom.enablePan()
                  self.panZoom.enableZoom()
                  //self.panZoom.fit()

                  //set viewport
                  var scale = {
                    x: size.w / parseInt(self.svg.attr('width'),10),
                    y: size.h / parseInt(self.svg.attr('height'),10)
                  }

                  //console.log(scale)
                  var sscale = Math.min(scale.x, scale.y)
                  var matrix = 'matrix(' + sscale + ',0,0,' + sscale + ',0,0' + ')'
                  //console.log(matrix)
                  self.svg.find('.svg-pan-zoom_viewport').attr('transform', matrix)
                  //console.log(self.svg.find('.svg-pan-zoom_viewport'))
                  //console.log(self.svg.find('.svg-pan-zoom_viewport'))



                  self.setNoOfConcepts()

                  self.svg.find('path').each(function(){
                    $(this).on('click', self.actioned('svgContainer', 'click path'))
                  })
                  
                  self.svg.on('mouseenter', 'path', self.actioned('svgContainer', 'mouseenter path'))
                  self.svg.on('mouseleave', 'path', self.actioned('svgContainer', 'mouseleave path'))

                  if(self.wired('selectSvg') && url !== $('#' + self.wired('selectSvg').domid).val())
                    $('#' + self.wired('selectSvg').domid).val(url)

                  if(self.hidden) {
                    self._defaultvalues = self.hidden.split(',')
                    self.hidden = ''
                    self.actives = {}
                  }


                  var defaultvals = self._defaultvalues
                  if(defaultvals) {
                    for(c of self._defaultvalues) {
                      var target = self.svg.find('[data-concept="' + c + '"]')[0]
                      if(target) {
                        target = $(target)

                        self.add(target.attr('id'), target)
                      }
                    }
                  }

                  

                })
                //self.svgname = value
              }
            })
          })
      }
    })


    this.action('selectSvg', {
        change: function(value) {
          if(value) 
            self.svgname = value
        }
    })

    this.action('toGroup', {
      click: function() {
        var keys = Object.keys(self.active())
        var active = keys[keys.length-1]

        if(active) {
          self.selectParent(active)
        }
      }
    })

    this.action('svgContainer', {
      'mouseenter path': function(ev, templ) {
        if(ev) {
          var target = $(ev.currentTarget).parent()
          var concept = target.attr('data-concept')
          if(concept) {
            Meteor.call('getConcept', concept, self.language, function(err, res) {
              if(res) {
                self.wired('label').label = res.term || (res[0] ? res[0].term : '')
                self.wired('label').render()
              }
            })

            self._temp = {
              id: target.attr('id'), 
              elem: target, 
              opacity: target.css('opacity'), 
              children: [] 
            }

            /*target.children().each(function() {
              self._temp.children.push({
                elem: $(this),
                color: $(this).css('fill')
              })
              $(this).css('fill', self._mouseovercolor)
            })*/

            target.css('opacity', 0.4)

          }
        }
      },
      'mouseleave path': function(ev, templ) {
        if(ev) {
          var target = $(ev.currentTarget).parent()

          if(self._temp) {

            self._temp.elem.css('opacity', self._temp.opacity)

            /*for(k of self._temp.children)
              k.elem.css('fill', k.color)*/

            self_temp = null
          }
        }
      },
      'click path': function(ev, templ) {
        if(ev) {
          ev.preventDefault()
          ev.stopPropagation()
          var target

          if(self._selectElement == 'path' && !self.active($(ev.currentTarget).parent().attr('id')))
            target = $(ev.currentTarget)
          else
            target = $(ev.currentTarget).parent()

          var id = target.attr('id')
          
          if(self._selectType == 'single')
            if(self.active(id))
              self.del(id)
            else {
              self.clear()
              self.add(id, target)
            }
          else
            if(self.active(id))
              self.del(id)
            else
              self.add(id, target)

        }
      }
    })
    
    this.wire('hiddenlabel', new MPlugin.Class.WiredLabel({key: 'hiddenlabel'}))
    if(!svgurl)
      this.wire('selectSvg', new MPlugin.Class.WiredSelect({key: 'selectSvg', label:'Select SVG', active: self.svgname}).track(self, 'change'))
    this.wire('toGroup', new MPlugin.Class.WiredButton({key: 'toGroup', label: 'up'}).track(self, 'click'))
    this.wire('noOfCon', new MPlugin.Class.WiredLabel({key: 'noOfCon'}))
    this.wire('label', new MPlugin.Class.WiredLabel({key: 'label'}))
    this.wire('svgContainer', new MPlugin.Class.WiredDiv({key: 'svgContainer'}))//.track(self, ['mouseenter path', 'mouseleave path', 'click path']))
    
    if(!svgurl)
      self.getSVGs()

  }

  get svg() {
    return this._svg
  }

  set svg(svg) {
    this._svg = svg
  }

  get actives() {
    return this._active.get()
  }

  set actives(actives) {
    this._active.set(actives)
  }

  active(key) {
    if(!key)
      return this.actives

    return this.actives[key]
  }

  addActive(key, target, extra) {
    var value = extra || {}

    value.color = target.css('fill')
    value.opacity = target.css('opacity')
    value.concept = target.attr("data-concept")
    value.elem = target

    var active = this.actives
    active[key] = value
    this.actives = active
  }

  delActive(key) {
    var actives = this.actives
    delete actives[key]
    this.actives = actives
  }

  add(key, target, extra) {
    if(target.is('g'))
      this.selectParent(target)
    else {
      this.addActive(key, target, extra)
      target.css('fill', this._color)
    }
  }

  del(key) {
    var active = this.active(key)

    if(active.elem.is('g'))
      this.deleteParent(active.elem)
    else {
      active.elem.css('fill', active.color)
      this.delActive(key)
    }
  }

  clear() {
    var actives = this.actives
    for(a in actives)
      this.del(a)
    this.hidden = ''
  }

  get svgname() {
    return this._svgname.get()
  }

  set svgname(svgname) {
    this._svgname.set(svgname)
  }

  getSVGs(active) {
    var self = this
    Meteor.call('getSVGs', function(err, res) {
      if(res)
        self.wired('selectSvg').setOptions(res, active)
    })
  }

  selectParent(id) {
    var self = this
    var p

    if(typeof id === 'string')
      p = self.active(id).elem.parent()
    else
      p = id

    //iterate through kids
    //if in actives, then copy color data and delete from actives
    //if not, add colors in group and color to selection color

    var children = {}

    p.find('path').each(function() {
      var id = $(this).attr('id')

      if(self.active(id)) {
        children[id] = self.active(id)
        self.delActive(id)
      }
      else {
        children[id] = {
          color: $(this).css('fill'),
          concept: $(this).attr("data-concept"),
          elem: $(this)
        }
        $(this).css('fill', self._color)
      }
    })
  
    self.addActive(p.attr('id'), p, {children: children})
  }

  deleteParent(id) {
    var self = this
    var p, active

    if(typeof id === 'string')
      p = self.active(id).elem.parent()
    else
      p = id

    id = p.attr('id')

    kids = self.active(id).children

    //iterate through kids and restore fill
    for(k in kids) {
      kids[k].elem.css('fill', kids[k].color)
    }

    self.delActive(id)
  }

  setNoOfConcepts() {
    this.wired('noOfCon').label = this.svg.find('[data-concept]').length + ' Concepts'
    this.wired('noOfCon').render()
  }

  getConcepts() {
    var concepts = []

    this.svg.find('[data-concept]').each(function() {
      concepts.push($(this).attr('data-concept'))
    })

    return concepts
  }

}


MPlugin.Class.AnnotateSvg = class AnnotateSvg extends ConceptWired {
  constructor({key, label, language, ontology, concept, login, sharedType, svgurl}) {
    super({key: key, label: label, language: language, ontology: ontology, login: login, sharedType: sharedType, hidden: false})

    this.concepted()
    var self = this
    self._ids = new ReactiveVar([])

    this.action('annotate', {
      click: function() {
        if(self.ids.length > 0 && self.concept)
          self.annotate()
      }
    })
    this.action('saveSvg', {
      click: function() {
        if(self.wired('svgDivAno') && self.wired('svgDivAno').svg) {
          var source = self.wired('svgDivAno').svg[0].outerHTML
          Meteor.call('saveSvg', self.wired('svgDivAno').svgname, source, function() {
            self.wired('svgDivAno').getSVGs()
          })
        }
      }
    })

    this.action('svgDivAno', {
      change: function(value) {
        if(value)
          self.ids = value.split(',')
      }
    })

    this.wire('annotate', new MPlugin.Class.WiredButton({key: 'annotate', label: 'annotate'}).track(self, 'click'))
    this.wire('saveSvg', new MPlugin.Class.WiredButton({key: 'saveSvg', label: 'save'}).track(self, 'click'))
    //this.wire('label', new MPlugin.Class.WiredLabel({key: 'label', label: 'Concept Annotation'}))
    this.wire('svgDivAno', new MPlugin.Class.SvgDiv({
      key: 'svgDivAno', 
      selectType: 'multiple', 
      language: self.language,
      svgurl: svgurl
    }).track(self, 'change'))

  }

  get ids() {
    return this._ids.get()
  }

  set ids(ids) {
    this._ids.set(ids)
  }

  annotate() {
    var self = this
    var keys = self.ids
    var actives = self.wired('svgDivAno').active()
    var p, elem

    if(keys.length > 1 || !(actives[keys[0]].elem.is('g'))) {

      var active = keys[keys.length-1]
      var a = actives[active].elem

      p = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      p.setAttribute('id', Random.id())
      $(p).insertBefore(a)
      p = $(p)

      for(a in actives) {
        elem = actives[a].elem
        elem.css('fill', actives[a].color)
        
        if(actives[a].children)
          elem.find('*').each(function() {
            var el = actives[a].children[$(this).attr('id')]
            if(el) {
              el.elem.css('fill', el.color)
            }
              //$(this).css('fill', actives[a].children[$(this).attr('id')].color)
          })

        p.append(elem)
        self.wired('svgDivAno').del(a)
      }
    }
    else {
      p = actives[keys[0]].elem
      var a = actives[keys[0]].children

      p.find('*').each(function() {
        var id = $(this).attr('id')
        a[id].elem.css('fill', a[id].color)
        //$(this).css('fill', a[id].color)
      })

      self.wired('svgDivAno').del(keys[0])
    }

    p[0].setAttribute('data-concept', self.concept)
    p.css('opacity', 0.8)

    self.wired('svgDivAno').setNoOfConcepts()
  }
}


MPlugin.Class.SvgConcept = class SvgConcept extends ConceptWired {
  constructor({key, label, type, statictype, language, ontology, concept, login, sharedType, svgurl}) {
    super({key: key, label: label, language: language, ontology: ontology, login: login, sharedType: sharedType})

    var self = this
    self._type = new ReactiveVar(type || 'single')
    self._statictype = statictype

    Tracker.autorun(function() {
      var type = self.type

      Tracker.nonreactive(function() {
        self.hidden = ''

        if(self.wired('svgDiv')) {
          self.wired('svgDiv').clear()
          self.wired('svgDiv')._selectType = type
        }
      })
    })

    this.action('selectType', {
      change: function(value) {
        if(value)
          self.type = value
      }
    })
    this.action('svgDiv', {
      change: function(value) {
        //if(value)
          self.hidden = value

          //falsely solves issue:
          if(self.wired('hiddenInput').shared.change)
            self.wired('hiddenInput').shared.change.data = value
      }
    })

    if(!self._statictype)
      this.wire('selectType', new MPlugin.Class.WiredSelect({key: 'selectType', label: 'type', options: ['single', 'multiple'], active: self.type}).track(self, 'change'))

    this.wire('svgDiv', new MPlugin.Class.SvgDiv({
      key: 'svgDiv', 
      hiddenValue: 'concept',
      selectElement: 'g',
      selectType: self.type,
      language: self.language,
      svgurl: svgurl
    }))

    this.wired('svgDiv').track(self, 'change')

    /*Tracker.autorun(function() {
      var svgdiv = self.wired('svgDiv').hidden

      console.log(svgdiv)
    })*/

  }

  get type() {
    return this._type.get()
  }

  set type(type) {
    this._type.set(type)
  }

  ini(concepts, url) {
    var self = this

    self.wired('svgDiv').hidden = concepts
    self.wired('svgDiv').svgname = url
    //self.wired('svgDiv')._defaultvalues = concepts

  }

  clear() {
    this.wired('svgDiv').clear()
  }
}

MPlugin.Class.SvgChloropleth = class SvgChloropleth extends ConceptWired {
  constructor({key, label, language, ontology, concept, login, sharedType, svgurl}) {
    super({key: key, label: label, language: language, ontology: ontology, login: login, sharedType: sharedType, svgurl: svgurl})

    var self = this
    self._collection = new ReactiveVar()
    self._field = new ReactiveVar()
    self._selected = new ReactiveVar([])
    self._chloroType = new ReactiveVar('single hue')
    //self._color = new ReactiveVar([154,61,79])
    self._color = new ReactiveVar([255,206,123])
    //self._color = new ReactiveVar([96,103,105])
    self._map = []
    self.concepts = null

    Tracker.autorun(function() {
      var changed = self.collection && self.field && self.selected
      if(changed)
        Tracker.nonreactive(function() {

          self.wired('table').collection = self.collection
          var value = self.selected
          var query = {}

          if(value && value.length > 0) {
            query[self.field] = {$in: value}
          }
          self.wired('table').query = query
        })
    })

    this.action('collection', {
      change: function(value) {
        self.collection = value

        if(value && self.wired('field'))
          self.wired('field').collection = value
      }
    })
    this.action('field', {
      change: function(value) {
        self.field = value  
      }
    })
    this.action('chloroType', {
      change: function(value) {
        if(value)
          self.chloroType = value
      }
    })
    this.action('create', {
      click: function() {
        if(self.collection && self.field && self.chloroType && self.wired('svgDiv').svgname) {

          self.concepts = self.wired('svgDiv').getConcepts()

          Meteor.call('conceptCount', self.collection, self.field, self.concepts, function(err, res) {
            if(res)
              self.cloropleth(res)
          })

        }
      }
    })
    this.action('records', {
      click: function() {
        if(self.wired('table') && self.collection) {
          self.wired('table').collection = self.collection

          var value = self.wired('svgDiv').hidden
          var query = {}

          if(value) {
            value = value.split(',')
            query[self.field] = {$in: value}
          }
          self.wired('table').query = query

        }
      }
    })
    this.action('svgDiv', {
      change: function(value) {
        if(value)
          self.hidden = value

        if(!value)
          self.selected = []
        else
          self.selected = value.split(',')
      }
    })

    this.wire('create', new MPlugin.Class.WiredButton({
      key: 'create',
      label: 'go'
    }).track(self, 'click'))

    /*this.wire('records', new MPlugin.Class.WiredButton({
      key: 'records',
      label: 'records'
    }).track(self, 'click'))*/

    this.wire('collection', new MPlugin.Class.WiredCollection({
      key: 'collection',
      label: 'Collection',
      type: 'server'
    }).track(self, 'change'))

    self.wire('field', new MPlugin.Class.WiredField({
      key: 'field',
      label: 'Field'
    }).track(self, 'change'))

    this.wire('chloroType', new MPlugin.Class.WiredSelect({
      key: 'chloroType', 
      label: 'Chloropleth Type',
      active: self.chloroType,
      options: ['single hue', 'bipolar color', 'blended hue', 'partial spectral', 'full spectral', 'value']
    }).track(self, 'change'))

    this.wire('svgDiv', new MPlugin.Class.SvgDiv({
      key: 'svgDiv', 
      hiddenValue: 'concept',
      selectElement: 'g',
      selectType: 'multiple',
      language: self.language,
      svgurl: svgurl
    }).track(self, 'change'))

    this.wire('table', new MPlugin.Class.WiredTabular({
      key: 'table', 
      tableClass: MPlugin.Class.WiredTableLabeled
    }))

  }

  get collection() {
    return this._collection.get()
  }

  set collection(collection) {
    this._collection.set(collection)
  }

  get field() {
    return this._field.get()
  }

  set field(field) {
    this._field.set(field)
  }

  get selected() {
    return this._selected.get()
  }

  set selected(selected) {
    this._selected.set(selected)
  }

  get chloroType() {
    return this._chloroType.get()
  }

  set chloroType(chloroType) {
    this._chloroType.set(chloroType)
  }

  get color() {
    return this._color.get()
  }

  set color(color) {
    if(color.indexOf('#'))
      color = convertHex(color)
    
    this._color.set(color)
  }

  get map() {
    return this._map
  }

  set map(map) {
    this._map = map
  }

  get concepts() {
    return this._concepts
  }

  set concepts(concepts) {
    this._concepts = concepts
  }

  singlehue(no, minno, maxno) {

    if(minno === maxno)
      return null

    var hue = this.color,
      min = {},
      max = {},
      r,g,b

    var minrgb = Math.min(...hue),
      maxrgb = Math.max(...hue)

    min.r = hue[0] - minrgb
    min.g = hue[1] - minrgb
    min.b = hue[2] - minrgb

    if(no == 0)
      return 'rgb(255,255,255)'

    if(no == min)
      return 'rgb('+min.r+','+min.g+','+min.b+')'

    max.r = 255 - maxrgb + hue[0]
    max.g = 255 - maxrgb + hue[1]
    max.b = 255 - maxrgb + hue[2]

    if(no == max)
      return 'rgb('+max.r+','+max.g+','+max.b+')'

    //r = Math.ceil((max.r - min.r) * (no - minno) / (maxno - minno) + min.r)
    //g = Math.ceil((max.g - min.g) * (no - minno) / (maxno - minno) + min.g)
    //b = Math.ceil((max.b - min.b) * (no - minno) / (maxno - minno) + min.b)

    r = Math.ceil((max.r - min.r) * (maxno - no) / (maxno - minno) + min.r)
    g = Math.ceil((max.g - min.g) * (maxno - no) / (maxno - minno) + min.g)
    b = Math.ceil((max.b - min.b) * (maxno - no) / (maxno - minno) + min.b)

    return 'rgb('+r+','+g+','+b+')'
  }

  colorize(type, no, min, max) {
    if(type === 'single hue')
      return this.singlehue(no, min, max)

    var c = this.color
    return 'rgb(' + c[0] + c[1] + c[2] + ')'
  }

  clear() {
    var map = this.map

    for(c of map)
      for(g of c.elems)
        for(k of g.children)
          k.elem.css('fill', k.owncolor)

    this.map = []
  }

  cloropleth(res) {
    this.clear()

    var map = []

    for(r of res) {
      var obj = r

      //assign a color
      obj.color = this.colorize(this.chloroType, r.count, res[0].count, res[res.length-1].count)
      //console.log(obj.color)
      //memorize element colors before and assign the new one
      obj.elems = []

      this.wired('svgDiv').svg.find('[data-concept=' + r.concept + ']').each(function() {

        var g = {
          elem: $(this),
          children: []
        }

        //always a group
        $(this).children().each(function() {
          g.children.push({
            elem: $(this),
            owncolor: $(this).css('fill')
          })

          if(obj.color)
            $(this).css('fill', obj.color)
        })

        obj.elems.push(g)
      })

      map.push(obj)
    }

    this.map = map
  }
}





//auguments
MPlugin.augument(MPlugin.Class.SelectLanguage, MPlugin.Class.Languaged)
MPlugin.augument(MPlugin.Class.ConceptSearch, MPlugin.Class.Concepted)
MPlugin.augument(MPlugin.Class.ConceptLabel, MPlugin.Class.Labeled)
MPlugin.augument(MPlugin.Class.ConceptSelectKids, MPlugin.Class.Concepted)
MPlugin.augument(MPlugin.Class.ConceptSelectAll, MPlugin.Class.Concepted)
MPlugin.augument(MPlugin.Class.ConceptSearchPhrase, MPlugin.Class.Languaged)
MPlugin.augument(MPlugin.Class.ConceptTagging, MPlugin.Class.Concepted)
MPlugin.augument(MPlugin.Class.ConceptTags, MPlugin.Class.Concepted)
MPlugin.augument(MPlugin.Class.AddConcept, MPlugin.Class.Concepted)
MPlugin.augument(MPlugin.Class.AddTranslation, MPlugin.Class.Concepted)
MPlugin.augument(MPlugin.Class.TranslateConcept, MPlugin.Class.Concepted)
MPlugin.augument(MPlugin.Class.SelectOntology, MPlugin.Class.Ontologized)
MPlugin.augument(MPlugin.Class.SvgDiv, MPlugin.Class.Languaged)
MPlugin.augument(MPlugin.Class.AnnotateSvg, MPlugin.Class.Concepted)


function convertHex(hex){
  hex = hex.replace('#','');
  r = parseInt(hex.substring(0,2), 16);
  g = parseInt(hex.substring(2,4), 16);
  b = parseInt(hex.substring(4,6), 16);

  //result = 'rgb('+r+','+g+','+b+')';
  return [r,g,b]
}
