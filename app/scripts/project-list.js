//model
var Project = Backbone.Model.extend({
    defaults: {
        filename: 'nike',
        name: "http://www.rcolepeterson.com/cole.jpg"
    },  
});
 
//collection 
var ProjectsCollection = Backbone.Collection.extend({
    defaults: {
        model: Project 
    },
    model: Project,
    url: '/data/projects.json'
}); 
 
//view
var ProjectsView = Backbone.View.extend({
     el: '.projects-list',
    initialize: function () {

        this.collection = new ProjectsCollection();
        //this.collection.bind("reset", this.render, this);
        this.collection.bind("sync", this.render, this);
    },

    render: function () {
        var template = _.template($('#projects-list').html(), {projects: this.collection.models});
        this.$el.find(".container").html(template);

        window.navHelper = {
            "total" : this.collection.models.length,
            "curr" : -1,
            "toGo" : -1
        }

        this.$el.find("a").bind("click", this.clickEl);
        if(!window.isMobile) {
            this.$el.find("a").hover(function(e) {
                var deg = 3 + Math.random() * 5;
                deg = (Math.random() > .5) ? deg : -1 * deg; 
                var s = 1.1 + Math.random() * 0.30; 
                TweenLite.to($(this).find("> div").find("> div"), 0.5, {rotation:deg, scale:s});
            }, function(e) {
                TweenLite.to($(this).find("> div").find("> div"), 0.5, {rotation:0, scale:1.0});
            });
        }

        window.homeRendered = true;

        $(window).on("resize", this.resize);

        this.resize(); 

        this.trigger("pListReady");

    },

    resize: function(e) {

        var first = $(".projects-list ul li").eq(0);  
        var ml = Math.floor($(".projects-list .container").width() / (first.outerWidth()));
        var margin = ($(".projects-list .container").width() - ml * (first.outerWidth())) / 2; 
        $(".projects-list .container").css("padding-left", Math.round(margin) + "px");
        $(".projects-list .container").css("min-height", ($(window).height() - $("header").height()) + "px");

        $(".project .container").css('padding-top', $("header").height());

    },

    clickEl: function(e) {  
        e.preventDefault();
        var fName = $(this).attr("href");

        
        window.app_router.navigate("project/" + fName, {trigger: true});
    }
});