Meteor.publish('publicDocuments', function() {
	return D.p.Documents.find({})
});

Meteor.publish('userDocuments', function() {
	return D.p.Documents.find({userId: this.userId})
});

Meteor.publish('doc', function(id) {
	return [D.p.Documents.find({_id:id}), D.p.Docs.find({_id:id})]
});

Meteor.publishComposite('userProjects', {
	find: function() {
		return D.p.RoleMap.find({userId: this.userId})
	},
	children: [
		{
			find: function(map) {
				return D.p.Projects.find({_id: map.projectId})
			}
		}
	]
})