Meteor.methods ({
	insertDocument: function(doc) {
		check(doc, Object)

		doc.userId = this.userId
		D.p.Documents.insert(doc, function(err, id) {
        if(err)
        	return err
        else
        	return (null,id);
		})
	},
	updateDocument: function(id, upd) {
		console.log(id)
		console.log(upd)

		check(id, String)
		check(upd, Object)

		var query = {
			_id: id,
			userId: {$in: [this.userId, null]}
		}
		console.log(query)
		console.log(upd)
		D.p.Documents.update(query, {$set: upd}, function(err, id) {
        if(err)
        	return err
        else
        	return (null,id);
		})
	},
	deleteDocument: function(id) {
    D.p.Documents.remove(id);
    if (!this.isSimulation) {
      return ShareJS.model["delete"](id);
    }
  }
})