Template.raw.onCreated(function() {
	this.subscribe('doc', FlowRouter.getParam('id'))
})

Template.raw.helpers({
	text: function() {
		var doc = D.p.Docs.findOne({_id: FlowRouter.getParam('id')})
		console.log(doc)
		if(doc)
			return doc.data.snapshot
	}
})