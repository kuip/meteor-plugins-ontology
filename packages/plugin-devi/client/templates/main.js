  Meteor.subscribe('publicDocuments')
  Meteor.subscribe('userDocuments')
  Session.setDefault("editorType", "cm");

Template.main.onCreated(function() {
  this.autorun(function() {
    Session.set("document", FlowRouter.getParam('id'));
  })
})

  Template.docList.helpers({
    documents: function() {
      return D.p.Documents.find();
    }
  });

  Template.docList.events = {
    "click button": function() {
      Meteor.call('insertDocument', {
        title: "untitled",
        permission: 'private'
      }, function (err, id) {
        if(err)
          console.log(err)
        if(id)
          Session.set("document", id);
      })
    }
  };

  Template.docItem.helpers({
    current: function() {
      return Session.equals("document", this._id);
    }
  });

  Template.docItem.events = {
    "click a": function(e) {
      e.preventDefault();
      FlowRouter.go('/devi/' + this._id)
    }
  };


  Template.docTitle.helpers({
    title: function() {
      var ref;
      return (ref = D.p.Documents.findOne(this + "")) != null ? ref.title : void 0;
    },
    editorType: function(type) {
      return Session.equals("editorType", type);
    },
    permission: function() {
      var doc = D.p.Documents.findOne(this+'')
      if(doc)
        return doc.permission
    }
  });

  Template.docTitle.events({
    'change #changePermissions': function(ev, instance) {
      var newPermission = instance.$(ev.currentTarget).find('option:selected').val()
      Meteor.call('updateDocument', {permission: newPermission});
    }
  })

  Template.editor.helpers({
    docid: function() {
      return Session.get("document");
    }
  });

  Template.editor.events = {
    "keydown input[name=title]": function(e) {

      var id;
      if (e.keyCode !== 13) {
        return;
      }
      e.preventDefault();
      $(e.target).blur();
      id = Session.get("document");

      Meteor.call('updateDocument', id, {
        title: e.target.value
      })
    },
    "click .delete": function(e) {
      var id;
      e.preventDefault();
      id = Session.get("document");
      Session.set("document", null);
      return Meteor.call("deleteDocument", id);
    },
    "click .rawcode": function(e) {
      var id;
      e.preventDefault();
      id = Session.get("document")
      window.open('/raw/'+id, '_blank')
    },
    "click .preview": function(e) {
      var id;
      e.preventDefault();
      id = Session.get("document");
      window.open('/prev/'+id, '_blank')
    },
    "change input[name=editor]": function(e) {
      console.log('change input editor: ' + e.target.value)
      return Session.set("editorType", e.target.value);
    }
  };

  Template.editor.helpers({

    cm: function() {
      return Session.equals("editorType", "cm");
    },

    configAce: function() {
      return function(ace) {
        ace.setTheme('ace/theme/monokai');
        ace.setShowPrintMargin(false);
        return ace.getSession().setUseWrapMode(true);
      };
    },
    configCM: function() {
      return function(cm) {

        cm.on('change',function(cMirror){
          umls = [];
          seqs=[];
          toc = [];
          document.getElementById("prev").style.top="0px"
        document.getElementById("prev").style.height="100%"
          prev.innerHTML =marked(cMirror.getValue());
          //MathJax.Hub.Queue(["Reprocess", MathJax.Hub, "prev"])
        });

        cm.setOption("theme", "default");
        cm.setOption("lineNumbers", true);
        cm.setOption("lineWrapping", true);
        cm.setOption("smartIndent", true);
        cm.setOption("mode", "markdown");
        cm.setOption("viewportMargin", Infinity);
        return cm.setOption("indentWithTabs", true);
      };
    }
  });

