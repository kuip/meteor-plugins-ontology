viewHidden = function() {
  if($('#viewHidden').data('view') === 0) {
    $('.WiredInputhidden').attr('type', 'text')
    $('#viewHidden').data('view', 1)
  }
  else {
    $('.WiredInputhidden').attr('type', 'hidden')
    $('#viewHidden').data('view', 0)
  }
}

Meteor.subscribe('Ontologies')

Meteor.startup(function() {


var onto = new Onto.Ontology()
onto.ini('selectLanguage', {system: true, events: false})
onto.render('systemLanguage')
})