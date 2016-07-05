D.p.Documents = new Mongo.Collection("documents");
D.p.Docs = new Mongo.Collection('docs')

_Schemas.documentsSchema = new SimpleSchema({
  title: {
    type: String
  },
  parentId: {
  	type: String,
  	optional: true
  },
  projectIds: {
  	type: [String],
  	optional: true
  }
});

D.p.Documents.attachSchema(_Schemas.documentsSchema);
