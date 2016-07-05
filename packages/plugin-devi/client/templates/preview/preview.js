Template.preview.onCreated(function() {
	this.subscribe('doc', FlowRouter.getParam('id'))
	umls = [];
  seqs=[];
  toc = [];
  this.autorun(function() {
  	Session.set('document', FlowRouter.getParam('id'))
  });
  
})

Template.preview.onRendered(function() {
	document.getElementById("prev").style.top="0px"
  document.getElementById("prev").style.height="100%"

  this.autorun(function() {
  	var doc = D.p.Docs.findOne({_id: Session.get('document')})
  	if(doc) {
  		document.getElementById("prev").innerHTML =marked(doc.data.snapshot);
  	}
  }) 
})