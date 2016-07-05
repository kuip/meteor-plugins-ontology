Ontology = {}
OntoUtils = {}

OntoUtils.brothers = function (concepts, relations, id, lang) {
  console.log('brothers')
  var rel = relations.findOne({concept1: id})
  console.log(rel)
  var rels = relations.find({concept2: rel.concept2}).map(function(r) {
    return r.concept1
  })
  console.log(rels)
  return concepts.find({concept: {$in: rels}, language: lang}).fetch()
}

OntoUtils.children = function (concepts, relations, id, lang) {
  console.log(id)
  console.log(relations.find({concept2: id}).fetch())
  var rels = relations.find({concept2: id}).map(function(r) {
    return r.concept1
  })
  console.log(rels)
  return concepts.find({concept: {$in: rels}, language: lang}).fetch()
}



OntoUtils.path = function(concepts, relations, concept, lang, origin, returnIds){
  returnIds = (typeof returnIds === "undefined") ? false : returnIds;
  var path = [];
  
  if(concept !== origin){
    path.push(concept)
    var id = concept
console.log(id)
console.log(origin)

    while(id !== origin){
      var c = relations.findOne({concept1:id})
      console.log(c)
      if(c) {
        id = c.concept2
        path.push(id);
      }
      else
        break
      
    }
console.log(path)
    if(returnIds === false){
      path = concepts.find({concept: {$in: path}, language:lang}).fetch()
      /*var path_sub = [];
      for(i =0; i < path.length; i++){
        path_sub.push(concepts.findOne({concept:path[i], language:lang}));
        console.log(path_sub)
      }
      path = path_sub;*/
    }
  }
  return path;
}


OntoUtils.tree = function(id, lang, data, callback){
  for(var kid = 0; kid <  data.children.length; kid++){
    if(data.children[kid].haschildren[0] > 0){    
      data.children[kid] = callback(data.children[kid]["concept"], lang)[0];
      data.children[kid] = tree_recursive(data.children[kid]["concept"], lang, data.children[kid], callback);
    }
  }
  return data;
}

OntoUtils.tree_flat_recursive = function(id, lang, data, ord){
  var kids = data[data.length-1].children;
  for(var kid =0; kid < kids.length; kid++){
    data.push(subject(kids[kid]["concept"], lang)[0]);
    data[data.length-1].order = ord + 1;
    data[data.length-1].title = data[data.length-1].name[0];
    if(kids[kid].haschildren[0] > 0){
      data = tree_flat_recursive(kids[kid]["concept"], lang, data, data[data.length-1].order);
    }
  }
  return data;
}



OntoUtils.subject = function(id, lang){
  var subject = Subject.findOne({concept: id, lang: lang});
  subject._id = subject._id._str;
  var relations = idsToString(Relation.find({concept2: id}));
  if(relations.length == 0){
    var kids = false;
  }
  else{
    kids = [];
    for(var i = 0; i < relations.length; i++){
      if(relations[i].concept1 != "NULL"){
        var kid = Subject.findOne({concept: relations[i]["concept1"], lang: lang});
        if(kid != undefined){
          kid._id = kid._id._str;
          subkids = Relation.find({concept2: kid["concept"]}).fetch().length;
          kids.push(kid);
          kids[kids.length-1].name = [kid["subject"]];
          kids[kids.length-1].haschildren = [subkids];
        }
      }
    }
  }
  var sub = subject;
  //delete sub.id;
  sub.name = [subject["subject"]];
  sub.haschildren = [relations.length];
  sub.children = kids;
  sub = [sub];
  return sub;
}

OntoUtils.ontology = function(id, lang){
  var onto = Ontologies.findOne({concept: id, lang: lang});
  onto._id = onto._id._str;
  id = onto.uuid_onto;
  var relations = idsToString(Relation.find({concept2: id}));
  if(relations.length == 0){
    kids = false;
  }
  else{
    kids = [];
    for(var i=0; i < relations.length; i++){
      var kid = Ontologies.findOne({uuid_onto: relations[i]["concept1"], lang: lang});
      if(kid != undefined){
        kid._id = kid._id._str;
        subkids = Relation.find({concept2: kid["uuid_onto"]}).fetch().length;
        kids.push(kid);
        kids[kids.length-1].name = [kid["description"]];
        kids[kids.length-1].haschildren = [subkids];
      }
    }
  }
  var sub = onto;
  sub.name = [onto.description];
  sub.haschildren = [relations.length];
  sub.children = kids;
  sub = [sub];
  return sub;
}