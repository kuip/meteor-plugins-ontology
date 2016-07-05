Template.Diagram.onCreated(function() {
  this.component = new Diagram()
  this.component.ini('OntoDiagram')
})

Template.Diagram.onRendered(function() {
  this.component.render('diagramsdiv')

  $('#' + this.component.wired('OntoDiagram').wired('searchPhrase').wired('searchInput').domid).text("Something [deltoid ")
})

Template.WiredDiagram.onCreated(function() {
  umls = [];
  seqs=[];
  toc = [];
})

Template.WiredDiagram.onRendered(function() {
  document.getElementById("diagramprev").style.top="0px"
  document.getElementById("diagramprev").style.height="100%"

  document.getElementById("diagramprev").innerHTML = marked('# Development Algorithm\n\n\n```uml\n\n[General Algorithm |\n[<start>start]->[Specifications Dev]\n[Specifications Dev]->[<choice>Agreement on Specs?]\n[Agreement on Specs?]->0[Specifications Dev]\n[Agreement on Specs?]->1[<choice>Agreement on Price?]\n[Agreement on Price?]->0[<end>stop]\n[Agreement on Price?]->1[Prototype Dev]\n[Prototype Dev]->[<choice>Agreement on Intention?]\n[Agreement on Intention?]->0[Prototype Dev]\n[Agreement on Intention?]->1[Implementation Dev]\n[Implementation Dev]->[<state>X]\n[X]->[Testing as Deployed]\n[Testing as Deployed]->[<choice>Agreement on Finality?]\n[Agreement on Finality?]->0[Implementation Dev]\n[Agreement on Finality?]->1[Final Transaction]\n[Final Transaction]->[Harvest Recyclables]\n[Harvest Recyclables]->[stop]\n\n\n]\n\n```');

})