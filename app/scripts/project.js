//model
var ProjectDescr = Backbone.Model.extend({
    defaults: {
        name: "fsf",
        imgList: 0,
        description: "test test" 
    },
}); 

//collection
var ProjectDescrCollection = Backbone.Collection.extend({
    defaults: {
        model: ProjectDescr
    },
    model: ProjectDescr,
    url: '/data/projects.json'
});

//view
var ProjectDescrView = Backbone.View.extend({
     el: '.project',
     events: {
        "click section.title a.project-close": "closeClickProject",
        "click section.title a.prev-project": "prevProject",
        "click section.title a.next-project": "nextProject"
    },
     
    initialize: function () { 

        this.imgOpen = false;

        this.collection = new ProjectDescrCollection();
        this.collection.bind("reset", this.render, this);
        this.collection.bind("sync", this.render, this);
    }, 
 
    getProject: function(pName) {   
        this.currentProject = pName; 
        this.collection.url = "data/" + pName + ".json";
        this.collection.fetch();   
    },    
               
    render: function () {       
        this.lockButtons = false; 
        var template = _.template($('#project').html(), {project: this.collection.models[0], currentProject:this.currentProject});
        this.$el.find(".container").html(template);  
        _gaq.push(['_trackEvent', 'Page', 'Click', this.collection.models[0].attributes.name]);

        if(!window.isMobile) {
            $("#slider").hover(this.overImages, this.outImages);
            $("#slider").bind("click", this.showImage);  
        }  

        if(window.isMobile) {
            TweenLite.to($(".project .container section.img-list"), 0, { rotationY : 0 });
        }  
        window.mySwipe = new Swipe(document.getElementById('slider'), {
              
            speed: 400,           
            continuous: true,     
            disableScroll: false,          
            auto : 3000,              
            stopPropagation: false,  
            callback: function(index, elem) {},   
            transitionEnd: function(index, elem) {}   
        });  

         if(window.isMobile) {
            TweenLite.to($(".project .container section.img-list"), 0, { rotationY : 90 });
        }
 
        $("#slider a").hover(this.overArrow, this.outArrow);  

        $("#slider a.prev").click(this.goPrev);
 
        $("#slider a.next").click(this.goNext);  

        var self = this;       
        $("#slider a.close").bind("click", {ref : self}, this.closeSlideShow);
        $(".project .container section.dev").css("min-height", $(".projects-list .container").height() - $(".project .container section.dev").offset().top);

        var d = 0;
        if(!window.isMobile) {
            TweenLite.to($("#slider img"), 0, { y : -1 * (860 - 200) * .5 }); 
            
        }  else {
            d = 0.3;
        }
       
        TweenLite.to($(".project .container section.title"), 0.8, { rotationY : 0, x : 0, y : 0, z : 0, opacity : 1, ease:Back.easeOut, delay : d }); 

        TweenLite.to($(".project .container section.img-list"), 0.8, { rotationY : 0, x : 0, y : 0, z : 0, opacity : 1, delay:(d + 0.3), ease:Back.easeOut }); 

        TweenLite.to($(".project .container section.dev"), 0.8, { rotationY : 0, x : 0, y : 0, z : 0, delay:(d + 0.6), opacity : 1, ease:Back.easeOut }); 


        if(window.navHelper.curr === 0) {
            $("section.title a.prev-project").addClass("disabled");
        }
        if(window.navHelper.curr >= window.navHelper.total - 1) {
            $("section.title a.next-project").addClass("disabled");
        }
    },   

    prevProject: function(e) {
        e.preventDefault();

        if(window.navHelper.curr === 0 || this.lockButtons) {
            return;
        }

        window.navHelper.toGo = window.navHelper.curr - 1;

        this.closeProject(true);
    },   

    nextProject: function(e) {
        e.preventDefault();   
        if(window.navHelper.curr >= window.navHelper.total - 1 || this.lockButtons) {
            return;
        }     

        window.navHelper.toGo = window.navHelper.curr + 1;

        this.closeProject(true);
    },
 
    closeClickProject : function(e) {   
        e.preventDefault();

        this.closeProject();
    },

    closeProject: function(openAfter) {
        this.lockButtons = true; 
        TweenLite.to($(".project .container section.dev"), 0.6, { rotationX : 90, x : 0, y : 0, z : 1000, opacity : 0, ease:Quad.easeIn }); 

        TweenLite.to($(".project .container section.img-list"), 0.6, { rotationX : 90, x : 0, y : 0, z : 1000, opacity : 0, delay:0.2, ease:Quad.easeIn }); 

        TweenLite.to($(".project .container section.title"), 0.6, { rotationX : 90, x : 0, y : 0, z : 1000, opacity : 0, delay:0.4, ease:Quad.easeIn, onComplete : function() {
            window.mySwipe.kill()
            window.project.$el.find(".container").html("");
            if(!openAfter) {
                window.app_router.navigate("#");
            } else {
                var fName = window.projectList.collection.models[window.navHelper.toGo].attributes.filename;
                window.app_router.navigate("project/" + fName, {trigger: true});
            }
            
        } }); 
    },

    overArrow : function(e) {
        if($(this).hasClass("close")) {
            TweenLite.to($(this).find(".sp"), 0.2, {y:-10});
        } else {
            TweenLite.to($(this).find(".sp"), 0.2, {x:20});
        }
        
    },

    outArrow : function(e) {
        if($(this).hasClass("close")) {
            TweenLite.to($(this).find(".sp"), 0.2, {y:0});
        } else {
            TweenLite.to($(this).find(".sp"), 0.2, {x:0});
        }
    },

    goPrev : function(e) {
        e.preventDefault();
        window.mySwipe.prev();
    },

    goNext : function(e) {
        e.preventDefault();
        window.mySwipe.next();
    },
 
    overImages : function(e) {
        if(window.project.imgOpen) {
            return;
        }
        TweenLite.to($(this), 0.5, {maxHeight:220});
    },

    outImages : function(e) {
        if(window.project.imgOpen) {
            return;
        }
        TweenLite.to($(this), 0.5, {maxHeight:200});
    },  

    showImage : function() {
        window.project.imgOpen = true; 
        $(this).addClass("open");
        TweenLite.to($(this), 0.3, {maxHeight:1000, delay : 0.25});
        TweenLite.to($("#slider img"), 0.25, { y : 0 });
         window.mySwipe.auto = 0;
        $(this).find("a").css({
            "display" : "block",
            "opacity" : 0
        });

        TweenLite.to($(this).find("a"), 0.5, {opacity:1});
        $("#slider").unbind("click"); 
    },

    closeSlideShow : function(e) {
        e.preventDefault(); 
        
        
        TweenLite.to($("#slider"), 0.5, {maxHeight:200, onComplete:function () {
            window.project.imgOpen = false; 
            $("#slider").removeClass("open"); 
            $("#slider").bind("click", window.project.showImage);
            TweenLite.to($("#slider img"), 0.2, { y : -1 * (860 - 200) * .5 });
            
            window.mySwipe.auto = 3000;
        }});

        TweenLite.to($("#slider").find("a"), 0.5, {opacity:0, onComplete:function () {
            $("#slider").find("a").css({
            "display" : "none"
        });
        }});
        
    } 
});