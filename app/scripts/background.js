var BackgroundView = Backbone.View.extend({
	el: '#d3-canvas', 
    
    initialize: function () {
    	this.element = this.$el.get(0);
  		

  		if(!window.isMobile) {
    		this.buidlVoronoi();
    	}

    	this.timer = -1;
 
    	$(window).on("resize", this.resize);  
    } ,

    resize: function() {   
    	$("#d3-canvas").empty();

    	if(window.isMobile) {
    		return;
    	}

    	clearTimeout(this.timer);
    	this.timer = window.setTimeout(function() { window.background.buidlVoronoi(); }, 200);
    	
    },

    buidlVoronoi: function() {
    	var w = $(window).width(); 
    	var h = $(window).height(); 
    	var self = this;
    	this.vertices = d3.range(400).map(function(d) {
    		 return [Math.random() * w, Math.random() * h];
    	}); 

    	var svg = d3.select("#d3-canvas")
		   	.append("svg:svg")
		    .attr("width", w)
		    .attr("height", h)
		    .attr("class", "PiYG");

		var hw = w * .5;
		var hh = h * .5;
		var maxDist = hw * hw + hh * hh;
		svg.selectAll("path")
		.data(d3.geom.voronoi(this.vertices)) 
		.enter().append("svg:path")
		.attr("d", function(d) { return "M" + d.join("L") + "Z"; })
		.attr("stroke-width", "5")
		.attr("style", function(d) {
			var x = Math.abs(d[0][0] - hw);  
			var y = Math.abs(d[0][1] - hh);
			var c = Math.round((x * x + y * y) / maxDist * 255);
			return "stroke:rgb("+c+", "+c+", "+c+");";
		});
    }
});