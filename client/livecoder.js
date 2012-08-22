var typingTimer;
var doneTypingInterval = 1000;

Snippets = new Meteor.Collection('snippets');

Session.set('snippet_id', null);

Template.main.snippet_selected = function() {
    return !Session.equals('snippet_id', null);
};

Template.main.url = function() {
    return document.location;
}

Template.main.snippet = function() {
    return Snippets.findOne({_id: Session.get('snippet_id')}) || { content : '' };
}

Template.main.events = {
    'click #startSession' : function() {
        Router.setSnippet(Snippets.insert({content: ''}));
    },
    'keyup #snippet' : function(event) {
        clearTimeout(typingTimer);
        if (event.target.value) {
            typingTimer = setTimeout(updateContent, doneTypingInterval, event.target.value);
        }
    }
};

var updateContent = function(content) {
    Snippets.update({_id: Session.get('snippet_id')}, {$set: {content: content}});
};

var AppRouter = Backbone.Router.extend({
    routes: {
        ":snippet_id": "main"
    },
    main: function(snippet_id) {
        Session.set("snippet_id", snippet_id);
    },
    setSnippet: function(snippet_id) {
        this.navigate(snippet_id, true);
    }
});

Router = new AppRouter;

Meteor.startup(function () {
    Backbone.history.start({pushState: true});
});