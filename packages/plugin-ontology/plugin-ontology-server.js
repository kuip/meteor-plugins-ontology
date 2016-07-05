FS = Npm.require('fs')
//SVGPath = process.env.PWD + '/private/svg/'
SVGPath = process.env.PWD + '/.meteor/svg/'

Meteor.publish('Ontologies', function(query, options) {

  if(!query)
    query = {}

  return MPlugin.Plugins['loredanacirstea:plugin-ontology'].Collection['pluginontology']._collection.find(query)
})

Meteor.publish('Ontology', function(id) {

  return MPlugin.Plugins['loredanacirstea:plugin-ontology'].Collection['pluginontology']._collection.find({_id: id})
})

Meteor.publish('Concepts', function(query, options) {

    if(!query)
    query = {}

  var cursor = MPlugin.Plugins['loredanacirstea:plugin-ontology'].Collection['pluginconcept']._collection.find(query)

  return cursor

})

Meteor.publish('Concept', function(id) {

  var items =  MPlugin.Plugins['loredanacirstea:plugin-ontology'].Collection['pluginconcept']._collection.find({concept: id})

  return items
})

Meteor.publish('Relations', function(query, options) {

  if(!query)
    query = {}

  return MPlugin.Plugins['loredanacirstea:plugin-ontology'].Collection['pluginrelation']._collection.find(query)

})


Meteor.publish('Relation', function(id) {

  if(!query)
    query = {}

  return MPlugin.Plugins['loredanacirstea:plugin-ontology'].Collection['pluginrelation']._collection.find({_id: id})

})


Meteor.methods({
  'conceptsearch': function(string, language, ontology, max) {
    var query = {term: {$regex: string, $options: 'ig'}, language: language}
    if(ontology)
      query.ontology = ontology

    var cursor =  MPlugin.Plugins['loredanacirstea:plugin-ontology'].Collection['pluginconcept']._collection.find(query)

    if(max) {
      var count = cursor.count()

      if(count > max)
        return count
    }

    return cursor.fetch()
  },
  conceptscompute: function(type, concept, lang) {
    return OntoUtils[type] (MPlugin.Plugins['loredanacirstea:plugin-ontology'].Collection['pluginconcept']._collection, MPlugin.Plugins['loredanacirstea:plugin-ontology'].Collection['pluginrelation']._collection, concept, lang)
  },
  getConcept: function(concept, language) {
    conceptColl = MPlugin.Plugins['loredanacirstea:plugin-ontology'].Collection['pluginconcept']._collection

    var single = true

    if(typeof concept === 'string')
      var query = {concept: concept}
    else if(concept instanceof Array) {
      var query = {concept: {$in: concept}}
      single = false
    }

    if(language)
      query.language = language
    else
      single = false
      
    if(single)
      return conceptColl.findOne(query)

    return conceptColl.find(query).fetch()
  },
  getLanguages: function() {
    var ontos = MPlugin.Plugins['loredanacirstea:plugin-ontology'].Collection['pluginontology']._collection.find().fetch()

    var langs = []
    for(o in ontos) {
      if(langs.indexOf(ontos[o].language) === -1)
        langs.push(ontos[o].language)
    }

    return langs
  },
  getOntologies: function(language) {
    return MPlugin.Plugins['loredanacirstea:plugin-ontology'].Collection['pluginontology']._collection.find({language: language}).fetch()
  },
  addConcept: function(obj) {
    var conceptColl = MPlugin.Plugins['loredanacirstea:plugin-ontology'].Collection['pluginconcept']._collection
    var relColl = MPlugin.Plugins['loredanacirstea:plugin-ontology'].Collection['pluginrelation']._collection
    
    console.log(obj)

    if(!obj.concept)
      obj.concept = Random.id()

    if(obj.parent) {
      relColl.insert({
        concept1: obj.concept,
        concept2: obj.parent,
        relation: 1,
        ordering: 0,
        updatedAt: new Date()
      })

      delete obj.parent
    }
    console.log(obj)
    conceptColl.insert(obj)
  },
  translateConcept: function(term, language1, language2) {
    var conceptColl = MPlugin.Plugins['loredanacirstea:plugin-ontology'].Collection['pluginconcept']._collection

    var c = conceptColl.findOne({term: term, language: language1})

    if(c)
      return conceptColl.findOne({concept: c.concept, language: language2})

    return null
  },
  getSVGs: function() {
    var svgs = FS.readdirSync(SVGPath)
    var f = []
    for(t of svgs)
      if(t.indexOf('.svg') !== -1)
        f.push(t)
    return f
  },
  getSVG: function(filename) {
    var path = SVGPath + filename
    var text = FS.readFileSync(path, 'utf8')
    return text
  },
  saveSvg: function(filename, source, callb) {
    var date = new Date()
    var ext = filename.lastIndexOf('.')
    var name = filename.substring(0, ext)

    var ind = name.lastIndexOf('__')

    if(ind !== -1)
      name = name.substring(0, ind)

    name += '__' + Random.id() + filename.substring(ext)

    if(callb)
      FS.appendFile(SVGPath + name, source, 'utf8', callb)
    else
      FS.appendFileSync(SVGPath + name, source, 'utf8')
  },
  conceptCount: function(collectionName, field, concepts) {
    var Col = MPlugin.getCollection(collectionName)
    var map = [], q

    for(c of concepts) {
      q = {}
      q[field] = c
      map.push({
        concept: c,
        count: Col.find(q).count()
      })
    }

    map.sort(function(a,b) {
      return a.count - b.count
    })

    return map
  }
})

readCsvCollection = function(csv) {
  var data = Assets.getText(csv);
  var results = Papa.parse(data, {
      header: true
  });

  return results.data
}

initCsvCollection = function(csv, Collection, callb){
    var data = Assets.getText(csv);
    var results = Papa.parse(data, {
        header: true
    });
    bulkCollectionUpdate(Collection, results.data, {
      primaryKey: "id",
      callback: callb || function() {
        console.log("Done. Collection "+ Collection["_name"] + " now has " +       Collection.find().count() + " documents.");
      }
    });
}

Meteor.startup(function() {
  var ConceptColl = MPlugin.Plugins['loredanacirstea:plugin-ontology'].Collection['pluginconcept']._collection
  var OntologyColl = MPlugin.Plugins['loredanacirstea:plugin-ontology'].Collection['pluginontology']._collection
  var RelationColl = MPlugin.Plugins['loredanacirstea:plugin-ontology'].Collection['pluginrelation']._collection

  var Chloro = MPlugin.Plugins['loredanacirstea:plugin-ontology'].Collection['testchloropleth']._collection

    /*if(!Chloro.findOne())
      for(ch of chloros)
        Chloro.insert(ch)*/


  //if(OntologyColl.find().count() === 0) {
    //initCsvCollection('data/ontology.csv', OntologyColl)
    //initCsvCollection('data/term.csv', ConceptColl)
    //initCsvCollection('data/termrel.csv', RelationColl)
    //initCsvCollection('data/pluginontology.csv', OntologyColl)
    //if(ConceptColl.find().count() < 300000)
    //  initCsvCollection('data/pluginconcept.csv', ConceptColl)
    //if(RelationColl.find().count() < 900000)
    //  initCsvCollection('data/pluginrelation.csv', RelationColl)
  //}

  //add ontology id to concepts
  //Ontology.iniOntoId(ConceptColl, RelationColl, ['be8155c2-7759-11e4-adb6-57ce06b062da'])
  //Ontology.iniOntoId(ConceptColl, RelationColl, ['be98c37e-7759-11e4-adb6-57ce06b062da'])
  //Ontology.iniOntoId(ConceptColl, RelationColl, ['be805fbe-7759-11e4-adb6-57ce06b062da'])

  /*if(!OntologyColl.findOne({title: 'Geo Location'})) {
    console.log('insert Geo Location ontology')
    parseGeo(OntologyColl, ConceptColl, RelationColl)
  }*/

  //add ontology id to concepts

  /*var ontos = OntologyColl.find().fetch()

  var ontoids = []
  for(o of ontos)
    if(o.concept)
      ontoids.push(o.concept)*/

  //Ontology.iniOntoId(ConceptColl, RelationColl, ontoids)

})

parseGeo = function(OntologyColl, ConceptColl, RelationColl) {

  var ontoConcept = Random.id()
  var concept

  //insert ontology
  OntologyColl.insert({
    title: 'Geo Location',
    description: 'Geo Location',
    concept: ontoConcept,
    language: 'en',
    relation_type: 1,
    relation_name: 'structural',
    updatedAt: new Date()
  })

  //insert root concept
  ConceptColl.insert({
    concept: ontoConcept,
    language: 'en',
    term: 'Geo Location',
    ontology: ontoConcept
  })

  //insert countries and rels
  for(g of GeoLocation) {
    concept = Random.id()
    //insert concept
    ConceptColl.insert({
      concept: concept,
      language: 'en',
      term: g.name.common,
      ontology: ontoConcept
    })

    //insert rel
    RelationColl.insert({
      concept1: concept,
      concept2: ontoConcept,
      relation: 1,
      ordering: 1,
      updatedAt: new Date()
    })
  }
}






updateFamily = function(Concepts, Relations, id, obj) {
  //var c = Concepts.findOne({concept: id})
  //if(c.ontology !== obj.ontology) {
    Concepts.update({concept: id}, {$set: obj}, {multi: true})
    console.log(id)
    var kids = Relations.find({concept2: id}).fetch()

    for(k of kids)
      updateFamily(Concepts, Relations, k.concept1, obj)
  //}
}

Ontology.iniOntoId = function(Concepts, Relations, ontoIds) {
  if(!(ontoIds instanceof Array))
    ontoIds = [ontoIds]
  console.log('iniOntoId')
  console.log(ontoIds)
  for(id of ontoIds) {
    console.log(id)
    updateFamily(Concepts, Relations, id, {ontology: id})
    console.log(id + ' finished')
  }
}








//not used:

childLoop = function(ConceptColl, RelationColl, tempConcept, tempRel, tempDescr, tempLang, concept, ontoConcept) {

  var descr = findDescription(tempDescr, tempLang, concept)

  //insert in concept
  ConceptColl.insert({
    concept: concept,
    language: descr.languagecode,
    term: descr.term,
    ontology: ontoConcept
  })

  //insert rels with parents

  var rels = RelationColl.find({sourceid: concept}).fetch()

  for(r of rels) {

    var time = r.effectivetime.substring(0,4) + '-' + r.effectivetime.substring(4,6) + '-' + r.effectivetime.substring(6)

    RelationColl.insert({
      concept1: concept,
      concept2: r.destinationid,
      relation: r.typeid,
      ordering: 1,
      updatedAt: new Date(time)
    })
  }

  //loop through kids
  var kidrels = RelationColl.find({destinationid: concept}).fetch()

  for(k of kidrels)
    childLoop(ConceptColl, RelationColl, tempConcept, tempRel, tempDescr, tempLang, k.sourceid,ontoConcept)
}

findDescription = function(tempDescr, tempLang, concept) {
  //if we have a Fully specified name, we return that
  var descr = tempDescr.findOne({conceptid: concept, typeid: '900000000000003001'})

  if(descr)
    return descr

  //otherwise, we iterate through synonyms
  var synon = tempDescr.find({conceptid: concept}).fetch()

  for(s of synon) {

    //we check if there is a preffered synonim (acceptabilityid) for the US dialect (refsetid)
    var preff = tempLang.findOne({referencedcomponentid: s.id, acceptabilityid: '900000000000548007', refsetid: '900000000000509007'})

    if(preff)
      return s
  }

}

initParseSNOMED = function(ConceptColl, RelationColl, tempConcept, tempRel, tempDescr, tempLang) {
  console.log('initParseSNOMED')

  var root = '138875005'

  //iterate through SNOMED ontologies
  var ontos = tempRel.find({destinationid: root}).fetch()

  for(o of ontos) {

    console.log('inserting ontology: ' + o.sourceid)

    //insert concepts and relations
    childLoop(ConceptColl, RelationColl, tempConcept, tempRel, tempDescr, tempLang, o.sourceid, o.sourceid)

    //insert in ontology - for each relation type
    var ontoc = ConceptColl.findOne({concept: o.sourceid})
    if(ontoc) {

      var reltypes = []
      var rels = RelationColl.find({sourceid: o.sourceid}).fetch()
      for(r of rels)
        if(reltypes.indexOf(r.typeid) === -1)
          reltypes.push(r.typeid)

      for(r of reltypes)
        OntologyColl.insert({
          title: ontoc.term,
          description: ontoc.term,
          concept: o.sourceid,
          language: ontoc.language,
          relation_type: r,
          //relation_name: 'structural',
          updatedAt: new Date()
        })
    }
  }
}


parseSNOMED = function (OntologyColl, ConceptColl, RelationColl) {
  console.log('parseSNOMED')
  //var tempOnto = new Mongo.Collection('tempontology')
  var tempConcept = new Mongo.Collection('tempSNOMEDconcept')
  var tempRel = new Mongo.Collection('tempSNOMEDrelation')
  var tempDescr = new Mongo.Collection('tempSNOMEDdescription')
  var tempLang = new Mongo.Collection('tempSNOMEDlangrefset')

  //insert temporary data in mongo
  initCsvCollection('data/curr_concept_f.csv', tempConcept, function() {

    console.log("Done. Collection "+ tempConcept["_name"] + " now has " + tempConcept.find().count() + " documents.");

    initCsvCollection('data/curr_description_f.csv', tempDescr, function() {

      console.log("Done. Collection "+ tempDescr["_name"] + " now has " + tempDescr.find().count() + " documents.");

      initCsvCollection('data/curr_relationship_f.csv', tempRel, function() {

        console.log("Done. Collection "+ tempRel["_name"] + " now has " + tempRel.find().count() + " documents.");

        initCsvCollection('data/curr_langrefset_f.csv', tempLang, function() {
          
          console.log("Done. Collection "+ tempLang["_name"] + " now has " + tempLang.find().count() + " documents.");

          initParseSNOMED(ConceptColl, RelationColl, tempConcept, tempRel, tempDescr, tempLang)

        })
      })
    })
  })
}