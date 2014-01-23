var AppRouter = Backbone.Router.extend({
        routes: {
            "project/:id": "getProject",
            "*actions": "defaultRoute"
        }
    });
    