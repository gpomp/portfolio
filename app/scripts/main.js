/*global portfolio, $*/


var transform = function() {

}

window.portfolio = {
    Models: {},
    Collections: {},
    Views: {},
    Routers: {},
    init: function () {
        'use strict';
        console.log('Hello from Backbone!');
    }
};

$(document).ready(function () {
    'use strict';

    window.isMobile = $(window).width() <= 1024 && $("html").hasClass("touch");

    window.background = new BackgroundView();
    window.projectList = new ProjectsView();
    window.project = new ProjectDescrView();

    window.app_router = new AppRouter();
    window.homeRendered = false;

    window.projectList.collection.fetch();

    window.projectList.once("pListReady", window.setRouter);
    
    // Instantiate the router



     
});

window.setRouter = function() {
    window.app_router.on('route:getProject', function (id) {

        if(window.isMobile) {
            $("body").scrollTop($("header").height() - 30);

        }
        
        if(!window.homeRendered) {
            window.projectList.collection.fetch();
        }

        for (var i = 0; i < window.projectList.collection.models.length; i++) {
            var fname = window.projectList.collection.models[i].attributes.filename;

            if(fname === id) {
                window.navHelper.curr = i;
                break;
            }
        };
        // Note the variable in the route definition being passed in here
        window.project.getProject(id);
    });
    window.app_router.on('route:defaultRoute', function (actions) {
        if(!window.homeRendered) {
            window.projectList.collection.fetch();
        }
    });
    // Start Backbone history a necessary step for bookmarkable URL's
    Backbone.history.start();
}
